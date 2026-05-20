'use client'

import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useNetworkStatus } from '@/hooks/use-network-status'
import { useQueryClient } from '@tanstack/react-query'
import { WifiOff } from 'lucide-react'

export function NetworkStatusProvider() {
  const isOnline = useNetworkStatus()
  const previousStatusRef = useRef<boolean | null>(null)
  const queryClient = useQueryClient()

  useEffect(() => {
    // Only show toast when status changes (not on initial render)
    if (previousStatusRef.current !== null && previousStatusRef.current !== isOnline) {
      if (isOnline) {
        toast.success('Connection restored', {
          style: { backgroundColor: '#005864', color: 'white', border: 'none' },
        })
        // Refetch all queries when connection is restored
        queryClient.refetchQueries()
      } else {
        toast.error('Network connection lost', {
          style: { backgroundColor: '#DC2626', color: 'white', border: 'none' },
        })
      }
    }
    previousStatusRef.current = isOnline
  }, [isOnline, queryClient])

  return (
    <>
      {!isOnline && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center max-w-sm mx-4 shadow-lg">
            <WifiOff className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No Internet Connection</h2>
            <p className="text-slate-600 mb-4">
              You have lost your internet connection. Please check your connection and try again.
            </p>
            <p className="text-sm text-slate-500">
              Waiting for connection...
            </p>
          </div>
        </div>
      )}
    </>
  )
}
