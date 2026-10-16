import { driver, Driver, DriveStep } from "driver.js";
import { toast } from "sonner";

export const TUTORIAL_STORAGE_KEY = "nexa_home_tutorial_completed";

export const isTutorialCompleted = (userId?: string): boolean => {
  if (typeof window === "undefined") return true;
  try {
    const key = userId ? `${TUTORIAL_STORAGE_KEY}_${userId}` : TUTORIAL_STORAGE_KEY;
    const val = localStorage.getItem(key);
    // If specific user key not found, fallback to generic key
    if (val !== null) return val === "true";
    return localStorage.getItem(TUTORIAL_STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export const setTutorialCompleted = (completed: boolean = true, userId?: string): void => {
  if (typeof window === "undefined") return;
  try {
    const key = userId ? `${TUTORIAL_STORAGE_KEY}_${userId}` : TUTORIAL_STORAGE_KEY;
    localStorage.setItem(key, completed ? "true" : "false");
    localStorage.setItem(TUTORIAL_STORAGE_KEY, completed ? "true" : "false");
  } catch (e) {
    console.error("Failed to save tutorial status", e);
  }
};

export const resetTutorial = (userId?: string): void => {
  if (typeof window === "undefined") return;
  try {
    const key = userId ? `${TUTORIAL_STORAGE_KEY}_${userId}` : TUTORIAL_STORAGE_KEY;
    localStorage.removeItem(key);
    localStorage.removeItem(TUTORIAL_STORAGE_KEY);
  } catch (e) {
    console.error("Failed to reset tutorial status", e);
  }
};

/**
 * Creates a configured Driver instance with customized Nexa Home styling
 */
export const createTutorialDriver = (options?: {
  onDestroyStarted?: () => void;
  onDestroyed?: () => void;
  onNextClick?: () => void;
  onPrevClick?: () => void;
  onDoneClick?: () => void;
  onCloseClick?: () => void;
  onSkip?: () => void;
  userId?: string;
}): Driver => {
  let driverInstance: Driver;

  driverInstance = driver({
    animate: true,
    allowClose: false,
    disableActiveInteraction: true,
    overlayClickBehavior: () => { },
    overlayColor: "#001216",
    overlayOpacity: 0.72,
    stagePadding: 8,
    stageRadius: 16,
    popoverClass: "nexa-tutorial-popover",
    showProgress: false,
    showButtons: ["next", "previous"],
    nextBtnText: "Next Step →",
    prevBtnText: "← Back",
    doneBtnText: "Got It!",
    onDestroyStarted: options?.onDestroyStarted,
    onDestroyed: options?.onDestroyed,
    onNextClick: options?.onNextClick,
    onPrevClick: options?.onPrevClick,
    onCloseClick: options?.onCloseClick,
    onPopoverRender: (popover) => {
      // 1. Remove/hide cross close button completely
      if (popover.closeButton) {
        popover.closeButton.style.display = "none";
      }

      // 2. Prevent card from stretching vertically
      if (popover.wrapper) {
        popover.wrapper.style.height = "auto";
        if (popover.wrapper.classList.contains("driver-popover-dashboard-home")) {
          popover.wrapper.style.bottom = "auto";
        }
      }

      // 2. Add Skip Tutorial button to footer if not present
      let skipBtn = popover.footer.querySelector<HTMLButtonElement>(".driver-popover-skip-btn");
      if (!skipBtn) {
        skipBtn = document.createElement("button");
        skipBtn.type = "button";
        skipBtn.className = "driver-popover-skip-btn";
        skipBtn.innerText = "Skip Tutorial";
        if (popover.footerButtons) {
          popover.footer.insertBefore(skipBtn, popover.footerButtons);
        } else {
          popover.footer.appendChild(skipBtn);
        }
      }

      skipBtn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (driverInstance) {
          driverInstance.destroy();
        }
        if (options?.onSkip) {
          options.onSkip();
        } else {
          setTutorialCompleted(true, options?.userId);
          toast.info("Tutorial skipped", {
            description: "You can restart the tutorial anytime from Settings -> App Tutorial.",
          });
          if (typeof window !== "undefined") {
            if (window.location.pathname.startsWith("/tutorial")) {
              window.location.href = "/dashboard";
            } else {
              const url = new URL(window.location.href);
              url.searchParams.delete("startTutorial");
              window.history.replaceState({}, "", url.pathname + (url.search ? url.search : ""));
            }
          }
        }
      };
    },
  });

  return driverInstance;
};

export function createTutorialStepTitle(badge: string | null, title: string): string {
  if (!badge) {
    return `<div class="font-bold text-[18px] text-[#181818]">${title}</div>`;
  }
  return `
    <div class="driver-popover-tag">${badge}</div>
    <div class="font-bold text-[18px] text-[#181818] mt-0.5">${title}</div>
  `;
}

/**
 * Step definitions for the complete Nexa Home Lead & Expert Walkthrough
 */
export const TUTORIAL_STEPS = {
  // Popup 1: Home (Whole Dashboard)
  DASHBOARD_HOME: {
    element: "#tutorial-dashboard-container",
    popover: {
      title: createTutorialStepTitle(null, "Home"),
      description: `
        <div class="space-y-2">
          <p>Pick or search for a service to get started. Your recent and popular services in your area show up here.</p>
        </div>
      `,
      side: "top" as const,
      align: "center" as const,
      popoverClass: "driver-popover-dashboard-home",
    },
  },

  // Popup 2: Booking Flow / Explore Services
  DASHBOARD_CATEGORIES: {
    element: "#tutorial-categories-section",
    popover: {
      title: createTutorialStepTitle("Booking Flow", "Explore Services"),
      description: `
        <div class="space-y-2">
          <p>Tap a service to start your job request. Once you fill in the details, you’ll see Experts who match your job.</p>
        </div>
      `,
      side: "top" as const,
      align: "center" as const,
    },
  },

  // Popup 3: Job Management / History
  DASHBOARD_TABS_HISTORY: {
    element: "#tutorial-dashboard-tabs",
    popover: {
      title: createTutorialStepTitle("Job Management", "History"),
      description: `
        <div class="space-y-2">
          <p>See all your job requests, from open to completed.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "start" as const,
    },
  },

  // Popup 4: Job Management / Ongoing Jobs
  DASHBOARD_ONGOING_TAB: {
    element: "#tutorial-ongoing-tab-btn",
    popover: {
      title: createTutorialStepTitle("Job Management", "Ongoing Jobs"),
      description: `
        <div class="space-y-2">
          <p>Track ongoing jobs here until they’re done.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "center" as const,
    },
  },

  // Popup 5: Status Update / Awaiting Response
  JOB_STATUS_AWAITING: {
    element: "#tutorial-job-card-0",
    popover: {
      title: createTutorialStepTitle("Status Update", "Awaiting Response"),
      description: `
        <div class="space-y-2">
          <p>Your job is posted. No Experts have reached out yet.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "center" as const,
    },
  },

  // Popup 6: Action Required / Confirm Expert
  JOB_ACTION_CONFIRM: {
    element: "#tutorial-job-card-1",
    popover: {
      title: createTutorialStepTitle("Action Required", "Confirm Expert"),
      description: `
        <div class="space-y-2">
          <p>Experts are interested in your job! Once you’ve decided who to hire, open the job and confirm your Expert.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "center" as const,
    },
  },

  // Popup 7: Active Status / Appliance Installation
  JOB_ACTIVE_STATUS: {
    element: "#tutorial-job-card-2",
    popover: {
      title: createTutorialStepTitle("Active Status", "Appliance Installation"),
      description: `
        <div class="space-y-2">
          <p>Your Expert is on the job. Mark it complete once the work is done.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "center" as const,
    },
  },

  // Popup 8: Review Flow / Completed
  DASHBOARD_COMPLETED_TAB: {
    element: "#tutorial-completed-tab-btn",
    popover: {
      title: createTutorialStepTitle("Review Flow", "Completed"),
      description: `
        <div class="space-y-2">
          <p>Finished jobs appear here. Open one to leave a review for your Expert.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "center" as const,
    },
  },

  // Popup 10: Discovery / Search for a Service (Find an Expert button)
  DISCOVERY_SEARCH: {
    element: "#tutorial-find-expert-btn",
    popover: {
      title: createTutorialStepTitle("Discovery", "Search for a Service"),
      description: `
        <div class="space-y-2">
          <p>Tap the magnifying glass to find the service you need.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "end" as const,
    },
  },

  // Popup 11: Discovery / Smart Search
  DISCOVERY_SMART_SEARCH: {
    element: "#tutorial-smart-search-card",
    popover: {
      title: createTutorialStepTitle("Discovery", "Smart Search"),
      description: `
        <div class="space-y-2">
          <p>Describe what you need in your own words. Our system analyzes your request to match Experts.</p>
        </div>
      `,
      side: "top" as const,
      align: "center" as const,
    },
  },

  // Popup 12: System / Notifications
  SYSTEM_NOTIFICATIONS: {
    element: "#tutorial-notifications-btn",
    popover: {
      title: createTutorialStepTitle("System", "Notifications"),
      description: `
        <div class="space-y-2">
          <p>Updates on your jobs, helpful reminders, and app news.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "end" as const,
    },
  },

  // Popup 13: Settings / Profile
  SETTINGS_PROFILE: {
    element: "#tutorial-profile-btn",
    popover: {
      title: createTutorialStepTitle("Settings", "Profile"),
      description: `
        <div class="space-y-2">
          <p>Manage your contact info, saved addresses, and notification settings.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "end" as const,
    },
  },
};

