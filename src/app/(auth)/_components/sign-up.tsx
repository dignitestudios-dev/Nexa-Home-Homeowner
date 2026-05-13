'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Input } from '@/components/ui/input'

type Props = {}

const signUpSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 digits')
    .regex(/^\+?\d+$/, 'Phone number can contain only digits'),
  referralCode: z.string().optional(),
acceptTerms: z.boolean().refine(val => val, {
  message: "You must accept the terms and conditions",
}),
})

type SignUpFormData = z.infer<typeof signUpSchema>

const SignUp = (props: Props) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      referralCode: '',
      acceptTerms: false,
    },
  })

  const onSubmit = async (data: SignUpFormData) => {
    console.log('signup data', data)
    // integrate API later when available
    router.push('/verification?flow=signup')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[388px] px-2 py-4">
      <div className="text-center mb-8">
        <h1 className="text-[36px] leading-[45px] font-semibold text-[#181818]">Sign Up</h1>
        <p className="mt-3 text-sm leading-6 text-[rgba(24,24,24,0.8)]">
          Enter your details below to signup
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-[13px] font-medium text-[#000000]" htmlFor="name">
            Name
          </label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Rayan Cooper"
            className="h-12 rounded-[12px] border border-[#005864] bg-[#F8F8F8] px-4 py-3 text-base text-[#1C1C1C] placeholder:text-[rgba(24,24,24,0.6)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-[13px] font-medium text-[#000000]" htmlFor="email">
            Email
          </label>
          <Input
            id="email"
            {...register('email')}
            placeholder="rayancooper@gmail.com"
            type="email"
            className="h-12 rounded-[12px] border border-[#005864] bg-[#F8F8F8] px-4 py-3 text-base text-[#1C1C1C] placeholder:text-[rgba(24,24,24,0.6)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-[13px] font-medium text-[#000000]" htmlFor="phone">
            Phone Number
          </label>
          <div className="flex h-12 rounded-[12px] border border-[#005864] bg-[#F9F9F9]">
            <button
              type="button"
              className="flex items-center gap-2 border-r border-[#E8E8E8] px-3 text-sm font-medium text-[#181818]"
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white text-[10px] font-semibold">
                🇺🇸
              </span>
              <span className="text-sm font-medium">+1</span>
            </button>
            <Input
              id="phone"
              {...register('phone')}
              placeholder="Add phone number"
              type="tel"
              className="h-12 flex-1 rounded-none rounded-r-[12px] border-none bg-transparent px-4 text-base text-[#1C1C1C] placeholder:text-[rgba(24,24,24,0.6)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-[13px] font-medium text-[#000000]" htmlFor="referralCode">
            Referral Code
          </label>
          <Input
            id="referralCode"
            {...register('referralCode')}
            placeholder="NEXA-12345"
            className="h-12 rounded-[12px] border border-[#005864] bg-[#F8F8F8] px-4 py-3 text-base text-[#1C1C1C] placeholder:text-[rgba(24,24,24,0.6)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent"
          />
          {errors.referralCode && <p className="text-xs text-red-500">{errors.referralCode.message}</p>}
        </div>

        <label className="flex items-start gap-3 bg-white px-4 py-3 text-sm text-[rgba(24,24,24,0.8)]">
          <input
            type="checkbox"
            {...register('acceptTerms')}
            className="mt-1 h-4 w-4 rounded border-[#005864] accent-[#005864] focus:ring-0"
          />
          <span>
            I accept the{' '}
            <Link href="#" className="font-medium text-[#005864] hover:underline">
              Terms & Conditions
            </Link>{' '}
            and{' '}
            <Link href="#" className="font-medium text-[#005864] hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.acceptTerms && <p className="text-xs text-red-500">{errors.acceptTerms.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-[12px] bg-[#005864] py-3 text-base font-semibold text-white transition hover:bg-[#004550] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? 'Signing up...' : 'Signup'}
        </button>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#000000] opacity-20"></div>
        <span className="text-sm font-medium uppercase text-[#000000]">or</span>
        <div className="h-px flex-1 bg-[#000000] opacity-20"></div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button className="flex items-center justify-center gap-2 rounded-[15px] bg-[#F9F9F9] py-3 text-sm font-medium text-[#181818] transition hover:bg-[#f0f0f0]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white text-[12px]">G</span>
          Google
        </button>
        <button className="flex items-center justify-center gap-2 rounded-[15px] bg-[#F9F9F9] py-3 text-sm font-medium text-[#181818] transition hover:bg-[#f0f0f0]">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white text-[12px]"></span>
          Apple
        </button>
      </div>

      <p className="mt-6 text-center text-base text-[rgba(24,24,24,0.6)]">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-[#005864] hover:underline">
          Login Now
        </Link>
      </p>
    </form>
  )
}

export default SignUp