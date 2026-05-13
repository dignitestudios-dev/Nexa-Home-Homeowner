'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useSearchParams, useRouter } from 'next/navigation'
import { useVerifyPhoneOtp } from '@/features/auth/hooks'
import { useSendPhoneOtp } from '@/features/auth/hooks'
import { setToken } from '@/lib/cookies'

const verificationSchema = z.object({
  code: z
    .string()
    .length(5, 'Code must be 5 digits')
    .regex(/^\d+$/, 'Code must contain only numbers'),
})

type VerificationFormData = z.infer<typeof verificationSchema>

export default function Verification() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const phone = searchParams.get('phone') ?? ''

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: { code: '' },
  })

  const [code, setCode] = useState<string[]>(['', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(14)
  const [canResend, setCanResend] = useState(false)
  const [apiError, setApiError] = useState('')
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [resendTimer])

  const { mutate: verifyOtp, isPending } = useVerifyPhoneOtp({
    onSuccess: (data) => {
      if (data.success && data.data) {
        setToken(data.data.token)
        if (data.data.user.isProfileCompleted) {
          router.push('/dashboard')
        } else {
          router.push('/profile')
        }
      } else {
        setApiError(data.message || 'Invalid or expired OTP')
      }
    },
    onError: () => {
      setApiError('Invalid or expired OTP')
    },
  })

  const { mutate: resendOtp } = useSendPhoneOtp({
    onSuccess: () => {
      setResendTimer(14)
      setCanResend(false)
      setCode(['', '', '', '', ''])
      setValue('code', '')
      inputRefs.current[0]?.focus()
    },
  })

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)
    setValue('code', newCode.join(''))
    setApiError('')

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 4) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const onFormSubmit = (data: VerificationFormData) => {
    setApiError('')
    verifyOtp({ phone, role: 'user', otp: data.code })
  }

  return (
    <div className="w-full h-screen flex justify-center items-center max-w-md mx-auto">
      <div>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#181818] mb-3">Verification</h1>
          <p className="text-base text-[rgba(24,24,24,0.8)]">
            Enter the code sent to {phone || 'your phone'}
          </p>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
          <div className="flex justify-center gap-4">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                placeholder="0"
                className="w-16 h-16 bg-[#F8F8F8] text-[#005864] text-center text-lg font-semibold border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors"
                onFocus={(e) => {
                  ;(e.target as HTMLInputElement).style.borderColor = '#005864'
                  ;(e.target as HTMLInputElement).style.borderWidth = '0.8px'
                }}
                onBlur={(e) => {
                  ;(e.target as HTMLInputElement).style.borderColor = '#E0E0E0'
                  ;(e.target as HTMLInputElement).style.borderWidth = '2px'
                }}
                autoComplete="off"
                inputMode="numeric"
              />
            ))}
          </div>

          {(errors.code || apiError) && (
            <p className="text-red-500 text-sm text-center">
              {errors.code?.message || apiError}
            </p>
          )}

          <div className="text-center">
            <p className="text-sm text-[rgba(24,24,24,0.8)]">
              Didn't receive code?{' '}
              {canResend ? (
                <button
                  type="button"
                  onClick={() => resendOtp({ phone, role: 'user' })}
                  className="text-[#005864] font-medium hover:underline"
                >
                  Resend
                </button>
              ) : (
                <span className="text-[#005864] font-medium">
                  Resend in 0:{resendTimer.toString().padStart(2, '0')}
                </span>
              )}
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending || code.join('').length !== 5}
            className="w-full bg-[#005864] text-white py-3 rounded-lg font-semibold text-base hover:bg-[#004550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Verifying...' : 'Verify'}
          </button>
        </form>
      </div>
    </div>
  )
}
