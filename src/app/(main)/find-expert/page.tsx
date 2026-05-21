"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FindExpertForm from "./_components/find-expert-stepOne";
import ExpertMatchesForm from "./_components/find-expert-stepTwo";
import SummaryForm from "./_components/find-expert-stepThree";

export type JobType = "one-time" | "recurring";

export interface StepOneData {
  service: string;
  description: string;
  when: string;
  where: string;
  jobType: JobType;
  recurringDate: string;
  contactCall: boolean;
  contactEmail: boolean;
  uploadedImages: File[];
}

export interface Expert {
  id: number;
  name: string;
  rating: number;
  location: string;
  avatar: string | null;
  initials: string;
  avatarBg: string;
}

export interface StepTwoData {
  sendToAll: boolean;
  selectedExpertIds: number[];
}

export interface FindExpertFormData {
  stepOne: StepOneData;
  stepTwo: StepTwoData;
}

const initialStepOne: StepOneData = {
  service: "",
  description: "",
  when: "",
  where: "",
  jobType: "one-time",
  recurringDate: "2026-02-12",
  contactCall: false,
  contactEmail: false,
  uploadedImages: [],
};

const initialStepTwo: StepTwoData = {
  sendToAll: true,
  selectedExpertIds: [],
};

export const ALL_EXPERTS: Expert[] = [
  {
    id: 1,
    name: "Landscape Workshop",
    rating: 4.5,
    location: "Greater New-Orleans Area",
    avatar: null,
    initials: "LW",
    avatarBg: "#e8f5e9",
  },
  {
    id: 2,
    name: "Boot Krewe Cleaner",
    rating: 4.5,
    location: "Greater New-Orleans Area",
    avatar: null,
    initials: "BK",
    avatarBg: "#fff3e0",
  },
];

const FindExpert = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [stepOneData, setStepOneData] = useState<StepOneData>({
    ...initialStepOne,
    service: "",
  });

  useEffect(() => {
    try {
      const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
      const category = params.get('category');
      if (category) {
        setStepOneData((prev) => ({ ...prev, service: category }));
      }
    } catch (e) {
      // ignore
    }
  }, []);
  const [stepTwoData, setStepTwoData] = useState<StepTwoData>(initialStepTwo);

  // ── Step One handlers ─────────────────────────────────────
  const handleStepOneChange = <K extends keyof StepOneData>(
    field: K,
    value: StepOneData[K],
  ) => {
    setStepOneData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setStepOneData((prev) => ({
        ...prev,
        uploadedImages: [...prev.uploadedImages, ...Array.from(files)],
      }));
    }
  };

  const handleRemoveImage = (index: number) => {
    setStepOneData((prev) => ({
      ...prev,
      uploadedImages: prev.uploadedImages.filter((_, i) => i !== index),
    }));
  };

  // ── Step Two handlers ─────────────────────────────────────
  const handleToggleExpert = (id: number) => {
    setStepTwoData((prev) => {
      const already = prev.selectedExpertIds.includes(id);
      const updated = already
        ? prev.selectedExpertIds.filter((e) => e !== id)
        : [...prev.selectedExpertIds, id];
      return {
        ...prev,
        selectedExpertIds: updated,
        sendToAll: updated.length === ALL_EXPERTS.length,
      };
    });
  };

  const handleToggleSendToAll = () => {
    setStepTwoData((prev) => {
      const next = !prev.sendToAll;
      return {
        sendToAll: next,
        selectedExpertIds: next ? ALL_EXPERTS.map((e) => e.id) : [],
      };
    });
  };

  // ── Navigation ────────────────────────────────────────────
  const goBack = () => {
    if (currentStep === 1) {
      router.back();
    } else {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
    }
  };

  const goNext = () => {
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
    } else {
      // Final submit — send combined data to your API here
      const payload: FindExpertFormData = {
        stepOne: stepOneData,
        stepTwo: stepTwoData,
      };
      console.log("Submitting:", payload);
      // router.push("/success");
    }
  };

  // ── Selected expert objects (derived) ─────────────────────
  const selectedExperts = ALL_EXPERTS.filter((e) =>
    stepTwoData.selectedExpertIds.includes(e.id),
  );

  return (
    <div className="pb-6 px-10 lg:px-20">
      <>
        {currentStep === 1 && (
          <FindExpertForm
            data={stepOneData}
            onChange={handleStepOneChange}
            onImageUpload={handleImageUpload}
            onRemoveImage={handleRemoveImage}
            onBack={goBack}
            onNext={goNext}
          />
        )}

        {currentStep === 2 && (
          <ExpertMatchesForm
            data={stepTwoData}
            allExperts={ALL_EXPERTS}
            onToggleExpert={handleToggleExpert}
            onToggleSendToAll={handleToggleSendToAll}
            onBack={goBack}
            onNext={goNext}
          />
        )}

        {currentStep === 3 && (
          <SummaryForm
            stepOneData={stepOneData}
            selectedExperts={selectedExperts}
            onBack={goBack}
            onSubmit={goNext}
          />
        )}
      </>
    </div>
  );
};

export default FindExpert;
