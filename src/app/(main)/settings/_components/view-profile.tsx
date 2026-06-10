'use client'

import React, { useRef, useState } from 'react'
import { MapPin, PencilLine, Star, X } from 'lucide-react'
import { useGetOwnUser, useGetAddresses, useUpdateProfile } from '@/features/user/hooks'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useQueryClient } from '@tanstack/react-query'
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp']

export default function ViewProfile() {
  const { data: userData, isLoading } = useGetOwnUser()
  const { data: addressData } = useGetAddresses()
  const queryClient = useQueryClient()
  const user = userData?.data
  const defaultAddress =
    addressData?.data?.addresses?.find((a) => a.isDefault) ??
    addressData?.data?.addresses?.[0]

  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [picFile, setPicFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayName = user?.name || user?.email || 'User'
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0].toUpperCase())
    .slice(0, 2)
    .join('')

  const { mutate: updateProfile, isPending: isSaving } = useUpdateProfile({
    onSuccess: (data) => {
      if (data.success) {
        toast.success('Profile updated successfully!', {
          style: { backgroundColor: '#005864', color: 'white', border: 'none' },
        })
        setEditOpen(false)
        queryClient.invalidateQueries({ queryKey: ['userOwn'] })
      }
    },
  })

  const handleOpenEdit = () => {
    setName(user?.name ?? '')
    setPreviewUrl(user?.profilePicture?.location ?? null)
    setPicFile(null)
    setPhotoError('')
    setNameError('')
    setEditOpen(true)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!VALID_IMAGE_TYPES.includes(file.type)) {
    setPhotoError('Please select a valid image format (JPEG, PNG, JPG, WEBP).');
    return;
  }

  if (file.size > MAX_FILE_SIZE) {
    setPhotoError('Profile picture must be less than 10 MB.');
    e.target.value = '';
    return;
  }

  setPhotoError('');
  setPicFile(file);
  setPreviewUrl(URL.createObjectURL(file));
};

  const handleSave = () => {
    const trimmedName = name.trim()
    if (!trimmedName) {
      setNameError('Name is required')
      return
    }
    if (trimmedName.length < 2) {
      setNameError('Name must be at least 2 characters')
      return
    }
    if (photoError) {
      return
    }
    updateProfile({ name: trimmedName, ...(picFile ? { profilePicture: picFile } : {}) })
  }

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-[202px] rounded-[12px] bg-[#F0F0F0]" />
        <div className="h-[460px] rounded-[12px] bg-[#F0F0F0]" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-[24px] font-semibold text-[#181818]">Profile</h2>

      {/* Top card */}
      <div className="relative rounded-[12px] bg-[#F9FAFA] px-6 py-6 flex items-center gap-5">
        <div className="shrink-0">
          {user?.profilePicture?.location ? (
            <img
              src={user.profilePicture.location}
              alt={displayName}
              className="h-[72px] w-[72px] rounded-full object-cover"
            />
          ) : (
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#DDEDEF] text-xl font-semibold text-[#16484D]">
              {initials}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[20px] font-bold text-[#181818] leading-tight truncate">{displayName}</span>
            {/* {user?.isEmailVerified && (
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#1877F2" />
                <path d="M6 10.5L8.5 13L14 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )} */}
          </div>
          {/* <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-3.5 w-3.5 ${s <= 4 ? 'fill-[#FFC107] text-[#FFC107]' : 'text-[#D0D0D0]'}`} />
            ))}
            <span className="ml-1 text-xs font-medium text-[#FFC107]">4.5</span>
          </div> */}
          {defaultAddress && (
            <p className="text-xs text-[rgba(24,24,24,0.5)] truncate">
              {defaultAddress.city}, {defaultAddress.country}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={handleOpenEdit}
          className="shrink-0 flex items-center gap-1.5 rounded-[10px] bg-[#005864] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#004d57] transition-colors"
        >
          <PencilLine className="h-4 w-4" strokeWidth={2} />
          Edit
        </button>
      </div>

      {/* Bottom info card */}
      <div className="relative rounded-[12px] bg-[rgba(0,88,100,0.06)] p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-[12px] bg-white px-5 py-4">
            <p className="text-xs font-medium text-[rgba(24,24,24,0.5)] mb-1">Email</p>
            <p className="text-[15px] font-medium text-[#181818] break-all">
              {user?.email ?? <span className="text-[rgba(24,24,24,0.35)] italic">Not provided</span>}
            </p>
          </div>

          <div className="rounded-[12px] bg-white px-5 py-4">
            <p className="text-xs font-medium text-[rgba(24,24,24,0.5)] mb-1">Phone Number</p>
            <p className="text-[15px] font-medium text-[#181818]">
              {user?.phone ?? <span className="text-[rgba(24,24,24,0.35)] italic">Not provided</span>}
            </p>
          </div>

          {/* {defaultAddress && (
            <div className="rounded-[12px] bg-white px-5 py-4">
              <p className="text-xs font-medium text-[rgba(24,24,24,0.5)] mb-1">Location</p>
              <p className="text-[15px] font-medium text-[#181818]">
                {defaultAddress.city}, {defaultAddress.country}
              </p>
            </div>
          )} */}
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[525px] p-0 rounded-[12px] overflow-hidden">
          <div className="relative bg-white px-10 pt-8 pb-10 min-h-[623px] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[28px] font-bold leading-[35px] tracking-[-0.018em] text-[#181818] capitalize">
                Edit Profile
              </h3>
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="mt-1 text-[#181818] hover:opacity-60 transition-opacity"
              >
                <X className="h-5 w-5" strokeWidth={1.8} />
              </button>
            </div>

            {/* Avatar upload */}
            <div className="flex flex-col items-center mt-6 mb-6">
              <div className="relative">
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Profile"
                      className="h-[106px] w-[106px] rounded-full object-cover"
                    />
                    {picFile && (
                      <button
                        type="button"
                        onClick={() => {
                          setPicFile(null)
                          setPreviewUrl(user?.profilePicture?.location ?? null)
                          setPhotoError('')
                          if (fileInputRef.current) fileInputRef.current.value = ''
                        }}
                        className="absolute right-0 top-0 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-200 text-[#181818] shadow-sm "
                        aria-label="Cancel selected profile picture"
                      >
                        <X className="h-4 w-4" color={"red"} strokeWidth={2} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex h-[106px] w-[106px] items-center justify-center rounded-full bg-[#DDEDEF] text-2xl font-semibold text-[#16484D]">
                    {initials}
                  </div>
                )}
              </div>
              <div className="mt-3 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[16px] font-medium text-[#181818] underline underline-offset-2 capitalize hover:opacity-70 transition-opacity"
                >
                  Upload Profile Picture
                </button>
            
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {photoError && <p className="text-red-500 text-xs text-center mt-2">{photoError}</p>}
            </div>

            {/* Email (read-only) */}
            <div className="mb-2">
              <div className="flex items-center h-12 w-full rounded-[12px] bg-[rgba(0,88,100,0.06)] px-4">
                <span className="text-[16px] italic text-black">{user?.email ?? 'Not Provided'}</span>
              </div>
              <p className="mt-2 text-[16px] leading-5 text-[rgba(24,24,24,0.6)]">
                Your email address cannot be changed for security reasons.
              </p>
            </div>

            {/* Divider */}
            <div className="my-4 border-t border-[#D1D1D1]" />

            {/* Name field */}
            <div className="mb-6">
              <label className="block text-[16px] font-medium text-black mb-2">Name</label>
              <input
                type="text"
                value={name}
                maxLength={30}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/[^a-zA-Z\s'-]/g, '')
                  setName(cleaned)
                  if (cleaned.trim().length < 2) {
                    setNameError('Name must be at least 2 characters')
                  } else {
                    setNameError('')
                  }
                }}
                className="flex items-center h-12 w-full rounded-[12px] bg-[rgba(0,88,100,0.06)] px-4 text-[16px] text-black focus:outline-none focus:ring-0"
                placeholder="Enter your name"
              />
              {nameError && <p className="text-red-500 text-xs mt-1">{nameError}</p>}
            </div>

            {/* Save button */}
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !name.trim() || !!nameError || !!photoError}
              className="mt-auto w-full h-12 rounded-[12px] bg-[#005864] text-white text-[16px] font-semibold hover:bg-[#004d57] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
