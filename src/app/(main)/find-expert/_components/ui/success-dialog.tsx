"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}

export default function SuccessDialog({ open, onOpenChange, onClose }: SuccessDialogProps) {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onOpenChange(false);
      onClose();
    }, 1000);
    return () => clearTimeout(timer);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative w-[515px] max-w-[calc(100%-2rem)] h-[318px] rounded-[24px] bg-white p-0 overflow-hidden">
        <button
          type="button"
          onClick={() => {
            onOpenChange(false);
            onClose();
          }}
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#181818] hover:bg-[#F1F5F9]"
          aria-label="close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="absolute left-0 right-0 top-0 bottom-0 flex flex-col items-center justify-center px-6">
          <div className="relative w-[50px] h-[50px] rounded-full bg-[#F8F8F8] flex items-center justify-center mb-6">
            <div className="">
              <svg width="24" height="18" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 7L6.2 11.5L17 1" stroke="#005864" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <div className="text-center">
            <DialogTitle className="text-[32px] font-semibold leading-[40px] text-[#181818]">
              Your Request Has Been Submitted
            </DialogTitle>
            <DialogDescription className="mt-3 text-[16px] leading-[20px] text-[#565656]">
              Experts will be in touch shortly.
            </DialogDescription>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
