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

/**
 * Step definitions for the complete Nexa Home Lead & Expert Walkthrough
 */
export const TUTORIAL_STEPS = {
  // Step 1: Dashboard Find Expert Button
  DASHBOARD_FIND_EXPERT: {
    element: "#tutorial-find-expert-btn",
    popover: {
      title: "1. Find an Expert",
      description: `
        <div class="space-y-2">
          <p>Looking for a licensed home service professional? Click <strong>Find an Expert</strong> to start your service request and match with verified pros in your area.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "end" as const,
    },
  },

  // Step 2: Dashboard Categories Tab / Cards
  DASHBOARD_CATEGORIES: {
    element: "#tutorial-categories-section",
    popover: {
      title: "2. Choose a Service Category",
      description: `
        <div class="space-y-2">
          <p>Explore popular services like <strong>Landscaping, Plumbing, Pest Control, Electrical, and HVAC</strong>.</p>
          <p>Clicking any service card immediately starts a request with that category pre-selected!</p>
        </div>
      `,
      side: "top" as const,
      align: "center" as const,
    },
  },

  // Step 3: Find Expert Wizard - Step 1 (Job Details)
  WIZARD_STEP_ONE: {
    element: "#tutorial-step-one-header",
    popover: {
      title: "3. Step 1: Tell Us What You Need",
      description: `
        <div class="space-y-2 text-[13px] leading-relaxed">
          <p>Fill out the essential requirements for your job:</p>
          <ul class="list-disc pl-4 space-y-1">
            <li><strong>Select Service (Required):</strong> The trade or skill required.</li>
            <li><strong>Description (Required):</strong> Explain the task, scope, or specific issues.</li>
            <li><strong>When & Location (Required):</strong> Set your timeline and property address.</li>
            <li><strong>Preferences & Photos:</strong> Add helpful images/videos and select contact preference (Phone or Email).</li>
          </ul>
        </div>
      `,
      side: "bottom" as const,
      align: "start" as const,
    },
  },

  // Step 4: Find Expert Wizard - Step 2 (Select Experts)
  WIZARD_STEP_TWO: {
    element: "#tutorial-step-two-header",
    popover: {
      title: "4. Step 2: Select Matching Experts",
      description: `
        <div class="space-y-2 text-[13px] leading-relaxed">
          <p>Choose which professionals receive your request:</p>
          <ul class="list-disc pl-4 space-y-1">
            <li><strong>Distance Radius:</strong> Adjust how far out to search for pros.</li>
            <li><strong>Send to All:</strong> Automatically alert all top-rated verified experts nearby.</li>
            <li><strong>Hand-Pick:</strong> Review ratings, badges, and select specific professionals individually.</li>
          </ul>
        </div>
      `,
      side: "bottom" as const,
      align: "start" as const,
    },
  },

  // Step 5: Find Expert Wizard - Step 3 (Review & Submit Lead)
  WIZARD_STEP_THREE: {
    element: "#tutorial-step-three-header",
    popover: {
      title: "3. Step 3: Review & Submit Lead",
      description: `
        <div class="space-y-2 text-[13px] leading-relaxed">
          <p>You're almost done! Double check all details:</p>
          <ul class="list-disc pl-4 space-y-1">
            <li>Review your service category, notes, attachments, and timing.</li>
            <li>Verify your location and chosen pros.</li>
            <li>Click <strong>Submit Lead</strong> — your request is sent directly to matching experts who will promptly reach out with quotes!</li>
          </ul>
        </div>
      `,
      side: "bottom" as const,
      align: "start" as const,
    },
  },

  // Step 4: Ongoing Requests & 3 Statuses
  DASHBOARD_ONGOING: {
    element: "#tutorial-ongoing-tab-section",
    popover: {
      title: "4. Ongoing Requests & 3 Statuses",
      description: `
        <div class="space-y-2 text-[13px] leading-relaxed">
          <p>Created leads appear in the <strong>Ongoing</strong> tab across 3 distinct stages:</p>
          <ul class="list-disc pl-4 space-y-1">
            <li><strong>Awaiting Response (Yellow):</strong> Request sent; waiting for nearby expert replies.</li>
            <li><strong>Confirm Expert (Red):</strong> Pros have submitted quotes; ready for you to confirm.</li>
            <li><strong>Ongoing (Blue):</strong> Expert is confirmed and work is actively in progress.</li>
          </ul>
        </div>
      `,
      side: "top" as const,
      align: "center" as const,
    },
  },

  // Step 5: Completed Jobs & History
  DASHBOARD_COMPLETED: {
    element: "#tutorial-completed-tab-section",
    popover: {
      title: "5. Completed Jobs & History",
      description: `
        <div class="space-y-2 text-[13px] leading-relaxed">
          <p>Once a service is finished and marked done, it moves to the <strong>Completed</strong> tab.</p>
          <p>Here you can easily reference your past job records, receipts, and contractor details anytime.</p>
        </div>
      `,
      side: "top" as const,
      align: "center" as const,
    },
  },

  // Step 6: Return to Dashboard Find Expert button
  DASHBOARD_FIND_EXPERT_RETURN: {
    element: "#tutorial-find-expert-btn",
    popover: {
      title: "6. Find an Expert Page",
      description: `
        <div class="space-y-2 text-[13px] leading-relaxed">
          <p>Now let's explore how to search for any custom service or request a new category if it's not available yet.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "end" as const,
    },
  },

  // Step 7: Find Expert Search Input
  FIND_EXPERT_SEARCH: {
    element: "#tutorial-search-input-container",
    popover: {
      title: "7. Search Any Service",
      description: `
        <div class="space-y-2 text-[13px] leading-relaxed">
          <p>Type any home service or repair you need. Our system will instantly find matching categories and verified experts in your area.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "center" as const,
    },
  },

  // Step 8: Request Category Button
  FIND_EXPERT_REQUEST_CATEGORY: {
    element: "#tutorial-request-category-btn",
    popover: {
      title: "8. Can't Find It? Request a Category!",
      description: `
        <div class="space-y-2 text-[13px] leading-relaxed">
          <p>If you search and can't find your required service, simply click <strong>Request Category</strong>! You can tell us what service you need, and our team will review it and onboard verified local experts for you.</p>
        </div>
      `,
      side: "bottom" as const,
      align: "end" as const,
    },
  },
};

