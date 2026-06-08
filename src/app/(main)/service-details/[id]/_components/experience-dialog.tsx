"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { rating: number; review: string }) => void;
  isPending?: boolean;
}

export function ExperienceDialog({ open, onOpenChange, onSubmit, isPending }: ExperienceDialogProps) {
  const [rating, setRating] = useState(1);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    onSubmit({ rating, review });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[462px]! max-w-[700px]! rounded-3xl border-0 p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">How Was Your Experience?</DialogTitle>

        <div className="relative px-[38px] pt-16 pb-6">
          <button onClick={() => onOpenChange(false)} className="absolute right-6 top-6">
            <X className="h-6 w-6 text-[#181818]" />
          </button>

          <h2 className="text-center text-2xl font-semibold text-black">How Was Your Experience?</h2>

          <p className="mt-3 text-center text-base leading-[22px] text-[#18181899]">
            Share your feedback to help others find great experts.
          </p>

          <div className="mt-5 flex justify-center gap-[6px]">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} type="button" onClick={() => setRating(star)}>
                <Star
                  className={cn(
                    "h-[26px] w-[26px]",
                    star <= rating ? "fill-[#EDAF35] text-[#EDAF35]" : "fill-[#9D9D9D] text-[#9D9D9D]"
                  )}
                />
              </button>
            ))}
          </div>

          <textarea
            value={review}
            maxLength={200}
            onChange={(e) => setReview(e.target.value)}
            required
            placeholder="Write here"
            className="mt-12 h-[142px] w-full resize-none rounded-2xl border-0 bg-[rgba(0,88,100,0.06)] p-4 text-base outline-none placeholder:text-[#18181899]"
          />

          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="mt-6 h-12 w-full rounded-xl bg-[#005864] hover:bg-[#004752] text-base font-semibold text-white"
          >
            {isPending ? "Submitting..." : "Submit Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
