"use client";

import { useState, useRef } from "react";
import { AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { useDeleteAccount } from "@/features/auth/hooks";
import { removeToken } from "@/lib/cookies";

export default function DeleteAccount() {
  const router = useRouter();

  const [isChecking, setIsChecking] = useState(false);
  const [jobsPopupOpen, setJobsPopupOpen] = useState(false);
  const [confirmPopupOpen, setConfirmPopupOpen] = useState(false);

  // Cache the count after first fetch — never fetch again
  const jobCountRef = useRef<number | null>(null);

  const { mutate: deleteAccount, isPending: isDeleting } = useDeleteAccount({
    onSuccess: () => {
      removeToken()
      router.push("/login");
    },
  });

  const handleDeleteIntent = async () => {
    // If already fetched, just open the right popup directly
    if (jobCountRef.current !== null) {
      if (jobCountRef.current > 0) {
        setJobsPopupOpen(true);
      } else {
        setConfirmPopupOpen(true);
      }
      return;
    }

    // First time — fetch once
    try {
      setIsChecking(true);
      const res = await apiClient.get<{ data: { count: number } }>('/job/my-jobs/count');
      const count = res.data.data.count;
      jobCountRef.current = count;
      if (count > 0) {
        setJobsPopupOpen(true);
      } else {
        setConfirmPopupOpen(true);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const jobCount = jobCountRef.current ?? 0;

  return (
    <>
      <div className="space-y-6">
        <div>
          <h2 className="text-[24px] font-semibold text-[#181818]">
            Delete Account
          </h2>
        </div>

        <div className="rounded-2xl border p-6">
          <h3 className="text-[20px] font-semibold text-[#181818]">
            Permanently Delete Your Account
          </h3>

          <button
            type="button"
            onClick={handleDeleteIntent}
            disabled={isChecking}
            className="mt-6 flex h-[49px] items-center justify-center rounded-[12px] bg-[rgba(255,0,0,0.12)] px-6 text-[14px] font-medium text-[#FF0000] transition hover:bg-[rgba(255,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? "Checking..." : "Delete Account"}
          </button>
        </div>
      </div>

      {/* ── Ongoing Jobs popup ── */}
      <Dialog open={jobsPopupOpen} onOpenChange={setJobsPopupOpen}>
        <DialogContent className="p-0 border-none shadow-xl rounded-[24px] bg-white w-[515px] max-w-[515px]! overflow-hidden">
          <div className="flex flex-col items-center px-[43px] pt-[34px] pb-[32px]">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 80, height: 80, background: "rgba(0, 88, 100, 0.06)" }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path
                  d="M8 21L16 29L32 13"
                  stroke="#005864"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="flex flex-col items-center gap-4 mt-[22px] w-full">
              <DialogTitle
                className="text-center font-semibold text-[#181818] capitalize leading-[40px] tracking-[-0.008em]"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 32, lineHeight: "40px" }}
              >
                Mark Your Jobs As Completed
              </DialogTitle>

              <DialogDescription
                className="text-center text-[#676767] font-normal"
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: 18, lineHeight: "160.5%" }}
              >
                You have {String(jobCount).padStart(2, "0")} job{jobCount !== 1 ? "s" : ""} waiting to be marked as complete.
              </DialogDescription>

              <div className="flex flex-row gap-4 w-full mt-2">
                <button
                  type="button"
                  onClick={() => setJobsPopupOpen(false)}
                  className="flex-1 h-[55px] flex items-center justify-center rounded-[8px] font-semibold text-[13px] text-[#005864] transition-colors hover:opacity-80"
                  style={{ background: "rgba(0, 88, 100, 0.06)", fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  Later
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setJobsPopupOpen(false);
                    router.push("/dashboard?tab=ongoing");
                  }}
                  className="flex-1 h-[55px] flex items-center justify-center rounded-[8px] font-semibold text-[13px] text-white bg-[#005864] hover:bg-[#004d57] transition-colors"
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  View Jobs
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Confirm delete popup ── */}
      <Dialog open={confirmPopupOpen} onOpenChange={setConfirmPopupOpen}>
        <DialogContent className="sm:max-w-[360px] p-0 border-none rounded-[16px] overflow-hidden min-h-[251px]">
          <div className="relative flex flex-col items-center justify-center bg-white px-5 pt-8 pb-6 h-full">
            <div className="flex items-center justify-center mb-[14px]">
              <AlertTriangle
                className="h-[42px] w-[42px]"
                fill="#FF0000"
                color="#ffffff"
                strokeWidth={1.5}
              />
            </div>

            <DialogTitle className="text-[24px] font-bold leading-[30px] text-[#181818] mb-2 text-center">
              Delete Account
            </DialogTitle>

            <DialogDescription className="text-[16px] leading-[20px] text-[#565656] text-center max-w-[245px] mb-[27px]">
              Are you sure you want to delete your account?
            </DialogDescription>

            <div className="flex w-full gap-3 justify-center px-1">
              <button
                type="button"
                onClick={() => setConfirmPopupOpen(false)}
                className="flex h-[49px] w-[152px] items-center justify-center rounded-[12px] bg-[#ECECEC] text-[12px] font-medium leading-[16px] text-[#181818] transition hover:bg-[#E0E0E0]"
              >
                No, keep it
              </button>

              <button
                type="button"
                onClick={() => deleteAccount()}
                disabled={isDeleting}
                className="flex h-[49px] w-[152px] items-center justify-center rounded-[12px] bg-[rgba(255,0,0,0.12)] text-[12px] font-medium leading-[16px] text-[#FF0000] transition hover:bg-[rgba(255,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Deleting..." : "Yes, Delete Now"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}