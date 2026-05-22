'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { NetworkStatusProvider } from '@/components/network-status-provider'
import { GlobalErrorProvider } from '@/components/ui/error-dialog'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <NetworkStatusProvider />
      <GlobalErrorProvider />
      {children}
    </QueryClientProvider>
  )
}
