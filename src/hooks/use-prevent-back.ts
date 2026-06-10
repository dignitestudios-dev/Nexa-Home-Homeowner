"use client"
// hooks/usePreventBack.ts
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function usePreventBack(redirectTo: string) {
    const router = useRouter()

    useEffect(() => {
        // Push extra history entry so first back press hits this handler
        window.history.pushState(null, '', window.location.href)

        const handlePopState = () => {
            window.history.pushState(null, '', window.location.href)
            router.replace(redirectTo)
        }

        window.addEventListener('popstate', handlePopState)
        return () => window.removeEventListener('popstate', handlePopState)
    }, [])
}