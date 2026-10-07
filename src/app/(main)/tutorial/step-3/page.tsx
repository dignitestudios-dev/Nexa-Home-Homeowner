"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import DemoStepThreeView from "../_components/demo-step-three-view";
import { DEMO_STEP_ONE_DATA, DEMO_STEP_TWO_DATA } from "../_components/demo-data";
import { createTutorialDriver, TUTORIAL_STEPS, setTutorialCompleted } from "@/lib/tutorial";
import { useGetOwnUser } from "@/features/user/hooks";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { Driver } from "driver.js";
import { toast } from "sonner";

export default function TutorialStepThreePage() {
  const router = useRouter();
  const driverRef = useRef<Driver | null>(null);
  const { data: userData } = useGetOwnUser();
  const userId = userData?.data?._id;
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  useEffect(() => {
    const driverObj = createTutorialDriver();
    driverRef.current = driverObj;

    driverObj.setSteps([
      {
        ...TUTORIAL_STEPS.WIZARD_STEP_THREE,
        popover: {
          ...TUTORIAL_STEPS.WIZARD_STEP_THREE.popover,
          nextBtnText: "Submit Lead & Go to Ongoing →",
          prevBtnText: "← Step 2",
          onPrevClick: () => {
            driverObj.destroy();
            router.push("/tutorial/step-2");
          },
          onNextClick: () => {
            driverObj.destroy();
            router.push("/dashboard?tab=ongoing&startTutorial=ongoing");
          },
        },
      },
    ]);

    const timer = setTimeout(() => {
      const el = document.querySelector("#tutorial-step-three-header");
      if (el) {
        driverObj.drive(0);
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [router, userId]);

  const handleFinish = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
    router.push("/dashboard?tab=ongoing&startTutorial=ongoing");
  };

  const handleBack = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
    router.push("/tutorial/step-2");
  };

  return (
    <div className="pb-6 px-5 lg:px-20">
      <DemoStepThreeView
        stepOneData={DEMO_STEP_ONE_DATA}
        stepTwoData={DEMO_STEP_TWO_DATA}
        onBack={handleBack}
        onSuccess={handleFinish}
      />
    </div>
  );
}
