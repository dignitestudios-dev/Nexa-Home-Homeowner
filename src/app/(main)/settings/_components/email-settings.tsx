'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useSendChangeEmailOtp, useVerifyChangeEmailOtp } from '@/features/auth/hooks'
import { useGetOwnUser } from '@/features/user/hooks'
import { toast } from 'sonner'
import SuccessDialog from '@/components/ui/success-dialog';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type EmailFormData = z.infer<typeof emailSchema>

export default function EmailSettings() {
  const { data: userData } = useGetOwnUser()
  const currentEmail = userData?.data?.contactEmail;
  const [successOpen, setSuccessOpen] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState<string[]>(['', '', '', '', ''])
  const [resendTimer, setResendTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)

  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  })

  const formEmail = watch('email')
  const emailChanged = formEmail !== currentEmail

  useEffect(() => {
    if (typeof currentEmail !== 'undefined') {
      reset({ email: currentEmail || '' })
    }
  }, [currentEmail, reset])

  useEffect(() => {
    if (resendTimer > 0 && isDialogOpen) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
      return () => clearTimeout(timer)
    } else if (resendTimer === 0) {
      setCanResend(true)
    }
  }, [resendTimer, isDialogOpen])

  const { mutate: sendOtp, isPending: isSending } = useSendChangeEmailOtp({
    onSuccess: (data, variables) => {
      if (data.success) {
        setEmail(variables.email)
        setIsDialogOpen(true)
        setResendTimer(60)
        setCanResend(false)
        setCode(['', '', '', '', ''])
        setTimeout(() => inputRefs.current[0]?.focus(), 100)
      }
    }
  })

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyChangeEmailOtp({
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message || 'Email address updated successfully!', {
          style: { backgroundColor: '#005864', color: 'white', border: 'none' },
        })
        setIsDialogOpen(false)
        setSuccessOpen(true)
        setSuccessMsg(data.message || 'Email address updated successfully!')
        reset({ email: formEmail })
      }
    }
  }, ['userOwn'])

  const onSubmitEmail = (data: EmailFormData) => {
    sendOtp({ email: data.email })
  }

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
      verifyOtp({ email, otp: otpString })
    }
  }

  const formatTimer = (secondsLeft: number) => {
    const m = Math.floor(secondsLeft / 60)
    const s = secondsLeft % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-[24px] font-semibold text-slate-900">Email Address</h2>
        <p className="text-sm text-slate-500 mt-1">
          Update or add your email address to secure your account and receive important notifications.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              {...register('email')}
              type="email"
              placeholder="Enter your email address"
              className="pl-10 h-12"
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSending || !emailChanged}
          className="w-full sm:w-auto text-white py-5  px-8 bg-[#005864] hover:bg-[#004d57] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? 'Sending Code...' : 'Save Changes'}
        </Button>
      </form>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md border-none px-6 py-8">
          <div className="text-center mb-6">
            <DialogTitle className="text-[28px] font-bold text-[#181818] mb-3">Verification</DialogTitle>
            <DialogDescription className="text-base text-[rgba(24,24,24,0.8)]">
              Enter the code sent to {email}
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
                    ; (e.target as HTMLInputElement).style.borderColor = '#005864'
                      ; (e.target as HTMLInputElement).style.borderWidth = '0.8px'
                  }}
                  onBlur={(e) => {
                    ; (e.target as HTMLInputElement).style.borderColor = '#E0E0E0'
                      ; (e.target as HTMLInputElement).style.borderWidth = '2px'
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
                    onClick={() => sendOtp({ email })}
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
        title={successMsg}
        description="Email Changed Successfully"
      />
    </div>
  )
}
