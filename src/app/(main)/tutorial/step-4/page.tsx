"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import TutorialStepperHeader from "../_components/tutorial-stepper-header";
import DemoDashboardView from "../_components/demo-dashboard-view";
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

export default function TutorialStepFourPage() {
  const router = useRouter();
  const driverRef = useRef<Driver | null>(null);
  const { data: userData } = useGetOwnUser();
  const userId = userData?.data?._id;

  const [activeTab, setActiveTab] = useState<"Ongoing" | "Completed">("Ongoing");
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const startOngoingTour = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }

    const driverObj = createTutorialDriver();
    driverRef.current = driverObj;

    driverObj.setSteps([
      {
        ...TUTORIAL_STEPS.DASHBOARD_ONGOING,
        popover: {
          ...TUTORIAL_STEPS.DASHBOARD_ONGOING.popover,
          nextBtnText: "Next: Completed Jobs →",
          prevBtnText: "← Step 3 (Review)",
          onPrevClick: () => {
            driverObj.destroy();
            router.push("/tutorial/step-3");
          },
          onNextClick: () => {
            driverObj.destroy();
            setActiveTab("Completed");
          },
        },
      },
    ]);

    setTimeout(() => {
      const el = document.querySelector("#tutorial-ongoing-tab-section");
      if (el) {
        driverObj.drive(0);
      }
    }, 450);
  };

  const startCompletedTour = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }

    const driverObj = createTutorialDriver();
    driverRef.current = driverObj;

    driverObj.setSteps([
      {
        ...TUTORIAL_STEPS.DASHBOARD_COMPLETED,
        popover: {
          ...TUTORIAL_STEPS.DASHBOARD_COMPLETED.popover,
          nextBtnText: "Finish Tutorial 🎉",
          prevBtnText: "← Ongoing Requests",
          onPrevClick: () => {
            driverObj.destroy();
            setActiveTab("Ongoing");
          },
          onNextClick: () => {
            driverObj.destroy();
            handleFinish();
          },
        },
      },
    ]);

    setTimeout(() => {
      const el = document.querySelector("#tutorial-completed-tab-section");
      if (el) {
        driverObj.drive(0);
      }
    }, 450);
  };

  useEffect(() => {
    if (activeTab === "Ongoing") {
      startOngoingTour();
    } else {
      startCompletedTour();
    }

    return () => {
      if (driverRef.current) {
        driverRef.current.destroy();
      }
    };
  }, [activeTab]);

  const handleTabChange = (tab: "Ongoing" | "Completed") => {
    setActiveTab(tab);
  };

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

  return (
    <div className="pb-8 px-5 lg:px-20">
      <TutorialStepperHeader
        currentStep={4}
        title="Tracking Ongoing Requests & Completed History"
      />

      <div className="rounded-3xl bg-white p-6 sm:p-8 shadow-sm border border-slate-100">
        <DemoDashboardView
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

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
            You have successfully completed the walkthrough! You now know how to find experts, describe your requirements, submit leads, and track ongoing and completed jobs on Nexa Home.
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
