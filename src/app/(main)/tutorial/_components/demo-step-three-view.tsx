"use client";

import React, { useState } from "react";
import { ArrowLeft, MapPin, Star, BadgeCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { StepOneData, StepTwoData } from "../../find-expert/page";
import { DEMO_MATCHED_PROVIDERS } from "./demo-data";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-base font-normal text-[rgba(24,24,24,0.6)]">{label}</p>
      <p className="text-base font-medium text-[#005864]">{value}</p>
    </div>
  );
}

function ProviderCard({ provider }: { provider: MatchingProvider }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-[12px] bg-white border border-[#E5E5E5]">
      <div className="w-[44px] h-[44px] rounded-full shrink-0 bg-[#005864]/10 flex items-center justify-center text-sm font-semibold text-[#005864]">
        {provider.name?.slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1">
          <p className="text-sm font-semibold text-[#181818] truncate">{provider.name}</p>
          {provider.isVerifiedBadge && (
            <BadgeCheck className="size-4 shrink-0 text-[#005864] fill-[#005864] text-white" />
          )}
        </div>
        <div className="flex items-center gap-1 text-xs text-[rgba(24,24,24,0.5)]">
          <Star className="size-3 fill-amber-400 text-amber-400" />
          <span className="text-[#181818] font-medium">{provider.averageRating ?? "N/A"}</span>
          <span>({provider.totalReviews ?? 0})</span>
        </div>
      </div>
    </div>
  );
}

interface DemoStepThreeViewProps {
  stepOneData: StepOneData;
  stepTwoData: StepTwoData;
  onBack: () => void;
  onSuccess: () => void;
}

export default function DemoStepThreeView({
  stepOneData,
  stepTwoData,
  onBack,
  onSuccess,
}: DemoStepThreeViewProps) {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const selectedProviders = stepTwoData.sendToAll
    ? DEMO_MATCHED_PROVIDERS
    : DEMO_MATCHED_PROVIDERS.filter((p) =>
        stepTwoData.selectedProviderIds.includes(p._id)
      );

  const handleNext = () => {
    setIsDisclaimerOpen(true);
  };

  const handleConfirm = () => {
    setIsDisclaimerOpen(false);
    onSuccess();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto rounded-[24px] py-2">
        <div id="tutorial-step-three-header" className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center text-[#005864] hover:text-[#004750] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[32px] font-semibold">Summary</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_487px] gap-6">
          {/* LEFT Column */}
          <div className="space-y-6">
            {/* Service Details */}
            <div className="bg-[#F9FAFA] rounded-[18px] p-6 lg:p-8 space-y-4">
              <h2 className="text-2xl font-bold text-[#181818] capitalize">
                {stepOneData.categoryName}
              </h2>
              <div className="space-y-3 pt-2">
                <InfoRow label="Job Type" value={stepOneData.jobType === "one-time" ? "One-Time Job" : "Recurring Service"} />
                <InfoRow label="Timeline" value={stepOneData.when} />
                <InfoRow label="Contact Preference" value={stepOneData.contactCall && stepOneData.contactEmail ? "Call & Email" : stepOneData.contactCall ? "Call" : "Email"} />
              </div>
            </div>

            {/* Description Card */}
            <div className="bg-[#F9FAFA] rounded-[18px] p-6 lg:p-8 space-y-2">
              <h3 className="text-base font-semibold text-[#181818]">Description</h3>
              <p className="text-base text-[rgba(24,24,24,0.7)] leading-relaxed">
                {stepOneData.description}
              </p>
            </div>

            {/* Location Card */}
            <div className="bg-[#F9FAFA] rounded-[18px] p-6 lg:p-8 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="size-5 text-[#005864]" />
                <h3 className="text-base font-semibold text-[#181818]">Service Location</h3>
              </div>
              <p className="text-base text-[#181818] font-medium">
                Home: 123 Innovation Way, Austin TX 78701
              </p>
            </div>
          </div>

          {/* RIGHT Column */}
          <div className="bg-[#F9FAFA] rounded-[18px] p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-[#181818] mb-4">
                {stepTwoData.sendToAll ? "Sending to All Experts" : "Selected Experts"}
              </h2>

              <p className="text-sm text-[rgba(24,24,24,0.5)] mb-4">
                {stepTwoData.sendToAll
                  ? "Your request will be sent to all matching experts in your area."
                  : `${selectedProviders.length} expert(s) selected.`}
              </p>

              <div className="space-y-3 overflow-y-auto max-h-[380px]">
                {selectedProviders.map((provider) => (
                  <ProviderCard key={provider._id} provider={provider} />
                ))}
              </div>
            </div>

            <Button
              type="button"
              onClick={handleNext}
              className="mt-6 h-12 w-full rounded-xl bg-[#005864] hover:bg-[#004752] text-white text-base font-semibold cursor-pointer"
            >
              Submit Lead
            </Button>
          </div>
        </div>
      </div>

      {/* Disclaimer Modal */}
      <Dialog open={isDisclaimerOpen} onOpenChange={setIsDisclaimerOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-3xl bg-white p-8">
          <DialogTitle className="text-xl font-bold text-[#181818]">
            Disclaimer & Lead Submission
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 mt-2 leading-relaxed">
            By submitting this request, your details will be shared with the selected verified pros. They will reach out to provide estimates and discuss scheduling.
          </DialogDescription>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDisclaimerOpen(false)} className="rounded-xl h-11 px-5">
              Cancel
            </Button>
            <Button onClick={handleConfirm} className="rounded-xl h-11 px-6 bg-[#005864] hover:bg-[#004752] text-white">
              Confirm & Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
