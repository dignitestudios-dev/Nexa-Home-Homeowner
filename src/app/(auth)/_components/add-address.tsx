'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { PencilLine } from 'lucide-react'
import { useAddAddress, useGetAddresses, useEditAddress } from '@/features/user/hooks'

const AddAddressDialog = dynamic(
  () => import('@/components/ui/add-address-dialog').then((m) => m.AddAddressDialog),
  { ssr: false }
)

const AddAddress = () => {
  const router = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<SavedAddress | null>(null)
  const [addressError, setAddressError] = useState('')

  const { data, isLoading } = useGetAddresses()
  const addresses = data?.data?.addresses ?? []

  const { mutate: addAddress, isPending } = useAddAddress({
    onSuccess: (res) => {
      if (res.success) {
        setIsDialogOpen(false)
        setAddressError('')
      }
    },
  })

  const { mutate: editAddress, isPending: isEditing } = useEditAddress({
    onSuccess: (res) => { if (res.success) setEditTarget(null) },
  })

  const handleContinue = () => {
    if (addresses.length === 0) {
      setAddressError('Please add at least one address before continuing.')
      return
    }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen w-full relative text-[13px]">
      <div className="mx-auto flex justify-center items-center min-h-[calc(100vh-64px)] w-full overflow-hidden rounded-[32px] bg-white shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
        <div className="w-[70%] mx-auto">
          <div className="text-center">
            <h1 className="text-[36px] font-semibold leading-[45px] text-[#181818]">Add Address</h1>
            <p className="mt-2 text-sm text-[rgba(24,24,24,0.6)]">Add at least one address to continue.</p>
          </div>

          <div className="mt-12 space-y-6">
            <div className="rounded-[12px] border border-[#005864] bg-[#F8F8F8] p-4">
              <button
                type="button"
                onClick={() => setIsDialogOpen(true)}
                className="text-sm font-medium text-[#005864] underline"
              >
                + Add A New Address
              </button>
              <div className="mt-4 rounded-[16px] border border-dashed border-[#005864] bg-white p-4 text-center text-sm text-[rgba(24,24,24,0.7)]">
                {isLoading ? (
                  <p>Loading...</p>
                ) : addresses.length === 0 ? (
                  <p>No addresses added yet.</p>
                ) : (
                  <p>{addresses.length} address{addresses.length > 1 ? 'es' : ''} added</p>
                )}
              </div>
            </div>

            {addresses.length > 0 && (
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div key={address._id} className="rounded-[18px] border border-[#E5E5E5] bg-[#F8F8F8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#181818]">{address.label}</p>
                        <p className="mt-2 text-sm leading-6 text-[rgba(24,24,24,0.7)]">{address.address}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditTarget(address)}
                        className="flex size-9 items-center justify-center rounded-lg text-[#1F1F1F] transition hover:bg-[#F0F0F0]"
                      >
                        <PencilLine className="size-4" strokeWidth={1.8} />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between rounded-[14px] bg-white p-3 text-sm text-[rgba(24,24,24,0.7)]">
                      <span>{address.city}, {address.state}</span>
                      <span>{address.country} — {address.zipCode}</span>
                    </div>
                    <div className="mt-3 rounded-[14px] bg-white px-4 py-3 text-sm text-[rgba(24,24,24,0.7)]">
                      <div className="font-medium text-[#181818]">Coordinates</div>
                      <div className="mt-1">
                        Lat: {address.coordinates.coordinates[1]}, Lng: {address.coordinates.coordinates[0]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {addressError ? <p className="text-sm text-red-500">{addressError}</p> : null}

            <button
              type="button"
              onClick={handleContinue}
              className="mt-2 w-full rounded-[12px] bg-[#005864] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#004550] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <AddAddressDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={(address) => addAddress(address)}
        isPending={isPending}
      />

      <AddAddressDialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onSave={(address) => editTarget && editAddress({ ...address, id: editTarget._id })}
        isPending={isEditing}
        initialData={editTarget ? {
          label: editTarget.label,
          address: editTarget.address,
          country: editTarget.country,
          state: editTarget.state,
          city: editTarget.city,
          zipCode: editTarget.zipCode,
          longitude: String(editTarget.coordinates.coordinates[0]),
          latitude: String(editTarget.coordinates.coordinates[1]),
          lat: editTarget.coordinates.coordinates[1],
          lng: editTarget.coordinates.coordinates[0],
        } : undefined}
        title="Edit Address"
      />
    </div>
  )
}

export default AddAddress
