"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSearchParams, useRouter } from "next/navigation";
import {
  useVerifyPhoneOtp,
  useVerifyChangePhoneOtp,
} from "@/features/auth/hooks";
import { useQueryClient } from '@tanstack/react-query';
import { useSendPhoneOtp, useSendChangePhoneOtp } from "@/features/auth/hooks";
import { setToken } from "@/lib/cookies";
import { toast } from "sonner";

const verificationSchema = z.object({
  code: z
    .string()
    .length(5, "Code must be 5 digits")
    .regex(/^\d+$/, "Code must contain only numbers"),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export default function Verification() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const phone = searchParams.get("phone") ?? "";
  const isSocialFlow = searchParams.get("flow") === "social-phone";
  const isProfileCompleted = searchParams.get("isProfileCompleted") === "true";

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { code: "" },
  });

  const [code, setCode] = useState<string[]>(["", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const onSuccessCallback = (data: any) => {
    console.log(data, "data");

    if (data.success) {
      if (isSocialFlow) {
        // For social flow, data.data is the user object directly, and token is already set.
        const profileCompleted = data.data?.isProfileCompleted ?? isProfileCompleted;
        if (data.data) {
          queryClient.setQueryData(['userOwn'], {
            success: true,
            message: data.message || '',
            data: data.data,
          });
        }
        if (profileCompleted) {
          router.replace("/dashboard");
        } else {
          router.replace("/profile");
              document.cookie = `isProfileCompleted=${data.data.user.isProfileCompleted}; path=/; max-age=86400; SameSite=Lax`;
        }
      } else {
        // For normal flow, data.data is { token: string, user: User }
        if (data.data && data.data.token) {
          setToken(data.data.token);
          if (data.data.user) {
            queryClient.setQueryData(['userOwn'], {
              success: true,
              message: data.message || '',
              data: data.data.user,
            });
          }
          // still invalidate to ensure any server-side differences are refreshed
          queryClient.invalidateQueries({ queryKey: ['userOwn'] });
          if (data.data.user?.isProfileCompleted) {
            router.replace("/dashboard");
          } else {
            document.cookie = `isProfileCompleted=${data.data.user.isProfileCompleted}; path=/; max-age=86400; SameSite=Lax`;
            router.replace("/profile");
          }
        } else {
          // Reset jobs-count popup flag so it can be shown after login/registration
          router.replace('/dashboard');
        }
      }
    }
  };

  const onErrorCallback = () => {
    // Handled by global Axios interceptor
  };

  const { mutate: verifyOtp, isPending: isVerifyPending } = useVerifyPhoneOtp({
    onSuccess: onSuccessCallback,
    onError: onErrorCallback,
  });

  const { mutate: verifyChangeOtp, isPending: isVerifyChangePending } =
    useVerifyChangePhoneOtp({
      onSuccess: onSuccessCallback,
      onError: onErrorCallback,
    });

  const isPending = isSocialFlow ? isVerifyChangePending : isVerifyPending;

  const onResendSuccess = () => {
    setResendTimer(60);
    setCanResend(false);
    setCode(["", "", "", "", ""]);
    setValue("code", "");
    inputRefs.current[0]?.focus();
  };

  const { mutate: resendOtp } = useSendPhoneOtp({
    onSuccess: onResendSuccess,
  });

  const { mutate: resendChangeOtp } = useSendChangePhoneOtp({
    onSuccess: onResendSuccess,
  });

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setValue("code", newCode.join(""));

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const onFormSubmit = (data: VerificationFormData) => {
    if (isSocialFlow) {
      verifyChangeOtp({ phone, otp: data.code });
    } else {
      verifyOtp({ phone, role: "user", otp: data.code });
    }
  };

  const formatTimer = (secondsLeft: number) => {
    const m = Math.floor(secondsLeft / 60);
    const s = secondsLeft % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="w-full h-screen flex justify-center items-center max-w-md mx-auto">
      <div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#181818] mb-3">
            Verification
          </h1>
          <p className="text-base text-[rgba(24,24,24,0.8)]">
            Enter the code sent to {phone || "your phone"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
          <div className="flex justify-center gap-4">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                placeholder="0"
                className="w-16 h-16 bg-[#F8F8F8] text-[#005864] text-center text-lg font-semibold border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors"
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "#005864";
                  (e.target as HTMLInputElement).style.borderWidth = "0.8px";
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = "#E0E0E0";
                  (e.target as HTMLInputElement).style.borderWidth = "2px";
                }}
                autoComplete="off"
                inputMode="numeric"
              />
            ))}
          </div>

          {errors.code && (
            <p className="text-red-500 text-sm text-center">
              {errors.code.message}
            </p>
          )}

          <div className="text-center">
            <p className="text-sm text-[rgba(24,24,24,0.8)]">
              Didn't receive code?{" "}
              {canResend ? (
                <button
                  type="button"
                  onClick={() => {
                    if (isSocialFlow) {
                      resendChangeOtp({ phone });
                    } else {
                      resendOtp({ phone, role: "user" });
                    }
                  }}
                  className="text-[#005864] font-medium hover:underline"
                >
                  Resend
                </button>
              ) : (
                <span className="text-[#005864] font-medium">
                  Resend in {formatTimer(resendTimer)}
                </span>
              )}
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending || code.join("").length !== 5}
            className="w-full bg-[#005864] text-white py-3 rounded-lg font-semibold text-base hover:bg-[#004550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
}
