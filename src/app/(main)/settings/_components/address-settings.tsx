'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { MapPin, PencilLine, Plus, Trash2, X, AlertTriangle } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useAddAddress, useGetAddresses, useSetDefaultAddress, useDeleteAddress, useEditAddress, ADDRESS_QUERY_KEY } from '@/features/user/hooks'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

const AddAddressDialog = dynamic(
  () => import('@/components/ui/add-address-dialog').then((m) => m.AddAddressDialog),
  { ssr: false }
)

function formatFullAddress(a: SavedAddress) {
  return `${a.address}, ${a.city}, ${a.state}, ${a.zipCode}, ${a.country}`
}

function getMapHref(a: SavedAddress) {
  const [lng, lat] = a.coordinates.coordinates
  if (typeof lat === 'number' && typeof lng === 'number') {
    return `https://www.google.com/maps?q=${lat},${lng}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formatFullAddress(a))}`
}

function AddressCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E5E5E5] bg-[#F9F9F9] p-5">
      <div className="flex items-start gap-4">
        <div className="mt-1 size-5 animate-pulse rounded-full bg-[#dce7e8]" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-28 animate-pulse rounded bg-[#dce7e8]" />
          <div className="h-4 w-full max-w-xs animate-pulse rounded bg-[#dce7e8]" />
          <div className="h-4 w-24 animate-pulse rounded bg-[#dce7e8]" />
        </div>
      </div>
    </div>
  )
}

export default function AddressSettings() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<SavedAddress | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SavedAddress | null>(null)
  const [successPopup, setSuccessPopup] = useState<'added' | 'updated' | null>(null)
  const queryClient = useQueryClient()
  const { data, isLoading } = useGetAddresses()
  const addresses = data?.data?.addresses ?? []

  const { mutate: addAddress, isPending } = useAddAddress({
    onSuccess: (res) => { 
      if (res.success) {
        setIsDialogOpen(false)
        setSuccessPopup('added')
      } 
    },
  })

  const { mutate: setDefault, isPending: isSettingDefault } = useSetDefaultAddress({
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: [ADDRESS_QUERY_KEY] })
      const previous = queryClient.getQueryData<GetAllAddressesResponse>([ADDRESS_QUERY_KEY])
      queryClient.setQueryData<GetAllAddressesResponse>([ADDRESS_QUERY_KEY], (old) => {
        if (!old) return old
        return {
          ...old,
          data: {
            addresses: old.data.addresses.map((a) => ({ ...a, isDefault: a._id === id })),
          },
        }
      })
      return { previous }
    },
    onError: (_err, _vars, context) => {
      const ctx = context as { previous?: GetAllAddressesResponse } | undefined
      if (ctx?.previous) {
        queryClient.setQueryData([ADDRESS_QUERY_KEY], ctx.previous)
      }
    },
  })

  const { mutate: deleteAddress, isPending: isDeleting } = useDeleteAddress({
    onSuccess: () => setDeleteTarget(null),
  })

  const { mutate: editAddress, isPending: isEditing } = useEditAddress({
    onSuccess: (res) => { 
      if (res.success) {
        setEditTarget(null)
        setSuccessPopup('updated')
      } 
    },
  })

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-[24px] font-semibold text-[#181818]">Address</h2>
          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="inline-flex items-center gap-2 text-[16px] font-medium text-[#005864] underline underline-offset-4"
          >
            <Plus className="size-5" strokeWidth={2} />
            Add Address
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            <AddressCardSkeleton />
            <AddressCardSkeleton />
          </div>
        ) : addresses.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#005864] bg-[rgba(0,88,100,0.04)] px-6 py-12 text-center">
            <MapPin className="mx-auto mb-3 size-8 text-[#005864] opacity-40" />
            <p className="font-medium text-[#1F1F1F]">No saved addresses yet.</p>
            <p className="mt-1 text-sm text-[rgba(24,24,24,0.5)]">Add your home, office, or any other location.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((address) => {
              const isActive = address.isDefault

              return (
                <div
                  key={address._id}
                  className={`relative rounded-2xl border p-5 transition-all ${
                    isActive
                      ? 'border-[#005864] bg-[rgba(0,88,100,0.04)]'
                      : 'border-[#E5E5E5] bg-[#F9F9F9]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <button
                      type="button"
                      onClick={() => !isActive && setDefault({ id: address._id })}
                      disabled={isActive || isSettingDefault}
                      className={`mt-2.5 shrink-0 focus:outline-none transition-opacity ${
                        isSettingDefault ? 'opacity-40 cursor-not-allowed' : isActive ? 'cursor-default' : 'cursor-pointer'
                      }`}
                      aria-label={isActive ? 'Default address' : 'Set as default'}
                    >
                      <span className={`flex size-5 items-center justify-center rounded-full border-2 transition-colors ${
                        isActive ? 'border-[#005864]' : 'border-[#C5C5C5] hover:border-[#005864]'
                      }`}>
                        {isActive && <span className="size-2.5 rounded-full bg-[#005864]" />}
                      </span>
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[24px] font-semibold text-[#181818]">{address.label}</span>
                        {isActive && (
                          <span className="rounded-full bg-[#005864] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                            Default
                          </span>
                        )}
                      </div>

                      <div className="mt-2 flex items-start gap-1.5">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-[#005864]" strokeWidth={2} />
                        <p className="text-sm leading-relaxed text-[rgba(24,24,24,0.6)]">
                          {formatFullAddress(address)}
                        </p>
                      </div>

                      <div className="mt-3">
                        <Link
                          href={getMapHref(address)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm font-medium text-[#005864] underline underline-offset-2"
                        >
                          View on Map
                        </Link>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditTarget(address)}
                        className="flex size-9 items-center justify-center rounded-lg text-[#1F1F1F] transition hover:bg-[#F0F0F0]"
                      >
                        <PencilLine className="size-4" strokeWidth={1.8} />
                      </button>
                      {addresses.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(address)}
                          className="flex size-9 items-center justify-center rounded-lg text-[#FF5D5D] transition hover:bg-red-50"
                        >
                          <Trash2 className="size-4" strokeWidth={1.8} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
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

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[360px] p-0 border-none rounded-[16px] overflow-hidden min-h-[251px]">
          <div className="relative flex flex-col items-center justify-center bg-white px-5 pt-8 pb-6 h-full">
            <div className="flex items-center justify-center mb-[14px]">
              <AlertTriangle className="h-[42px] w-[42px]" fill="#FF0000" color="#ffffff" strokeWidth={1.5} />
            </div>

            <h3 className="text-[24px] font-bold leading-[30px] text-[#181818] mb-2 text-center capitalize font-sans">
              Delete Address
            </h3>
            <p className="text-[16px] leading-[20px] text-[#565656] text-center max-w-[245px] font-sans mb-[27px]">
              Are you sure you want to delete this address?
            </p>

            <div className="flex w-full gap-3 justify-center px-1">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex h-[49px] w-[152px] items-center justify-center rounded-[12px] bg-[#ECECEC] text-[12px] font-medium leading-[16px] text-[#181818] transition hover:bg-[#E0E0E0] font-sans"
              >
                No, keep it
              </button>
              <button
                type="button"
                onClick={() => deleteTarget && deleteAddress({ id: deleteTarget._id })}
                disabled={isDeleting}
                className="flex h-[49px] w-[152px] items-center justify-center rounded-[12px] bg-[rgba(255,0,0,0.12)] text-[12px] font-medium leading-[16px] text-[#FF0000] transition hover:bg-[rgba(255,0,0,0.2)] disabled:opacity-50 disabled:cursor-not-allowed font-sans"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Now'}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!successPopup} onOpenChange={(open) => !open && setSuccessPopup(null)}>
        <DialogContent className="sm:max-w-[360px] p-0 border-none rounded-[16px] overflow-hidden min-h-[235px]">
          <div className="relative flex flex-col items-center justify-center bg-white px-6 pt-10 pb-8 h-full">
            <button 
              onClick={() => setSuccessPopup(null)}
              className="absolute right-[20px] top-[18px] text-black hover:opacity-70 transition-opacity"
            >
              <X className="h-5 w-5" strokeWidth={2.5} />
            </button>
            
            <div 
              className="relative flex h-[50px] w-[50px] items-center justify-center rounded-full mb-[18px]"
              style={{
                background: 'linear-gradient(136.41deg, #005864 39.74%, #D7DF23 307.09%)',
                filter: 'drop-shadow(0px 4px 15.2px rgba(0, 88, 100, 0.31))'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            <h3 className="text-[24px] font-bold leading-[30px] text-[#181818] mb-2 text-center capitalize">
              {successPopup === 'added' ? 'Address Saved' : 'Address Updated'}
            </h3>
            <p className="text-[16px] leading-[20px] text-[#565656] text-center max-w-[245px]">
              {successPopup === 'added' 
                ? 'The new address has been saved successfully.' 
                : 'The address has been updated successfully.'}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
