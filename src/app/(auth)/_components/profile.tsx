'use client'

import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { useCompleteProfile } from '@/features/user/hooks'

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(30, 'Name must be at most 30 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes'),
  referralCode: z
    .string()
    .max(30, 'Referral code must be at most 30 characters')
    .optional()
    .or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

const Profile = () => {
  const router = useRouter()
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoError, setPhotoError] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  const { mutate: completeProfile, isPending } = useCompleteProfile({
    onSuccess: (data) => {
      if (data.success) {
        router.push('/profile/add-address')
      }
    },
  })

  const onSubmit = (data: ProfileFormData) => {
    completeProfile({
      name: data.name,
      referralCode: data.referralCode || undefined,
      profilePicture: photoFile
        ? { location: URL.createObjectURL(photoFile), file: photoFile }
        : undefined,
    })
  }

  const inputClass =
    'h-12 rounded-[12px] border border-[#005864] bg-[#F8F8F8] px-4 py-3 text-base text-[#1C1C1C] placeholder:text-[rgba(24,24,24,0.6)] focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-transparent'

  return (
    <div className="min-h-screen w-full relative text-[13px]">
      <div className="mx-auto flex justify-center items-center min-h-[calc(100vh-64px)] w-full overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
        <div className="w-[70%] mx-auto">
          <div className="text-center">
            <h1 className="text-[36px] font-semibold leading-[45px] text-[#181818]">Profile Setup</h1>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            <div
              className="relative flex h-[106px] w-[106px] cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-[#005864] bg-[#F9F9F9]"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Profile photo" className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-semibold text-[#005864]">Photo</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-sm font-medium text-[#181818] underline"
            >
              Upload Profile Picture (Optional)
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (!file) return
                if (!VALID_IMAGE_TYPES.includes(file.type)) {
                  setPhotoError('Please select a valid image format (JPEG, PNG, JPG, GIF, WEBP).')
                  return
                }
                setPhotoError('')
                setPhotoFile(file)
                setPhotoPreview(URL.createObjectURL(file))
              }}
            />
            {photoError && <p className="text-red-500 text-xs text-center">{photoError}</p>}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#181818]">Name</label>
              <Input
                {...register('name', {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s'-]/g, '')
                  }
                })}
                maxLength={30}
                placeholder="John Doe"
                className={inputClass}
              />
              {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#181818]">Referral Code (Optional)</label>
              <Input
                {...register('referralCode')}
                maxLength={30}
                placeholder="e.g., REF123"
                className={inputClass}
              />
              {errors.referralCode && <p className="text-red-500 text-xs">{errors.referralCode.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-4 w-full rounded-[12px] bg-[#005864] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#004550] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Saving...' : 'Next'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Profile
