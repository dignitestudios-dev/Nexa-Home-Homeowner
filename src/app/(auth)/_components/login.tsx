'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Apple } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSendPhoneOtp, useSocialAuth } from '@/features/auth/hooks'
import { signInWithApple, signInWithGoogle } from '@/lib/firebase'
import { setToken } from '@/lib/cookies'
import Image from 'next/image'
import Spinner from '@/components/ui/spinner'

// User enters digits only (10 digits), we prepend +1
const loginSchema = z.object({
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Enter a valid 10-digit US phone number'),
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

  const { mutate: socialAuth, isPending: isSocialPending } = useSocialAuth({
    onSuccess: (data) => {
      if (data.success && data.data) {
        setToken(data.data.token)
        if (!data.data.user.isPhoneVerified) {
          router.replace(`/social-phone?isProfileCompleted=${data.data.user.isProfileCompleted}`)
        } else if (data.data.user.isProfileCompleted) {
          router.push('/dashboard');
          // Mark that jobs count should be fetched on next dashboard load
          sessionStorage.setItem('jobs-count-popup-shown', 'false');
        } else {
          document.cookie = `isProfileCompleted=${data.data.user.isProfileCompleted}; path=/; max-age=86400; SameSite=Lax`;
          router.push('/profile')
        }
      }
    },
  })

  const [googleError, setGoogleError] = React.useState('')

  const handleGoogleLogin = async () => {
    try {
      setGoogleError('')
      const idToken = await signInWithGoogle()
      socialAuth({ idToken, method: 'google', role: 'user' })
    } catch (err: unknown) {
      const code = (err as { code?: string })?.code
      console.error('Google sign-in error:', err)
      if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') {
        setGoogleError(`Google sign-in failed: ${code ?? 'unknown error'}`)
      }
    }
  }

  const handleAppleLogin = async () => {
  try {
    setGoogleError('') // or setAppleError('') if you have a separate state

    const idToken = await signInWithApple()

    socialAuth({
      idToken,
      method: 'apple',
      role: 'user',
    })
  } catch (err: unknown) {
    const code = (err as { code?: string })?.code

    console.error('Apple sign-in error:', err)

    if (
      code !== 'auth/popup-closed-by-user' &&
      code !== 'auth/cancelled-popup-request'
    ) {
      setGoogleError(`Apple sign-in failed: ${code ?? 'unknown error'}`)
      // or setAppleError(...)
    }
  }
}

  const onSubmit = (data: LoginFormData) => {
    // Prepend +1 before sending to API
    sendOtp({ phone: `+1${data.phone}`, role: 'user' })
  }

  return (
    <div className="flex h-screen justify-center w-full bg-white">
      <div className="w-full bg-white rounded-r-3xl flex flex-col items-center justify-center px-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#181818] mb-4">Welcome back!</h2>
            <p className="text-base text-[rgba(24,24,24,0.8)] leading-relaxed">
              Enter your phone number below to receive a one-time passcode on your phone number for login/signup
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
               {isPending ? (
   <Spinner title='Sending Code...' />
  ) : (
    'Continue'
  )}
              </button>
          </form>

          <div className="flex items-center my-8">
            <div className="flex-1 border-t border-[#005864] opacity-20"></div>
            <span className="px-3 text-lg font-medium text-[#005864] uppercase">OR</span>
            <div className="flex-1 border-t border-[#005864] opacity-20"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleLogin}
              disabled={isSocialPending}
              type="button"
              className="flex items-center justify-center gap-2 bg-[#F8F8F8] rounded-2xl py-3 hover:bg-[#F0F0F0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image src={"/images/google.png"} alt="Google" width={20} height={20} />
              <span className="text-sm font-medium text-[#181818]">
                {isSocialPending ? 'Signing in...' : 'Google'}
              </span>
            </button>

            <button
            onClick={handleAppleLogin}
              disabled={isSocialPending}
              className="flex items-center justify-center gap-2 bg-[#F8F8F8] rounded-2xl py-3 hover:bg-[#F0F0F0] transition-colors"
              type="button"
            >
              <Image src={"/images/apple.png"} alt="Apple" width={20} height={20} />
              <span className="text-sm font-medium text-[#181818]">Apple</span>
            </button>
          </div>
          {googleError && <p className="mt-3 text-center text-xs text-red-500">{googleError}</p>}
        </div>
      </div>
    </div>
  )
}
