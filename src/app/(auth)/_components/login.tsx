'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useSendPhoneOtp } from '@/features/auth/hooks'

const loginSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\+\d{11}$/, 'Phone number must be in format +XXXXXXXXXXX (11 digits)'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const { mutate: sendOtp, isPending } = useSendPhoneOtp({
    onSuccess: (data, variables) => {
      if (data.success) {
        router.push(`/verification?flow=login&phone=${encodeURIComponent(variables.phone)}`)
      }
    },
  })

  const onSubmit = (data: LoginFormData) => {
    sendOtp({ phone: data.phone, role: 'user' })
  }

  return (
    <div className="flex h-screen justify-center w-full bg-white">
      <div className="w-full bg-white rounded-r-3xl flex flex-col items-center justify-center px-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#181818] mb-4">Welcome back!</h2>
            <p className="text-base text-[rgba(24,24,24,0.8)] leading-relaxed">
              Enter your phone number below to receive a one-time pass code for login.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#000000]">Phone Number</label>
              <Input
                {...register('phone')}
                type="tel"
                placeholder="+12345678911"
                className="h-12 rounded-[12px] border border-[#005864] bg-[#F8F8F8] px-4 py-3 text-base text-[#1C1C1C] placeholder:text-[rgba(24,24,24,0.6)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#005864] text-white py-3 rounded-lg font-semibold text-base hover:bg-[#004550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Sending OTP...' : 'Continue'}
            </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-[#005864] opacity-20"></div>
            <span className="px-3 text-lg font-medium text-[#005864] uppercase">OR</span>
            <div className="flex-1 border-t border-[#005864] opacity-20"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border border-[#E0E0E0] bg-[#F8F8F8] rounded-2xl py-3 hover:bg-[#F0F0F0] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="24" height="24" rx="3" fill="none" />
                <path d="M4 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8-8-3.59-8-8z" fill="#FFC107" />
                <path d="M8.5 12c0-1.93 1.57-3.5 3.5-3.5s3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5-3.5-1.57-3.5-3.5z" fill="#FF3D00" />
                <path d="M4 12c0-4.41 3.59-8 8-8" stroke="#4CAF50" strokeWidth="2" fill="none" />
              </svg>
              <span className="text-sm font-medium text-[#181818]">Google</span>
            </button>

            <button className="flex items-center justify-center gap-2 border border-[#E0E0E0] bg-[#F8F8F8] rounded-xl py-3 hover:bg-[#F0F0F0] transition-colors">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                <path d="M17.05 13.5c-.91 0-1.64.55-2.05 1.54h4.1c-.41-1.02-1.14-1.54-2.05-1.54zm-8.93 0c-.91 0-1.64.55-2.05 1.54h4.1c-.41-1.02-1.14-1.54-2.05-1.54zm4.48-2.5c1.52 0 2.75-1.23 2.75-2.75S13.52 5.5 12 5.5s-2.75 1.23-2.75 2.75 1.23 2.75 2.75 2.75z" />
              </svg>
              <span className="text-sm font-medium text-[#181818]">Apple</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
