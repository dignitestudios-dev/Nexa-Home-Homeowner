import { driver, Driver, DriveStep } from "driver.js";

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
}): Driver => {
  return driver({
    animate: true,
    allowClose: false,
    disableActiveInteraction: true,
    overlayClickBehavior: () => {},
    overlayOpacity: 0.65,
    stagePadding: 8,
    stageRadius: 16,
    popoverClass: "nexa-tutorial-popover",
    showProgress: true,
    showButtons: ["next", "previous"],
    progressText: "Step {{current}} of {{total}}",
    nextBtnText: "Next Step →",
    prevBtnText: "← Back",
    doneBtnText: "Got It!",
    onDestroyStarted: options?.onDestroyStarted,
    onDestroyed: options?.onDestroyed,
  });
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
      title: "5. Step 3: Review & Submit Lead",
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
};
