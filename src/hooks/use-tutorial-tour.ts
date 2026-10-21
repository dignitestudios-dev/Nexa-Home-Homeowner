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

function waitForElement(selector: string, callback: () => void, maxAttempts = 20) {
  let count = 0;
  const timer = setInterval(() => {
    count++;
    if (document.querySelector(selector) || count >= maxAttempts) {
      clearInterval(timer);
      callback();
    }
  }, 60);
}

export function useTutorialTour() {
  const router = useRouter();
  const driverInstanceRef = useRef<Driver | null>(null);

  /**
   * Starts the Dashboard Tour (Steps 1 through 8)
   */
  const startDashboardTour = useCallback(
    (options: {
      userId?: string;
      handleTabChange: (tab: string) => void;
      initialStepIndex?: number;
    }) => {
      const { userId, handleTabChange, initialStepIndex = 0 } = options;

      // Clean up previous instance if active
      if (driverInstanceRef.current && driverInstanceRef.current.isActive()) {
        driverInstanceRef.current.destroy();
      }

      const onSkip = () => {
        if (driverInstanceRef.current) {
          driverInstanceRef.current.destroy();
          driverInstanceRef.current = null;
        }
        setTutorialCompleted(true, userId);
        toast.info("Tutorial skipped", {
          description: "You can restart the tutorial anytime from Settings -> App Tutorial.",
        });
        router.replace("/dashboard");
      };

      const driverObj = createTutorialDriver({
        onDestroyed: () => {
          driverInstanceRef.current = null;
        },
        userId,
        onSkip,
      });

      driverInstanceRef.current = driverObj;

      driverObj.setSteps([
        // Step 0 (Popup 1): Home / Find an Expert
        {
          ...TUTORIAL_STEPS.DASHBOARD_HOME,
          popover: {
            ...TUTORIAL_STEPS.DASHBOARD_HOME.popover,
            nextBtnText: "Next Step →",
            onNextClick: () => {
              waitForElement("#tutorial-categories-section", () => {
                driverObj.drive(1);
              });
            },
          },
        },

        // Step 1 (Popup 2): Booking Flow / Explore Services
        {
          ...TUTORIAL_STEPS.DASHBOARD_CATEGORIES,
          popover: {
            ...TUTORIAL_STEPS.DASHBOARD_CATEGORIES.popover,
            nextBtnText: "Next Step →",
            prevBtnText: "← Back",
            onPrevClick: () => {
              waitForElement("#tutorial-dashboard-container", () => {
                driverObj.drive(0);
              });
            },
            onNextClick: () => {
              waitForElement("#tutorial-dashboard-tabs", () => {
                driverObj.drive(2);
              });
            },
          },
        },

        // Step 2 (Popup 3): Job Management / History (Tabs container)
        {
          ...TUTORIAL_STEPS.DASHBOARD_TABS_HISTORY,
          popover: {
            ...TUTORIAL_STEPS.DASHBOARD_TABS_HISTORY.popover,
            nextBtnText: "Next Step →",
            prevBtnText: "← Back",
            onPrevClick: () => {
              waitForElement("#tutorial-categories-section", () => {
                driverObj.drive(1);
              });
            },
            onNextClick: () => {
              handleTabChange("Ongoing");
              waitForElement("#tutorial-ongoing-tab-btn", () => {
                driverObj.drive(3);
              });
            },
          },
        },

        // Step 3 (Popup 4): Job Management / Ongoing Jobs
        {
          ...TUTORIAL_STEPS.DASHBOARD_ONGOING_TAB,
          popover: {
            ...TUTORIAL_STEPS.DASHBOARD_ONGOING_TAB.popover,
            nextBtnText: "Next Step →",
            prevBtnText: "← Back",
            onPrevClick: () => {
              handleTabChange("Home");
              waitForElement("#tutorial-dashboard-tabs", () => {
                driverObj.drive(2);
              });
            },
            onNextClick: () => {
              waitForElement("#tutorial-job-card-0", () => {
                driverObj.drive(4);
              });
            },
          },
        },

        // Step 4 (Popup 5): Status Update / Awaiting Response (Card 0)
        {
          ...TUTORIAL_STEPS.JOB_STATUS_AWAITING,
          popover: {
            ...TUTORIAL_STEPS.JOB_STATUS_AWAITING.popover,
            nextBtnText: "Next Step →",
            prevBtnText: "← Back",
            onPrevClick: () => {
              waitForElement("#tutorial-ongoing-tab-btn", () => {
                driverObj.drive(3);
              });
            },
            onNextClick: () => {
              waitForElement("#tutorial-job-card-1", () => {
                driverObj.drive(5);
              });
            },
          },
        },

        // Step 5 (Popup 6): Action Required / Confirm Expert (Card 1)
        {
          ...TUTORIAL_STEPS.JOB_ACTION_CONFIRM,
          popover: {
            ...TUTORIAL_STEPS.JOB_ACTION_CONFIRM.popover,
            nextBtnText: "Next Step →",
            prevBtnText: "← Back",
            onPrevClick: () => {
              waitForElement("#tutorial-job-card-0", () => {
                driverObj.drive(4);
              });
            },
            onNextClick: () => {
              waitForElement("#tutorial-job-card-2", () => {
                driverObj.drive(6);
              });
            },
          },
        },

        // Step 6 (Popup 7): Active Status / Appliance Installation (Card 2)
        {
          ...TUTORIAL_STEPS.JOB_ACTIVE_STATUS,
          popover: {
            ...TUTORIAL_STEPS.JOB_ACTIVE_STATUS.popover,
            nextBtnText: "Next Step →",
            prevBtnText: "← Back",
            onPrevClick: () => {
              waitForElement("#tutorial-job-card-1", () => {
                driverObj.drive(5);
              });
            },
            onNextClick: () => {
              handleTabChange("Completed");
              waitForElement("#tutorial-completed-tab-btn", () => {
                driverObj.drive(7);
              });
            },
          },
        },

        // Step 7 (Popup 8): Review Flow / Completed
        {
          ...TUTORIAL_STEPS.DASHBOARD_COMPLETED_TAB,
          popover: {
            ...TUTORIAL_STEPS.DASHBOARD_COMPLETED_TAB.popover,
            nextBtnText: "Next: Find an Expert →",
            prevBtnText: "← Back",
            onPrevClick: () => {
              handleTabChange("Ongoing");
              waitForElement("#tutorial-job-card-2", () => {
                driverObj.drive(6);
              });
            },
            onNextClick: () => {
              waitForElement("#tutorial-find-expert-btn", () => {
                driverObj.drive(8);
              });
            },
          },
        },

        // Step 8 (Popup 10): Discovery / Search for a Service (Find an Expert button)
        {
          ...TUTORIAL_STEPS.DISCOVERY_SEARCH,
          popover: {
            ...TUTORIAL_STEPS.DISCOVERY_SEARCH.popover,
            nextBtnText: "Next: Smart Search →",
            prevBtnText: "← Completed Tab",
            onPrevClick: () => {
              waitForElement("#tutorial-completed-tab-btn", () => {
                driverObj.drive(7);
              });
            },
            onNextClick: () => {
              if (driverInstanceRef.current) {
                driverInstanceRef.current.destroy();
                driverInstanceRef.current = null;
              }
              router.push("/tutorial/find-expert");
            },
          },
        },
      ]);

      const targetSelector =
        initialStepIndex === 8
          ? "#tutorial-find-expert-btn"
          : initialStepIndex === 7
          ? "#tutorial-completed-tab-btn"
          : initialStepIndex === 3
          ? "#tutorial-ongoing-tab-btn"
          : "#tutorial-dashboard-container";

      setTimeout(() => {
        waitForElement(targetSelector, () => {
          driverObj.drive(initialStepIndex);
        });
      }, 350);
    },
    [router]
  );

  const stopTour = useCallback(() => {
    if (driverInstanceRef.current) {
      driverInstanceRef.current.destroy();
      driverInstanceRef.current = null;
    }
  }, []);

  const runWizardStepOne = useCallback((onNextStep?: () => void) => {
    onNextStep?.();
  }, []);

  const runWizardStepTwo = useCallback((onNextStep?: () => void, onPrevStep?: () => void) => {
    onNextStep?.();
  }, []);

  const runWizardStepThree = useCallback((onPrevStep?: () => void, userId?: string) => {
  }, []);

  const driveOngoingTutorialStep = useCallback((onNextToCompleted?: () => void) => {
    onNextToCompleted?.();
  }, []);

  const driveCompletedTutorialStep = useCallback((onBackToOngoing?: () => void, onFinish?: () => void) => {
    onFinish?.();
  }, []);

  return {
    startDashboardTour,
    runWizardStepOne,
    runWizardStepTwo,
    runWizardStepThree,
    driveOngoingTutorialStep,
    driveCompletedTutorialStep,
    stopTour,
    isTutorialCompleted,
    setTutorialCompleted,
  };
}
