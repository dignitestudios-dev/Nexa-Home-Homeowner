"use client";

import { ArrowLeft, MapPin, Star, Play, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useGetAddresses, useCreateJob } from "@/features/user/hooks";
import DisclaimerDialog from "./ui/disclaimer-dialog";
import SuccessDialog from "./ui/success-dialog";
import { StepOneData, StepTwoData } from "../page";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AttachmentDialog from "@/components/ui/attachment-dialog";
import { Loader } from "./ui/loader";

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
  const [selectedAttachmentIndex, setSelectedAttachmentIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);

  // Build unified attachments list from uploadedImages (which holds both images & videos)
  const attachments = (stepOneData.uploadedImages ?? []).map((file, index) => ({
    _id: `file-${index}`,
    location: URL.createObjectURL(file),
    filename: file.name,
    type: file.type.startsWith("video/") ? "video" : "image",
  }));

  const handleAttachmentClick = (index: number) => {
    setSelectedAttachmentIndex(index);
    setPreviewOpen(true);
  };

  const nextAttachment = () =>
    setSelectedAttachmentIndex((prev) => (prev === attachments.length - 1 ? 0 : prev + 1));

  const prevAttachment = () =>
    setSelectedAttachmentIndex((prev) => (prev === 0 ? attachments.length - 1 : prev - 1));

  const router = useRouter();
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
        setIsDisclaimerOpen(false);
        setIsSuccessOpen(true);
      }
    },
  });

  const handleNext = () => setIsDisclaimerOpen(true);

  const handleConfirmDisclaimer = () => {
    const images = (stepOneData.uploadedImages ?? []).filter((f) => f.type.startsWith("image/"));
    const videos = (stepOneData.uploadedImages ?? []).filter((f) => f.type.startsWith("video/"));

    createJob({
      addressId: stepOneData.addressId,
      category: stepOneData.categoryId,
      title: stepOneData.categoryName,
      description: stepOneData.description,
      when: stepOneData.when,
      type: stepOneData.jobType === "one-time" ? "one-time" : "recurring",
      radius: stepTwoData.radius,
      sendToAll: stepTwoData.sendToAll,
      providerIds: stepTwoData.sendToAll ? undefined : stepTwoData.selectedProviderIds,
      contactPreference,
      images: [...images, ...videos],
    });
  };

  return (
    <div className="min-h-screen">
      {isPending && (
        <div className="fixed backdrop-blur-sm z-[9999999] inset-0 flex items-center justify-center">
          <Loader />
        </div>
      )}

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
              <h2 className="text-2xl break-all font-bold line-clamp-2 text-[#181818] capitalize">
                {stepOneData.categoryName}
              </h2>
              <p className="text-base break-all leading-[26px] text-[rgba(24,24,24,0.6)]">
                {stepOneData.description}
              </p>
            </div>

            {/* Info */}
            <div className="bg-[#F9FAFA] rounded-[12px] p-6 space-y-5">
              <InfoRow label="Status:" value={stepOneData.when} />
              <InfoRow label="Job Type:" value={stepOneData.jobType === "one-time" ? "One Time Job" : "Recurring Job"} />
              <InfoRow label="Contact Preferences:" value={contactPreference.join(", ") || "None"} />
              <InfoRow label="Radius:" value={`${stepTwoData.radius} miles`} />
              <InfoRow label="Sending To:" value={stepTwoData.sendToAll ? "All Experts" : `${stepTwoData.selectedProviderIds.length} Selected`} />
            </div>

            {/* Attachments — inside its own card, shows images and videos */}
            {attachments.length > 0 && (
              <div className="bg-[#F9FAFA] rounded-[12px] p-6">
                <h3 className="text-base font-semibold text-black mb-4">
                  Attachments ({attachments.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <button
                      key={file._id}
                      type="button"
                      onClick={() => handleAttachmentClick(index)}
                      className="relative w-[70px] h-[70px] rounded-xl overflow-hidden border border-[#E5E5E5] shrink-0"
                    >
                      {file.type === "video" ? (
                        <>
                          <video
                            src={file.location}
                            className="h-full w-full object-cover"
                            muted
                            preload="metadata"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play size={18} className="text-white fill-white" />
                          </div>
                        </>
                      ) : (
                        <img
                          src={file.location}
                          alt={file.filename}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </button>
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
                        {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state}{" "}
                        {selectedAddress.zipCode}, {selectedAddress.country}
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
                    <ProviderCard key={provider._id} provider={provider} />
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
                    <ProviderCard key={provider._id} provider={provider} />
                  ))}
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

      <AttachmentDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        attachments={attachments}
        selectedIndex={selectedAttachmentIndex}
        onNext={nextAttachment}
        onPrev={prevAttachment}
      />
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

// Extracted to avoid repetition in send-to-all vs selected branches
function ProviderCard({ provider }: { provider: MatchingProvider }) {
  return (
    <Link
      href={`/provider/${provider._id}`}
      target="_blank"
      className="flex items-start gap-3 rounded-2xl border border-[#005864] bg-[rgba(0,88,100,0.06)] px-3 py-4"
    >
      <div className="w-[46px] h-[46px] rounded-full shrink-0 bg-[#005864]/10 flex items-center justify-center text-sm font-semibold text-[#005864] overflow-hidden">
        {provider.profilePicture?.location ? (
          <img src={provider.profilePicture.location} alt={provider.name} className="w-full h-full object-cover" />
        ) : (
          provider.name?.slice(0, 2).toUpperCase()
        )}
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="flex items-center gap-1 text-[15px] font-semibold text-black leading-[20px] truncate">
          <span className="max-w-[90%] truncate">
            {provider.name}
          </span>
          {provider.isVerifiedBadge && (
            <BadgeCheck size={16} className="text-white fill-[#2E59D7] shrink-0" />
          )}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const fillAmount = Math.max(0, Math.min(1, provider.averageRating - i));
            return (
              <div key={i} className="relative" style={{ width: 11, height: 11 }}>
                <Star size={11} className="text-[#E5E5E5] fill-[#E5E5E5] absolute inset-0" />
                {fillAmount > 0 && (
                  <div className="absolute inset-0 overflow-hidden" style={{ width: `${fillAmount * 100}%` }}>
                    <Star size={11} className="text-[#EDAF35] fill-[#EDAF35] absolute inset-0 max-w-none" />
                  </div>
                )}
              </div>
            );
          })}
          <span className="text-[11px] font-medium text-[rgba(24,24,24,0.6)] ml-1">
            {provider.averageRating.toFixed(1)}
          </span>
        </div>
        {provider.area && (
          <span className="text-[13px] text-[rgba(24,24,24,0.7)] truncate">{provider.area}</span>
        )}
      </div>
    </Link>
  );
}