"use client";

import { ArrowLeft, MapPin, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetAddresses, useCreateJob } from "@/features/user/hooks";
import DisclaimerDialog from "./ui/disclaimer-dialog";
import SuccessDialog from "./ui/success-dialog";
import { StepOneData, StepTwoData } from "../page";
import Link from "next/link";

interface StepThreeProps {
  stepOneData: StepOneData;
  stepTwoData: StepTwoData;
  matchedProviders: MatchingProvider[];
  onBack: () => void;
  onSuccess: () => void;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-base font-normal text-[rgba(24,24,24,0.6)]">{label}</p>
      <p className="text-base font-medium text-[#005864]">{value}</p>
    </div>
  );
}

export default function FindExpertStepThree({ stepOneData, stepTwoData, matchedProviders, onBack, onSuccess }: StepThreeProps) {
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const { data: addressData } = useGetAddresses();
  const addresses = addressData?.data?.addresses ?? [];
  const selectedAddress = addresses.find((a) => a._id === stepOneData.addressId);

  const contactPreference = [
    ...(stepOneData.contactCall ? ["phone"] : []),
    ...(stepOneData.contactEmail ? ["email"] : []),
  ];

  const { mutate: createJob, isPending } = useCreateJob({
    onSuccess: (res) => {
      if (res.success) {
        setIsDisclaimerOpen(true);
      }
    },
  });

  const handleNext = () => {
    createJob({
      addressId: stepOneData.addressId,
      category: stepOneData.categoryId,
      title: stepOneData.title,
      description: stepOneData.description,
      when: stepOneData.when,
      type: stepOneData.jobType === "one-time" ? "one-time" : "recurring",
      radius: stepTwoData.radius,
      sendToAll: stepTwoData.sendToAll,
      providerIds: stepTwoData.sendToAll ? undefined : stepTwoData.selectedProviderIds,
      contactPreference,
      images: stepOneData.uploadedImages,
    });
  };

  const handleConfirmDisclaimer = () => {
    setIsDisclaimerOpen(false);
    setIsSuccessOpen(true);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-[1400px] mx-auto rounded-[24px] py-2">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="flex items-center text-[#005864] hover:text-[#004750] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[32px] font-semibold">Summary</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_487px] gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Service Details */}
            <div className="bg-[#F9FAFA] rounded-[18px] p-6 lg:p-8 space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold line-clamp-2 text-[#181818] capitalize">{stepOneData.title}</h2>
                <span className="rounded-full text-nowrap  bg-[#005864]/10 px-3 py-1 text-xs font-semibold text-[#005864]">
                  {stepOneData.categoryName}
                </span>
              </div>
              <p className="text-base leading-[26px] text-[rgba(24,24,24,0.6)]">{stepOneData.description}</p>
            </div>

            {/* Info */}
            <div className="bg-[#F9FAFA] rounded-[12px] p-6 space-y-5">
              <InfoRow label="When:" value={stepOneData.when} />
              {/* {stepOneData.date && <InfoRow label="Date:" value={stepOneData.date} />} */}
              <InfoRow label="Job Type:" value={stepOneData.jobType === "one-time" ? "One Time" : "Recurring"} />
              <InfoRow label="Contact Preferences:" value={contactPreference.join(", ") || "None"} />
              <InfoRow label="Radius:" value={`${stepTwoData.radius} miles`} />
              <InfoRow label="Sending To:" value={stepTwoData.sendToAll ? "All Experts" : `${stepTwoData.selectedProviderIds.length} Selected`} />
            </div>

            {/* Attachments */}
            {stepOneData.uploadedImages.length > 0 && (
              <div className="bg-[#F9FAFA] rounded-[12px] p-6">
                <h3 className="text-base font-semibold text-black mb-4">Attachments</h3>
                <div className="flex flex-wrap gap-4">
                  {stepOneData.uploadedImages.map((file, index) => (
                    <div key={index} className="relative w-[70px] h-[70px] rounded-xl overflow-hidden border border-[#E5E5E5]">
                      <img src={URL.createObjectURL(file)} alt={`attachment-${index}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Location */}
            {selectedAddress && (
              <div className="bg-[#F9FAFA] rounded-[12px] p-6">
                <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
                  <div>
                    <h3 className="text-base font-semibold text-black mb-4">Location</h3>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-[#005864]" strokeWidth={2} />
                      <p className="text-base text-[#787878] max-w-[420px]">
                        {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}, {selectedAddress.country}
                      </p>
                    </div>
                  </div>
                  <Button
                    className="h-[42px] rounded-md bg-[#005864] hover:bg-[#004752] px-5 text-white"
                    onClick={() => {
                      const [lng, lat] = selectedAddress.coordinates.coordinates;
                      window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
                    }}
                  >
                    View on Map
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="bg-[#F9FAFA] rounded-[18px] p-6 flex flex-col">
            <h2 className="text-[20px] font-bold text-[#181818] mb-4">
              {stepTwoData.sendToAll ? "Sending to All Experts" : "Selected Experts"}
            </h2>

            {stepTwoData.sendToAll ? (
              <>
                <p className="text-sm text-[rgba(24,24,24,0.5)] mb-4">
                  Your request will be sent to all matching experts in your area.
                </p>
                <div className="flex-1 space-y-3 overflow-y-auto">
                  {matchedProviders.map((provider) => (
                    <Link
                      href={`/provider/${provider._id}`}
                      key={provider._id}
                      className="flex items-start gap-3 rounded-2xl border border-[#005864] bg-[rgba(0,88,100,0.06)] px-3 py-4"
                    >
                      <div className="w-[46px] h-[46px] rounded-full shrink-0 bg-[#005864]/10 flex items-center justify-center text-sm font-semibold text-[#005864] overflow-hidden">
                        {provider.profilePicture?.location
                          ? <img src={provider.profilePicture.location} alt={provider.name} className="w-full h-full object-cover" />
                          : provider.name?.slice(0, 2).toUpperCase()
                        }
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[15px] font-semibold text-black truncate">{provider.name}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} className={i < Math.floor(provider.averageRating) ? "fill-[#EDAF35] text-[#EDAF35]" : "fill-[#E5E5E5] text-[#E5E5E5]"} />
                          ))}
                          <span className="text-[11px] font-medium text-[rgba(24,24,24,0.6)] ml-1">{provider.averageRating.toFixed(1)}</span>
                        </div>
                        {provider.area && <span className="text-[13px] text-[rgba(24,24,24,0.7)] truncate">{provider.area}</span>}
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : stepTwoData.selectedProviderIds.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-[rgba(24,24,24,0.5)]">No experts selected.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-3 overflow-y-auto">
                {matchedProviders
                  .filter((p) => stepTwoData.selectedProviderIds.includes(p._id))
                  .map((provider) => (
                    <div
                      key={provider._id}
                      className="flex items-start gap-3 rounded-2xl border border-[#005864] bg-[rgba(0,88,100,0.06)] px-3 py-4"
                    >
                      <div className="w-[46px] h-[46px] rounded-full shrink-0 bg-[#005864]/10 flex items-center justify-center text-sm font-semibold text-[#005864] overflow-hidden">
                        {provider.profilePicture?.location
                          ? <img src={provider.profilePicture.location} alt={provider.name} className="w-full h-full object-cover" />
                          : provider.name?.slice(0, 2).toUpperCase()
                        }
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0">
                        <span className="text-[15px] font-semibold text-black truncate">{provider.name}</span>
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={11} className={i < Math.floor(provider.averageRating) ? "fill-[#EDAF35] text-[#EDAF35]" : "fill-[#E5E5E5] text-[#E5E5E5]"} />
                          ))}
                          <span className="text-[11px] font-medium text-[rgba(24,24,24,0.6)] ml-1">{provider.averageRating.toFixed(1)}</span>
                        </div>
                        {provider.area && <span className="text-[13px] text-[rgba(24,24,24,0.7)] truncate">{provider.area}</span>}
                      </div>
                    </div>
                  ))
                }
              </div>
            )}

            <Button
              type="button"
              disabled={isPending}
              className="mt-6 h-12 w-full rounded-xl bg-[#005864] hover:bg-[#004752] text-white text-base font-semibold"
              onClick={handleNext}
            >
              {isPending ? "Submitting..." : "Next"}
            </Button>
          </div>
        </div>
      </div>

      <DisclaimerDialog
        open={isDisclaimerOpen}
        onOpenChange={setIsDisclaimerOpen}
        onConfirm={handleConfirmDisclaimer}
      />
      <SuccessDialog
        open={isSuccessOpen}
        onOpenChange={setIsSuccessOpen}
        onClose={onSuccess}
      />
    </div>
  );
}
