'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSendChangePhoneOtp } from '@/features/auth/hooks'
import Image from 'next/image'

const socialPhoneSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit US phone number'),
})

type SocialPhoneFormData = z.infer<typeof socialPhoneSchema>

export default function SocialPhonePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isProfileCompleted = searchParams.get('isProfileCompleted')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SocialPhoneFormData>({
    resolver: zodResolver(socialPhoneSchema),
  })

  const { mutate: sendOtp, isPending } = useSendChangePhoneOtp({
    onSuccess: (data, variables) => {
      if (data.success) {
        router.push(`/verification?flow=social-phone&phone=${encodeURIComponent(variables.phone)}&isProfileCompleted=${isProfileCompleted}`)
      }
    },
  })

  const onSubmit = (data: SocialPhoneFormData) => {
    // Prepend +1 before sending to API
    sendOtp({ phone: `+1${data.phone}` })
  }

  return (
    <div className="flex h-screen justify-center w-full bg-white">
      <div className="w-full bg-white rounded-r-3xl flex flex-col items-center justify-center px-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#181818] mb-4">Phone Verification</h2>
            <p className="text-base text-[rgba(24,24,24,0.8)] leading-relaxed">
              Please provide your phone number to complete the login process.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#000000]">Phone Number</label>
              <div className="flex items-center gap-2">
                {/* +1 US flag prefix */}
                <div className="flex h-12 shrink-0 items-center gap-1.5 rounded-[12px] border border-[#005864] bg-[#F8F8F8] px-3">
                  <Image src="/images/us-flag.png" alt="US Flag" width={22} height={15} className="object-contain rounded-[2px]" />
                  <span className="text-sm font-semibold text-[#181818]">+1</span>
                </div>
                <input
                  {...register('phone', {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, '')
                    }
                  })}
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="Enter your phone number"
                  className="h-12 flex-1 rounded-[12px] border border-[#005864] bg-[#F8F8F8] px-4 py-3 text-base text-[#1C1C1C] placeholder:text-[rgba(24,24,24,0.6)] focus:outline-none focus:ring-0"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#005864] text-white py-3 rounded-lg font-semibold text-base hover:bg-[#004550] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Sending Code...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
