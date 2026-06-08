"use client";

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
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="relative fixed top-1/2 w-[360px]! max-w-[calc(100%-2rem)]! h-[320px] rounded-[24px] bg-white p-0 shadow-[0_20px_40px_rgba(0,0,0,0.12)]">
        <div className="absolute left-[20px] top-[33px] w-[320px] h-[251px]">
          <div className="flex flex-col items-center justify-center gap-8 w-full h-full">
            <div className="flex flex-col items-center gap-4 w-[308px] text-center">
              <DialogTitle className="text-[24px] font-semibold leading-[30px] tracking-[-0.008em] text-[#181818]">
                Disclaimer
              </DialogTitle>
              <DialogDescription className="text-[15px] space-y-2 font-normal leading-[19px] text-[#181818CC]">
               <div className="flex items-start"><Dot size="40" /> <span className="font-semibold text-start">Your job request will be shared with the selected service providers in your specified radius.</span ></div>
               <div className="flex items-start"><Dot size="40" /> <span className="font-semibold text-start">NexaHome does not guarantee immediate response or acceptance by providers.</span ></div>
               <div className="flex items-start"><Dot size="40" /> <span className="font-semibold text-start">Please ensure the job description and details are accurate before posting.</span ></div>
              </DialogDescription>
            </div>
            <div className="w-full px-2">
              <Button
                type="button"
                className="h-[48px] w-full rounded-[12px] bg-[#005864] text-[16px] text-white font-semibold"
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
