"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DemoStepTwoView from "../_components/demo-step-two-view";
import { StepTwoData } from "../../find-expert/page";
import { DEMO_STEP_TWO_DATA } from "../_components/demo-data";
import { createTutorialDriver, TUTORIAL_STEPS } from "@/lib/tutorial";
import { Driver } from "driver.js";

export default function TutorialStepTwoPage() {
  const router = useRouter();
  const driverRef = useRef<Driver | null>(null);
  const [data, setData] = useState<StepTwoData>(DEMO_STEP_TWO_DATA);

  useEffect(() => {
    const driverObj = createTutorialDriver();
    driverRef.current = driverObj;

    driverObj.setSteps([
      {
        ...TUTORIAL_STEPS.WIZARD_STEP_TWO,
        popover: {
          ...TUTORIAL_STEPS.WIZARD_STEP_TWO.popover,
          nextBtnText: "Next: Step 3 →",
          prevBtnText: "← Step 1",
          onPrevClick: () => {
            driverObj.destroy();
            router.push("/tutorial/step-1");
          },
          onNextClick: () => {
            driverObj.destroy();
            router.push("/tutorial/step-3");
          },
        },
      },
    ]);

    const timer = setTimeout(() => {
      const el = document.querySelector("#tutorial-step-two-header");
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
  }, [router]);

  const handleToggleProvider = (id: string, allProviderIds: string[]) => {
    setData((prev) => {
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
    setData((prev) => {
      const next = !prev.sendToAll;
      return {
        ...prev,
        sendToAll: next,
        selectedProviderIds: next ? allProviderIds : [],
      };
    });
  };

  const handleRadiusChange = (radius: number) => {
    setData((prev) => ({ ...prev, radius }));
  };

  const handleNext = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
    router.push("/tutorial/step-3");
  };

  const handleBack = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
    router.push("/tutorial/step-1");
  };

  return (
    <div className="pb-6 px-5 lg:px-20">
      <DemoStepTwoView
        data={data}
        onToggleProvider={handleToggleProvider}
        onToggleSendToAll={handleToggleSendToAll}
        onRadiusChange={handleRadiusChange}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  );
}
