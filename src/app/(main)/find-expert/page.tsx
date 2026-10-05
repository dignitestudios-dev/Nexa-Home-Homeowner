"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FindExpertStepOne from "./_components/find-expert-stepOne";
import FindExpertStepTwo from "./_components/find-expert-stepTwo";
import FindExpertStepThree from "./_components/find-expert-stepThree";
import { useGetOwnUser } from "@/features/user/hooks";
import { Loader2, Sparkles, X } from "lucide-react";
import { useTutorialTour } from "@/hooks/use-tutorial-tour";

export type JobType = "one-time" | "recurring";

export interface StepOneData {
  categoryId: string;
  categoryName: string;
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

const TUTORIAL_MOCK_PROVIDERS: MatchingProvider[] = [
  {
    _id: "demo-provider-1",
    providerAddressId: "demo-addr-1",
    name: "Apex Home Care & Landscaping",
    averageRating: 4.9,
    totalReviews: 142,
    isVerifiedBadge: true,
    profilePicture: {
      _id: "demo-pic-1",
      location: "",
      filename: "avatar.jpg",
      mimetype: "image/jpeg",
    },
    distanceMiles: 3.5,
  },
  {
    _id: "demo-provider-2",
    providerAddressId: "demo-addr-2",
    name: "GreenThumb Pro Services",
    averageRating: 5.0,
    totalReviews: 98,
    isVerifiedBadge: true,
    profilePicture: {
      _id: "demo-pic-2",
      location: "",
      filename: "avatar2.jpg",
      mimetype: "image/jpeg",
    },
    distanceMiles: 5.2,
  },
];

const FindExpert = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isTutorial = searchParams.get("tutorial") === "true";
  const initialStep = Math.max(1, Math.min(3, Number(searchParams.get("step")) || 1));

  const { data: userData, isLoading: isUserLoading } = useGetOwnUser();
  const [step, setStep] = useState(initialStep);

  const {
    runWizardStepOne,
    runWizardStepTwo,
    runWizardStepThree,
    stopTour,
  } = useTutorialTour();

  const [stepOneData, setStepOneData] = useState<StepOneData>({
    categoryId:
      searchParams.get("categoryId") ??
      (isTutorial ? "demo-landscaping-category" : ""),
    categoryName:
      searchParams.get("categoryName") ??
      (isTutorial ? "Landscaping & Lawn Care" : ""),
    description: isTutorial
      ? "Need weekly front and backyard lawn mowing, precision edging, and shrub trimming."
      : "",
    when: isTutorial ? "Need an expert right away" : "",
    addressId: isTutorial ? "demo-address-id" : "",
    jobType: isTutorial ? "recurring" : "one-time",
    contactCall: isTutorial ? true : false,
    contactEmail: isTutorial ? true : false,
    uploadedImages: [],
    uploadedVideos: [],
  });

  const [stepTwoData, setStepTwoData] = useState<StepTwoData>({
    sendToAll: true,
    selectedProviderIds: isTutorial ? ["demo-provider-1", "demo-provider-2"] : [],
    radius: isTutorial ? 50 : 75,
  });

  const [matchedProviders, setMatchedProviders] = useState<MatchingProvider[]>(
    isTutorial ? TUTORIAL_MOCK_PROVIDERS : []
  );

  // Run driver.js step tour when in tutorial mode
  useEffect(() => {
    if (!isTutorial) return;

    if (step === 1) {
      runWizardStepOne(() => {
        setStep(2);
      });
    } else if (step === 2) {
      runWizardStepTwo(
        () => {
          setStep(3);
        },
        () => {
          setStep(1);
        }
      );
    } else if (step === 3) {
      runWizardStepThree(
        () => {
          setStep(2);
        },
        userData?.data?._id
      );
    }

    return () => {
      stopTour();
    };
  }, [
    isTutorial,
    step,
    runWizardStepOne,
    runWizardStepTwo,
    runWizardStepThree,
    stopTour,
    userData,
  ]);

  const handleExitTutorial = () => {
    stopTour();
    router.push("/dashboard");
  };

  const goTo = (s: number) => {
    setStep(s);
  };

  const goNext = () => goTo(step + 1);
  const goBack = () => {
    if (step === 1) {
      if (isTutorial) {
        handleExitTutorial();
      } else {
        router.back();
      }
      return;
    }
    goTo(step - 1);
  };

  const handleStepOneChange = <K extends keyof StepOneData>(
    field: K,
    value: StepOneData[K]
  ) => {
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
      const allSelected =
        allProviderIds.length > 0 &&
        allProviderIds.every((pid) => updated.includes(pid));
      return { ...prev, selectedProviderIds: updated, sendToAll: allSelected };
    });
  };

  const handleToggleSendToAll = (allProviderIds: string[]) => {
    setStepTwoData((prev) => {
      const next = !prev.sendToAll;
      return {
        ...prev,
        sendToAll: next,
        selectedProviderIds: next ? allProviderIds : [],
      };
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

  if (userData?.data && !userData.data.contactEmail && !isTutorial) {
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
          onProvidersLoaded={(provs) => {
            if (provs && provs.length > 0) {
              setMatchedProviders(provs);
            }
          }}
          onBack={goBack}
          onNext={goNext}
        />
      )}

      {step === 3 && (
        <FindExpertStepThree
          stepOneData={stepOneData}
          stepTwoData={stepTwoData}
          matchedProviders={matchedProviders.length > 0 ? matchedProviders : TUTORIAL_MOCK_PROVIDERS}
          onBack={goBack}
          onSuccess={() => router.push("/dashboard")}
        />
      )}
    </div>
  );
};

export default function FindExpertPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="size-6 animate-spin text-[#005864]" />
        </div>
      }
    >
      <FindExpert />
    </Suspense>
  );
}
