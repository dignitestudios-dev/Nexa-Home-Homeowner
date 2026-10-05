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
          nextBtnText: "Finish Tutorial 🎉",
          prevBtnText: "← Step 2",
          onPrevClick: () => {
            driverObj.destroy();
            router.push("/tutorial/step-2");
          },
          onNextClick: () => {
            driverObj.destroy();
            handleFinish();
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
    setTutorialCompleted(true, userId);
    setSuccessModalOpen(true);
  };

  const handleDoneReturn = () => {
    setSuccessModalOpen(false);
    toast.success("Walkthrough completed! You're ready to find experts.", {
      description: "You can watch this tutorial anytime from Settings -> App Tutorial.",
    });
    router.push("/dashboard");
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

      {/* Tutorial Success Celebration Dialog */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-8 rounded-3xl bg-white border-none shadow-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#005864]/10 text-[#005864] mb-4">
            <CheckCircle2 className="size-10" />
          </div>

          <DialogTitle className="text-2xl font-bold text-[#181818]">
            Tutorial Complete! 🎉
          </DialogTitle>

          <DialogDescription className="text-sm text-slate-600 mt-2 leading-relaxed">
            You have successfully completed the walkthrough! You now know how to find experts, specify requirements, and create leads on Nexa Home.
          </DialogDescription>

          <div className="mt-6 space-y-3">
            <Button
              onClick={handleDoneReturn}
              className="w-full h-12 rounded-xl bg-[#005864] hover:bg-[#004752] text-white font-bold text-base cursor-pointer"
            >
              Go to Dashboard & Start Finding Pros
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
