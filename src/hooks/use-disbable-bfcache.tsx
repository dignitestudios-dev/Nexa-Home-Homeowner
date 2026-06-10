"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useDisableBfcache() {
  const router = useRouter()

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // persisted = true means page was restored from bfcache
      if (event.persisted) {
        router.refresh() // re-runs server components + re-checks cookies
      }
    }

    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [router])
}