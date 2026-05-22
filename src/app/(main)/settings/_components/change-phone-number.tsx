'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import SuccessDialog from '@/components/ui/success-dialog'
import { useSendChangePhoneOtp, useVerifyChangePhoneOtp } from '@/features/auth/hooks'
import { useGetOwnUser } from '@/features/user/hooks'
import { toast } from 'sonner'

const phoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Phone number must be 10 digits'),
})

type PhoneFormData = z.infer<typeof phoneSchema>

export default function ChangePhoneNumber() {
  const { data: userData } = useGetOwnUser()
  const currentPhone = userData?.data?.phone

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState<string[]>(['', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [errorOpen, setErrorOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  })

  useEffect(() => {
    if (resendTimer > 0 && isDialogOpen) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (resendTimer === 0) {
      setCanResend(true)
    }
  }, [resendTimer, isDialogOpen])

  // Prefill phone input from user data (normalize to 10 digits)
  useEffect(() => {
    if (typeof currentPhone !== 'undefined') {
      const digits = (currentPhone || '').replace(/\D/g, '')
      const normalized = digits.length === 11 && digits.startsWith('1') ? digits.slice(1) : digits
      reset({ phone: normalized || '' })
    }
  }, [currentPhone, reset])

  const { mutate: sendOtp, isPending: isSending } = useSendChangePhoneOtp({
    onSuccess: (data, variables) => {
      if (data.success) {
        setPhone(variables.phone)
        setIsDialogOpen(true)
        setResendTimer(60)
        setCanResend(false)
        setCode(['', '', '', '', ''])
        setTimeout(() => inputRefs.current[0]?.focus(), 100)
      }
    }
  })

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyChangePhoneOtp({
    onSuccess: (data) => {
      if (data.success) {
        setIsDialogOpen(false)
        const msg = data.message || 'Phone Number Changed Successfully'
        setSuccessMsg(msg)
        setSuccessOpen(true)
      }
    }
  })

  const onSubmitPhone = (data: PhoneFormData) => {
    sendOtp({ phone: `+1${data.phone}` })
  }

  const formPhone = watch('phone')
  const currentPhoneDigits = currentPhone ? (currentPhone.replace(/\D/g, '').length === 11 && currentPhone.replace(/\D/g, '').startsWith('1') ? currentPhone.replace(/\D/g, '').slice(1) : currentPhone.replace(/\D/g, '')) : ''
  const phoneChanged = formPhone !== currentPhoneDigits

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1)
    if (!/^\d*$/.test(value)) return

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

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

  const onVerifyOtp = () => {
    const otpString = code.join('')
    if (otpString.length === 5) {
      verifyOtp({ phone, otp: otpString })
    }
  }

  const formatTimer = (secondsLeft: number) => {
    const m = Math.floor(secondsLeft / 60)
    const s = secondsLeft % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex min-h-[520px] flex-col">
      <h2 className="text-[24px] font-semibold leading-none text-[#181818]">Change Phone Number</h2>

      <div className="flex flex-1 items-start justify-center pt-16 sm:pt-20">
        <div className="w-full max-w-[426px]">
          <p className="mb-8 text-center text-[14px] leading-5 text-[rgba(24,24,24,0.6)]">
            Please enter your new phone number.
          </p>

          <form onSubmit={handleSubmit(onSubmitPhone)} className="space-y-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  className="flex h-12 w-[91px] items-center justify-center rounded-[12px] bg-white px-3 text-[#181818]"
                >
                  <Image src="/images/us-flag.png" alt="US Flag" width={22} height={15} className="mr-[5px] object-contain rounded-[2px]" />
                  <span className="text-[14px] font-medium leading-[18px]">+1</span>
                  <ChevronDown className="ml-2 size-4" strokeWidth={1.8} />
                </button>

                <Input
                  {...register('phone')}
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter your 10-digit phone number"
                  className="h-12 flex-1 rounded-[12px] border border-[#005864] bg-[#F8F8F8] px-4 text-base text-[#1C1C1C] placeholder:text-[rgba(24,24,24,0.6)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs pl-[100px]">{errors.phone.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSending || !phoneChanged}
              className="h-12 w-full rounded-[12px] bg-[#005864] px-[10px] text-[16px] font-semibold leading-5 text-white transition-colors hover:bg-[#004a54] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? 'Sending OTP...' : 'Update Phone Number'}
            </button>
          </form>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md border-none px-6 py-8">
          <div className="text-center mb-6">
            <DialogTitle className="text-[28px] font-bold text-[#181818] mb-3">Verification</DialogTitle>
            <DialogDescription className="text-base text-[rgba(24,24,24,0.8)]">
              Enter the code sent to {phone}
            </DialogDescription>
          </div>

          <div className="space-y-8">
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
                  className="w-14 h-14 bg-[#F8F8F8] text-[#005864] text-center text-xl font-semibold border-2 border-[#E0E0E0] rounded-lg focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 transition-colors"
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

            <div className="text-center">
              <p className="text-sm text-[rgba(24,24,24,0.8)]">
                Didn't receive code?{' '}
                {canResend ? (
                  <button
                    type="button"
                    onClick={() => sendOtp({ phone })}
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
              type="button"
              onClick={onVerifyOtp}
              disabled={isVerifying || code.join('').length !== 5}
              className="w-full bg-[#005864] text-white py-3 rounded-lg font-semibold text-base hover:bg-[#004550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isVerifying ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </DialogContent>
      </Dialog>

        <SuccessDialog
          open={successOpen}
          onClose={() => setSuccessOpen(false)}
          title={successMsg || 'Phone Number Changed Successfully'}
          description="Your phone number has been updated."
        />
    </div>
  )
}
