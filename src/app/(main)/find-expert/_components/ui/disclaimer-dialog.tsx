"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dot } from "lucide-react";

interface DisclaimerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function DisclaimerDialog({
  open,
  onOpenChange,
  onConfirm,
}: DisclaimerDialogProps) {
  const [consentChecked, setConsentChecked] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) setConsentChecked(false);
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="relative fixed top-1/2 w-[420px]! max-w-[calc(100%-2rem)]! rounded-[24px] bg-white p-0 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
        <div className="px-6 pt-8 pb-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4 text-center">
              <DialogTitle className="text-[24px] font-semibold leading-[30px] tracking-[-0.008em] text-[#181818]">
                Disclaimer
              </DialogTitle>
              <DialogDescription asChild>
                <div className="text-[14px] space-y-3 font-normal leading-[20px] text-[#181818CC] text-left">
                  <div className="flex items-start">
                    <Dot size="36" className="shrink-0 -ml-2" />
                    <span className="font-medium">
                      Your job request will be shared with the providers you select — or, if you choose &quot;Send to All,&quot; it will be visible to all providers offering that service in your area.
                    </span>
                  </div>
                  <div className="flex items-start">
                    <Dot size="36" className="shrink-0 -ml-2" />
                    <span className="font-medium">
                      NexaHome doesn&apos;t guarantee a response or acceptance by any provider.
                    </span>
                  </div>
                  <div className="flex items-start">
                    <Dot size="36" className="shrink-0 -ml-2" />
                    <span className="font-medium">
                      Please make sure your job details are accurate before posting.
                    </span>
                  </div>
                </div>
              </DialogDescription>
            </div>

            {/* Consent checkbox */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#005864] accent-[#005864] cursor-pointer"
              />
              <span className="text-[13px] leading-[18px] text-[rgba(24,24,24,0.7)]">
                I expressly consent to be contacted about my project by up to five (5) service providers at the number or email I provided — by call, text (msg &amp; data rates may apply), or email, including automated calls or texts. Consent is not a condition of using NexaHome.
              </span>
            </label>

            <div className="w-full">
              <Button
                type="button"
                disabled={!consentChecked}
                className="h-[48px] w-full rounded-[12px] bg-[#005864] text-[16px] text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onConfirm}
              >
                OK
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
