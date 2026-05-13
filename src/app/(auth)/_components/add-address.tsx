'use client'

import React, { useState } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import { useAddAddress } from '@/features/user/hooks'

const AddAddressDialog = dynamic(
  () => import('@/components/ui/add-address-dialog').then((m) => m.AddAddressDialog),
  { ssr: false }
)

const AddAddress = () => {
  const router = useRouter()
  const [addresses, setAddresses] = useState<AddressData[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [addressError, setAddressError] = useState('')

  const { mutate: addAddress, isPending } = useAddAddress({
    onSuccess: (data) => {
      if (data.success) {
        router.push('/dashboard')
      }
    },
  })

  const handleSaveAddress = (address: AddressData) => {
    setAddresses((prev) => [...prev, address])
    setIsDialogOpen(false)
    setAddressError('')
    addAddress(address)
  }

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
                {addresses.length === 0 ? (
                  <p>No addresses added yet.</p>
                ) : (
                  <p>{addresses.length} address{addresses.length > 1 ? 'es' : ''} added</p>
                )}
              </div>
            </div>

            {addresses.length > 0 && (
              <div className="space-y-3">
                {addresses.map((address, index) => (
                  <div key={index} className="rounded-[18px] border border-[#E5E5E5] bg-[#F8F8F8] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#181818]">{address.label}</p>
                        <p className="mt-2 text-sm leading-6 text-[rgba(24,24,24,0.7)]">{address.address}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between rounded-[14px] bg-white p-3 text-sm text-[rgba(24,24,24,0.7)]">
                      <span>{address.city}, {address.state}</span>
                      <span>{address.country} — {address.zipCode}</span>
                    </div>
                    <div className="mt-3 rounded-[14px] bg-white px-4 py-3 text-sm text-[rgba(24,24,24,0.7)]">
                      <div className="font-medium text-[#181818]">Coordinates</div>
                      <div className="mt-1">Lat: {address.latitude}, Lng: {address.longitude}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {addressError ? <p className="text-sm text-red-500">{addressError}</p> : null}

            <button
              type="button"
              onClick={handleContinue}
              disabled={isPending}
              className="mt-2 w-full rounded-[12px] bg-[#005864] px-4 py-3 text-base font-semibold text-white transition hover:bg-[#004550] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </div>
      </div>

      <AddAddressDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleSaveAddress}
        isPending={isPending}
      />
    </div>
  )
}

export default AddAddress
