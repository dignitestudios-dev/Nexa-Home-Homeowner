'use client'

import { Check } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'

interface VerificationSuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  flow: 'login' | 'signup'
}

export function VerificationSuccessDialog({
  open,
  onOpenChange,
  flow
}: VerificationSuccessDialogProps) {
  const modalTitle = flow === 'signup' ? 'Phone Number Verified' : 'Login Successful'
  const modalDescription =
    flow === 'signup'
      ? 'Your phone number has been verified successfully.'
      : 'You\'ve been logged in securely.'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-[28px] bg-white p-8 shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#005864] mb-6 mx-auto">
          <Check className="h-7 w-7 text-white" />
        </div>
        <DialogTitle className="text-2xl font-semibold text-[#181818] text-center">{modalTitle}</DialogTitle>
        <DialogDescription className="text-center">{modalDescription}</DialogDescription>
        <p className="mt-4 text-center text-sm text-[rgba(24,24,24,0.8)]">
          Use verification code <strong>12345</strong> to complete the flow.
        </p>
      </DialogContent>
    </Dialog>
  )
}