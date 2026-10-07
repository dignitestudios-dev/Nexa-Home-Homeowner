"use client";

import { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Driver } from "driver.js";
import {
  createTutorialDriver,
  TUTORIAL_STEPS,
  setTutorialCompleted,
  isTutorialCompleted,
} from "@/lib/tutorial";
import { toast } from "sonner";

export function useTutorialTour() {
  const router = useRouter();
  const driverInstanceRef = useRef<Driver | null>(null);

  /**
   * Starts Dashboard Tour (Steps 1 & 2)
   */
  const startDashboardTour = useCallback(
    (userId?: string) => {
      // Clean up previous instance if active
      if (driverInstanceRef.current && driverInstanceRef.current.isActive()) {
        driverInstanceRef.current.destroy();
      }

      const driverObj = createTutorialDriver({
        onDestroyed: () => {
          driverInstanceRef.current = null;
        },
      });

      driverInstanceRef.current = driverObj;

      driverObj.setSteps([
        {
          ...TUTORIAL_STEPS.DASHBOARD_FIND_EXPERT,
          popover: {
            ...TUTORIAL_STEPS.DASHBOARD_FIND_EXPERT.popover,
            nextBtnText: "Next: Categories →",
            onNextClick: () => {
              driverObj.moveNext();
            },
          },
        },
        {
          ...TUTORIAL_STEPS.DASHBOARD_CATEGORIES,
          popover: {
            ...TUTORIAL_STEPS.DASHBOARD_CATEGORIES.popover,
            nextBtnText: "Next: Step 1 →",
            prevBtnText: "← Back",
            onNextClick: () => {
              driverObj.destroy();
              // Smoothly transition to separate tutorial stepper pages
              router.push("/tutorial/step-1");
            },
            onPrevClick: () => {
              driverObj.movePrevious();
            },
          },
        },
      ]);

      // Delay briefly to allow DOM elements to fully settle
      setTimeout(() => {
        const btn = document.querySelector("#tutorial-find-expert-btn");
        if (btn) {
          driverObj.drive(0);
        }
      }, 400);
    },
    [router]
  );

  /**
   * Runs Step 1 Tour in Find Expert (Step 3 of total)
   */
  const runWizardStepOne = useCallback(
    (onNextStep: () => void) => {
      if (driverInstanceRef.current && driverInstanceRef.current.isActive()) {
        driverInstanceRef.current.destroy();
      }

      const driverObj = createTutorialDriver();
      driverInstanceRef.current = driverObj;

      driverObj.setSteps([
        {
          ...TUTORIAL_STEPS.WIZARD_STEP_ONE,
          popover: {
            ...TUTORIAL_STEPS.WIZARD_STEP_ONE.popover,
            nextBtnText: "Next: Step 2 (Select Experts) →",
            prevBtnText: "← Back to Home",
            onPrevClick: () => {
              driverObj.destroy();
              router.push("/dashboard?startTutorial=true");
            },
            onNextClick: () => {
              driverObj.destroy();
              onNextStep();
            },
          },
        },
      ]);

      setTimeout(() => {
        const target = document.querySelector("#tutorial-step-one-header");
        if (target) {
          driverObj.drive(0);
        }
      }, 400);
    },
    [router]
  );

  /**
   * Runs Step 2 Tour in Find Expert (Step 4 of total)
   */
  const runWizardStepTwo = useCallback(
    (onNextStep: () => void, onPrevStep: () => void) => {
      if (driverInstanceRef.current && driverInstanceRef.current.isActive()) {
        driverInstanceRef.current.destroy();
      }

      const driverObj = createTutorialDriver();
      driverInstanceRef.current = driverObj;

      driverObj.setSteps([
        {
          ...TUTORIAL_STEPS.WIZARD_STEP_TWO,
          popover: {
            ...TUTORIAL_STEPS.WIZARD_STEP_TWO.popover,
            nextBtnText: "Next: Step 3 (Review & Lead) →",
            prevBtnText: "← Step 1",
            onPrevClick: () => {
              driverObj.destroy();
              onPrevStep();
            },
            onNextClick: () => {
              driverObj.destroy();
              onNextStep();
            },
          },
        },
      ]);

      setTimeout(() => {
        const target = document.querySelector("#tutorial-step-two-header");
        if (target) {
          driverObj.drive(0);
        }
      }, 400);
    },
    []
  );

  /**
   * Runs Step 3 Tour in Find Expert (Step 5 of total)
   */
  const runWizardStepThree = useCallback(
    (onPrevStep: () => void, userId?: string) => {
      if (driverInstanceRef.current && driverInstanceRef.current.isActive()) {
        driverInstanceRef.current.destroy();
      }

      const driverObj = createTutorialDriver();
      driverInstanceRef.current = driverObj;

      driverObj.setSteps([
        {
          ...TUTORIAL_STEPS.WIZARD_STEP_THREE,
          popover: {
            ...TUTORIAL_STEPS.WIZARD_STEP_THREE.popover,
            nextBtnText: "Submit Lead & Go to Ongoing →",
            prevBtnText: "← Step 2",
            onPrevClick: () => {
              driverObj.destroy();
              onPrevStep();
            },
            onNextClick: () => {
              driverObj.destroy();
              router.push("/dashboard?tab=ongoing&startTutorial=ongoing");
            },
          },
        },
      ]);

      setTimeout(() => {
        const target = document.querySelector("#tutorial-step-three-header");
        if (target) {
          driverObj.drive(0);
        }
      }, 400);
    },
    [router]
  );

  /**
   * Drives Ongoing step on Dashboard
   */
  const driveOngoingTutorialStep = useCallback(
    (onNextToCompleted: () => void) => {
      if (driverInstanceRef.current) {
        driverInstanceRef.current.destroy();
      }

      const driverObj = createTutorialDriver();
      driverInstanceRef.current = driverObj;

      driverObj.setSteps([
        {
          ...TUTORIAL_STEPS.DASHBOARD_ONGOING,
          popover: {
            ...TUTORIAL_STEPS.DASHBOARD_ONGOING.popover,
            nextBtnText: "Next: Completed Tab →",
            prevBtnText: "← Step 3 (Review)",
            onPrevClick: () => {
              driverObj.destroy();
              router.push("/tutorial/step-3");
            },
            onNextClick: () => {
              driverObj.destroy();
              onNextToCompleted();
            },
          },
        },
      ]);

      setTimeout(() => {
        const target = document.querySelector("#tutorial-ongoing-tab-section");
        if (target) {
          driverObj.drive(0);
        }
      }, 350);
    },
    [router]
  );

  /**
   * Drives Completed step on Dashboard
   */
  const driveCompletedTutorialStep = useCallback(
    (onBackToOngoing: () => void, onFinish: () => void) => {
      if (driverInstanceRef.current) {
        driverInstanceRef.current.destroy();
      }

      let isFinished = false;
      const triggerFinish = () => {
        if (isFinished) return;
        isFinished = true;
        if (driverInstanceRef.current) {
          driverInstanceRef.current.destroy();
          driverInstanceRef.current = null;
        }
        onFinish();
      };

      const driverObj = createTutorialDriver({
        onDestroyed: () => {
          driverInstanceRef.current = null;
        },
      });
      driverInstanceRef.current = driverObj;

      driverObj.setSteps([
        {
          ...TUTORIAL_STEPS.DASHBOARD_COMPLETED,
          popover: {
            ...TUTORIAL_STEPS.DASHBOARD_COMPLETED.popover,
            nextBtnText: "Finish Tutorial 🎉",
            doneBtnText: "Finish Tutorial 🎉",
            prevBtnText: "← Ongoing Tab",
            onPrevClick: () => {
              driverObj.destroy();
              onBackToOngoing();
            },
            onNextClick: () => {
              triggerFinish();
            },
            onDoneClick: () => {
              triggerFinish();
            },
            onCloseClick: () => {
              triggerFinish();
            },
          },
        },
      ]);

      setTimeout(() => {
        const target = document.querySelector("#tutorial-completed-tab-section");
        if (target) {
          driverObj.drive(0);
        }
      }, 350);
    },
    []
  );

  const stopTour = useCallback(() => {
    if (driverInstanceRef.current) {
      driverInstanceRef.current.destroy();
      driverInstanceRef.current = null;
    }
  }, []);

  return {
    startDashboardTour,
    driveOngoingTutorialStep,
    driveCompletedTutorialStep,
    runWizardStepOne,
    runWizardStepTwo,
    runWizardStepThree,
    stopTour,
    isTutorialCompleted,
    setTutorialCompleted,
  };
}
