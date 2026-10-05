"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import DemoStepOneView from "../_components/demo-step-one-view";
import { StepOneData } from "../../find-expert/page";
import { DEMO_STEP_ONE_DATA } from "../_components/demo-data";
import { createTutorialDriver, TUTORIAL_STEPS } from "@/lib/tutorial";
import { Driver } from "driver.js";

export default function TutorialStepOnePage() {
  const router = useRouter();
  const driverRef = useRef<Driver | null>(null);
  const [data, setData] = useState<StepOneData>(DEMO_STEP_ONE_DATA);

  useEffect(() => {
    const driverObj = createTutorialDriver();
    driverRef.current = driverObj;

    driverObj.setSteps([
      {
        ...TUTORIAL_STEPS.WIZARD_STEP_ONE,
        popover: {
          ...TUTORIAL_STEPS.WIZARD_STEP_ONE.popover,
          nextBtnText: "Next: Step 2 →",
          prevBtnText: "← Home",
          onPrevClick: () => {
            driverObj.destroy();
            router.push("/dashboard?startTutorial=true");
          },
          onNextClick: () => {
            driverObj.destroy();
            router.push("/tutorial/step-2");
          },
        },
      },
    ]);

    const timer = setTimeout(() => {
      const el = document.querySelector("#tutorial-step-one-header");
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

  const handleChange = <K extends keyof StepOneData>(field: K, value: StepOneData[K]) => {
    setData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
    router.push("/tutorial/step-2");
  };

  const handleBack = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
    router.push("/dashboard");
  };

  return (
    <div className="pb-6 px-5 lg:px-20">
      <DemoStepOneView
        data={data}
        onChange={handleChange}
        onBack={handleBack}
        onNext={handleNext}
      />
    </div>
  );
}
