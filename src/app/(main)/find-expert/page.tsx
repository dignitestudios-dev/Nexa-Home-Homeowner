"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FindExpertStepOne from "./_components/find-expert-stepOne";
import FindExpertStepTwo from "./_components/find-expert-stepTwo";
import FindExpertStepThree from "./_components/find-expert-stepThree";
import { useGetOwnUser } from "@/features/user/hooks";
import { Loader2 } from "lucide-react";

export type JobType = "one-time" | "recurring";

export interface StepOneData {
  categoryId: string;
  categoryName: string;
  // title: string;
  description: string;
  when: string;
  addressId: string;
  jobType: JobType;
  contactCall: boolean;
  contactEmail: boolean;
  uploadedImages: File[];
    uploadedVideos: File[];
}

export interface StepTwoData {
  sendToAll: boolean;
  selectedProviderIds: string[];
  radius: number;
}

export interface FindExpertFormData {
  stepOne: StepOneData;
  stepTwo: StepTwoData;
}

const FindExpert = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: userData, isLoading: isUserLoading } = useGetOwnUser();
  const [step, setStep] = useState(1);
  // const step = (Number(searchParams.get("step")) || 1) as 1 | 2 | 3;

  const [stepOneData, setStepOneData] = useState<StepOneData>({
    categoryId: searchParams.get("categoryId") ?? "",
    categoryName: searchParams.get("categoryName") ?? "",
    // title: "",
    description: "",
    when: "",
    addressId: "",
    jobType: "one-time",
    contactCall: false,
    contactEmail: false,
    uploadedImages: [],
      uploadedVideos: [],
  });

  const [stepTwoData, setStepTwoData] = useState<StepTwoData>({
    sendToAll: true,
    selectedProviderIds: [],
    radius: 25,
  });

  const [matchedProviders, setMatchedProviders] = useState<MatchingProvider[]>([]);

  const goTo = (s: number) => {
    setStep(s);
  };

  const goNext = () => goTo(step + 1);
  const goBack = () => {
    if (step === 1) { router.back(); return; }
    goTo(step - 1);
  };

  const handleStepOneChange = <K extends keyof StepOneData>(field: K, value: StepOneData[K]) => {
    setStepOneData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRemoveImage = (index: number) => {
    setStepOneData((prev) => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter((_, i) => i !== index),
    }));
  };
const handleRemoveVideo = (index: number) => {
  setStepOneData((prev) => ({
    ...prev,
    uploadedVideos: prev.uploadedVideos.filter((_, i) => i !== index),
  }));
};
  const handleToggleProvider = (id: string, allProviderIds: string[]) => {
    setStepTwoData((prev) => {
      const updated = prev.selectedProviderIds.includes(id)
        ? prev.selectedProviderIds.filter((e) => e !== id)
        : [...prev.selectedProviderIds, id];
      const allSelected = allProviderIds.length > 0 && allProviderIds.every((pid) => updated.includes(pid));
      return { ...prev, selectedProviderIds: updated, sendToAll: allSelected };
    });
  };

  const handleToggleSendToAll = (allProviderIds: string[]) => {
    setStepTwoData((prev) => {
      const next = !prev.sendToAll;
      return { ...prev, sendToAll: next, selectedProviderIds: next ? allProviderIds : [] };
    });
  };

  const handleRadiusChange = (radius: number) => {
    setStepTwoData((prev) => ({ ...prev, radius }));
  };

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-6 animate-spin text-[#005864]" />
      </div>
    );
  }

  if (userData?.data && !userData.data.contactEmail) {
    router.replace("/settings/email");
    return null;
  }

  return (
    <div className="pb-6 px-5 lg:px-20">
      {step === 1 && (
        <FindExpertStepOne
          data={stepOneData}
          onChange={handleStepOneChange}
            onRemoveVideo={handleRemoveVideo}
          onImageUpload={(e) => {
            const files = e.target.files;
            if (!files) return;
            const valid = Array.from(files).filter((f) =>
              ["image/jpeg", "image/png", "image/webp"].includes(f.type)
            );
            setStepOneData((prev) => ({
              ...prev,
              uploadedImages: [...prev.uploadedImages, ...valid].slice(0, 10),
            }));
          }}
          onRemoveImage={handleRemoveImage}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === 2 && (
        <FindExpertStepTwo
          data={stepTwoData}
          categoryId={stepOneData.categoryId}
          addressId={stepOneData.addressId}
          onToggleProvider={handleToggleProvider}
          onToggleSendToAll={handleToggleSendToAll}
          onRadiusChange={handleRadiusChange}
          onProvidersLoaded={setMatchedProviders}
          onBack={goBack}
          onNext={goNext}
        />
      )}
      {step === 3 && (
        <FindExpertStepThree
          stepOneData={stepOneData}
          stepTwoData={stepTwoData}
          matchedProviders={matchedProviders}
          onBack={goBack}
          onSuccess={() => router.push("/dashboard")}
        />
      )}
    </div>
  );
};

export default function FindExpertPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="size-6 animate-spin text-[#005864]" /></div>}>
      <FindExpert />
    </Suspense>
  );
}
