"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  X,
  Sparkles,
  ArrowRight,
  Plus,
  HelpCircle,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SuccessDialog from "@/components/ui/success-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createTutorialDriver, TUTORIAL_STEPS, setTutorialCompleted } from "@/lib/tutorial";
import { useGetOwnUser } from "@/features/user/hooks";
import { Driver } from "driver.js";

interface DemoSearchCategory {
  _id: string;
  name: string;
  priceNote?: string;
}

const DEMO_CATEGORIES_CATALOG: DemoSearchCategory[] = [
  { _id: "demo-cat-air-duct", name: "Air Duct Cleaning", priceNote: "From $120" },
  { _id: "demo-cat-alarm", name: "Alarm System", priceNote: "From $150" },
  { _id: "demo-cat-appliance", name: "Appliance Installation", priceNote: "From $85" },
  { _id: "demo-cat-landscaping", name: "Landscaping & Lawn Care", priceNote: "From $65" },
  { _id: "demo-cat-plumbing", name: "Plumbing Pipe Repair", priceNote: "From $95" },
  { _id: "demo-cat-hvac", name: "HVAC System Tune-Up", priceNote: "From $110" },
  { _id: "demo-cat-window", name: "Window Washing", priceNote: "From $75" },
  { _id: "demo-cat-pressure", name: "Pressure Washing", priceNote: "From $130" },
  { _id: "demo-cat-pool", name: "Pool Cleaning", priceNote: "From $80" },
  { _id: "demo-cat-electric", name: "Electrical Panel Upgrade", priceNote: "From $250" },
  { _id: "demo-cat-pest", name: "Pest Control & Termite Barrier", priceNote: "From $90" },
  { _id: "demo-cat-gutter", name: "Gutter Cleaning & Guard Installation", priceNote: "From $100" },
];

const categoryRequestSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, "Please write your request (at least 3 characters)")
    .max(300, "Request must be 300 characters or less"),
});

type CategoryRequestFormValues = z.infer<typeof categoryRequestSchema>;

export default function TutorialFindExpertPage() {
  const router = useRouter();
  const driverRef = useRef<Driver | null>(null);
  const { data: userData } = useGetOwnUser();
  const userId = userData?.data?._id;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm.trim(), 250);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [tutorialSuccessModalOpen, setTutorialSuccessModalOpen] = useState(false);

  // Filter dummy categories
  const suggestedCategories = debouncedSearch
    ? DEMO_CATEGORIES_CATALOG.filter((c) =>
        c.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : [];

  const {
    register: registerRequest,
    handleSubmit: handleRequestSubmit,
    setValue: setRequestValue,
    watch: watchRequest,
    reset: resetRequestForm,
    formState: { errors: requestErrors },
  } = useForm<CategoryRequestFormValues>({
    resolver: zodResolver(categoryRequestSchema),
    defaultValues: {
      text: "",
    },
  });

  const requestTextValue = watchRequest("text");

  const openRequestModalWithPrefill = (prefillTerm?: string) => {
    const term = prefillTerm ?? searchTerm.trim();
    const initialText = term ? `Please add ${term} services in my area.` : "";
    setRequestValue("text", initialText);
    setIsRequestModalOpen(true);
  };

  const onRequestSubmit = (values: CategoryRequestFormValues) => {
    setIsRequestModalOpen(false);
    setIsSuccessModalOpen(true);
    resetRequestForm();
    toast.success("Category request submitted successfully!");
  };

  const handleSelectCategory = (cat: DemoSearchCategory) => {
    toast.info(`Selected "${cat.name}" category.`, {
      description: "In the live app, this continues directly into the Find an Expert wizard.",
    });
  };

  const handleSkip = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
    setTutorialCompleted(true, userId);
    toast.info("Tutorial skipped", {
      description: "You can restart the tutorial anytime from Settings -> App Tutorial.",
    });
    router.push("/dashboard");
  };

  const handleFinishTutorial = () => {
    if (driverRef.current) {
      driverRef.current.destroy();
    }
    setTutorialCompleted(true, userId);
    setTutorialSuccessModalOpen(true);
  };

  const handleDoneReturn = () => {
    setTutorialSuccessModalOpen(false);
    toast.success("Walkthrough completed! You're ready to find experts.", {
      description: "You can watch this tutorial anytime from Settings -> App Tutorial.",
    });
    router.push("/dashboard");
  };

  // Start tutorial on page mount
  useEffect(() => {
    const driverObj = createTutorialDriver({
      userId,
      onSkip: handleSkip,
    });
    driverRef.current = driverObj;

    driverObj.setSteps([
      // Popup 11: Discovery / Smart Search
      {
        ...TUTORIAL_STEPS.DISCOVERY_SMART_SEARCH,
        popover: {
          ...TUTORIAL_STEPS.DISCOVERY_SMART_SEARCH.popover,
          nextBtnText: "Next Step →",
          prevBtnText: "← Find an Expert",
          onPrevClick: () => {
            driverObj.destroy();
            router.push("/dashboard?tab=completed&startTutorial=find-expert");
          },
          onNextClick: () => {
            driverObj.drive(1);
          },
        },
      },
      // Popup 12: System / Notifications
      {
        ...TUTORIAL_STEPS.SYSTEM_NOTIFICATIONS,
        popover: {
          ...TUTORIAL_STEPS.SYSTEM_NOTIFICATIONS.popover,
          nextBtnText: "Next Step →",
          prevBtnText: "← Back",
          onPrevClick: () => {
            driverObj.drive(0);
          },
          onNextClick: () => {
            driverObj.drive(2);
          },
        },
      },
      // Popup 13: Settings / Profile
      {
        ...TUTORIAL_STEPS.SETTINGS_PROFILE,
        popover: {
          ...TUTORIAL_STEPS.SETTINGS_PROFILE.popover,
          nextBtnText: "Finish Tutorial 🎉",
          prevBtnText: "← Back",
          onPrevClick: () => {
            driverObj.drive(1);
          },
          onNextClick: () => {
            driverObj.destroy();
            handleFinishTutorial();
          },
        },
      },
    ]);

    const timer = setTimeout(() => {
      const el = document.querySelector("#tutorial-smart-search-card");
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

  const isQuerying = searchTerm.trim().length > 0;
  const showResults = isQuerying && suggestedCategories.length > 0;
  const showNoResults = isQuerying && suggestedCategories.length === 0;

  return (
    <div className="max-w-[1100px] mx-auto py-5 px-4 sm:px-6 lg:px-8 space-y-8 min-h-[85vh] flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/dashboard?tab=completed")}
            className="flex items-center justify-center size-10 rounded-full bg-white border border-[#E5E5E5] text-[#005864] hover:bg-[#005864]/5 transition-colors shadow-xs cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-semibold text-[#181818] tracking-tight">
              Find an Expert
            </h1>
            <p className="text-[13px] sm:text-[14px] text-gray-500">
              Search by service or ask our smart assistant
            </p>
          </div>
        </div>

        <button
          id="tutorial-request-category-btn"
          type="button"
          onClick={() => openRequestModalWithPrefill()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium text-[#005864] bg-white border border-[#005864]/20 hover:bg-[#005864]/5 hover:border-[#005864]/40 transition-colors shadow-xs cursor-pointer"
        >
          <Plus size={16} />
          Request Category
        </button>
      </div>

      {/* Main Interactive AI Search Card */}
      <div id="tutorial-smart-search-card" className="relative rounded-[24px] bg-white border border-[#E5E5E5] p-6 sm:p-10 shadow-sm flex flex-col items-center text-center overflow-hidden">
          {/* Decorative background blur */}
          <div className="absolute -top-16 -right-16 size-48 rounded-full bg-[#005864]/5 pointer-events-none blur-2xl" />
          <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-[#D7DF23]/10 pointer-events-none blur-2xl" />

          {/* Center AI Image */}
          <div className="relative mb-4 group">
            <div className="size-24 sm:size-28 rounded-2xl overflow-hidden border-2 border-white ring-1 ring-[#005864]/10 transition-transform duration-300 group-hover:scale-105 bg-white flex items-center justify-center shadow-xs">
              <Image
                src="/images/ai.jpg"
                alt="AI Assistant"
                width={120}
                height={120}
                priority
                className="object-contain w-full h-full p-1"
              />
            </div>
          </div>

          {/* Title and description */}
          <h2 className="text-[22px] sm:text-[26px] font-bold text-[#181818] mt-1 max-w-xl">
            What service do you need help with?
          </h2>
          <p className="text-[14px] text-gray-500 mt-1 max-w-lg">
            Type your required service name to find matching experts instantly.
          </p>

          {/* Search Input Box */}
          <div
            id="tutorial-search-input-container"
            className="w-full max-w-[620px] mt-6 relative"
          >
            <div className="relative flex items-center">
              <div className="absolute left-4 text-[#005864]">
                <Search size={20} className="text-[#005864]" />
              </div>

              <input
                id="tutorial-search-input"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="e.g. Window washing, Pressure washing, Plumbing..."
                className="w-full h-14 pl-12 pr-12 rounded-[16px] bg-white border border-[#CBD5E1] text-[16px] text-[#181818] placeholder:text-gray-400 outline-none transition focus:border-[#005864] focus:ring-3 focus:ring-[#005864]/15 shadow-xs"
              />

              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 size-7 flex items-center justify-center rounded-full bg-gray-200/80 hover:bg-gray-300 text-gray-600 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Results & Suggestions Section */}
        <div className="space-y-4 flex-1">
          {/* Suggested Categories Found */}
          {showResults && (
            <div className="space-y-4 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#005864]" />
                  <h3 className="text-[17px] font-semibold text-[#181818]">
                    Suggested Categories ({suggestedCategories.length})
                  </h3>
                </div>
                <p className="text-[13px] text-gray-500">
                  Click a category to continue
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {suggestedCategories.map((cat) => (
                  <div
                    key={cat._id}
                    onClick={() => handleSelectCategory(cat)}
                    className="group relative rounded-[16px] bg-white border border-[#E5E5E5] hover:border-[#005864] hover:shadow-md transition-all duration-200 p-4 flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="size-12 rounded-[12px] bg-[#005864]/10 text-[#005864] overflow-hidden shrink-0 flex items-center justify-center group-hover:bg-[#005864] group-hover:text-white transition-all">
                        <Wrench className="size-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-[15px] font-semibold text-[#181818] group-hover:text-[#005864] transition-colors truncate">
                          {cat.name}
                        </h4>
                        <p className="text-[12px] text-gray-500 mt-0.5">
                          {cat.priceNote ?? "Top rated service"}
                        </p>
                      </div>
                    </div>

                    <div className="size-8 rounded-full bg-[#F8F8F8] group-hover:bg-[#005864] group-hover:text-white text-gray-400 flex items-center justify-center transition-colors shrink-0">
                      <ArrowRight
                        size={15}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Suggested Categories Found */}
          {showNoResults && (
            <div className="rounded-[20px] bg-[#F9FAFA] border border-[#E5E5E5] p-8 sm:p-10 text-center flex flex-col items-center max-w-lg mx-auto shadow-xs animate-in fade-in-50 duration-300">
              <div className="size-16 rounded-full bg-[#005864]/10 text-[#005864] flex items-center justify-center mb-4">
                <HelpCircle size={32} />
              </div>
              <h3 className="text-[19px] font-bold text-[#181818]">
                No category found for &ldquo;{debouncedSearch}&rdquo;
              </h3>
              <p className="text-[14px] text-gray-500 mt-2 max-w-md">
                We couldn&apos;t find any active services matching your query. Would you like to request this new category?
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => openRequestModalWithPrefill(debouncedSearch)}
                  className="h-12 px-6 rounded-xl bg-[#005864] hover:bg-[#004a52] text-white text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Plus size={16} />
                  Request &ldquo;{debouncedSearch}&rdquo;
                </button>
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="h-12 px-5 rounded-xl bg-white border border-[#CBD5E1] hover:bg-gray-100 text-gray-700 text-[14px] font-medium transition-colors cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom helper card */}
        <div className="mt-auto pt-6 border-t border-[#EBEBEB] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <p className="text-[14px] font-medium text-[#181818]">
              Can&apos;t find the specific service you need?
            </p>
            <p className="text-[12px] text-gray-500">
              Submit a category request and our team will onboard experts for you.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openRequestModalWithPrefill()}
            className="text-[14px] font-semibold text-[#005864] hover:text-[#004750] underline underline-offset-4 transition-colors cursor-pointer shrink-0"
          >
            Request a New Category
          </button>
        </div>

      {/* Request Category Dialog */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[24px] border-none bg-white p-6 sm:p-8 shadow-xl">
          <DialogHeader className="space-y-2 text-left">
            <div className="size-12 rounded-2xl bg-[#005864]/10 text-[#005864] flex items-center justify-center mb-1">
              <Plus size={24} />
            </div>
            <DialogTitle className="text-[22px] font-bold text-[#181818]">
              Request a Category
            </DialogTitle>
            <DialogDescription className="text-[14px] text-gray-500">
              Tell us what service you need. We will review and make it available on Nexa Home.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleRequestSubmit(onRequestSubmit)}
            className="mt-4 space-y-4"
            noValidate
          >
            {/* Request Text Field */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#181818]">
                Request Details <span className="text-red-500">*</span>
              </label>
              <textarea
                {...registerRequest("text")}
                rows={4}
                placeholder="e.g. Please add gardening services in my area."
                maxLength={300}
                className={`w-full resize-none rounded-[12px] bg-[#F8F8F8] border px-4 py-3 text-[14px] text-[#181818] placeholder:text-gray-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#005864]/20 ${
                  requestErrors.text
                    ? "border-red-400 focus:border-red-400"
                    : "border-[#E5E5E5] focus:border-[#005864]"
                }`}
              />
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-red-500">
                  {requestErrors.text?.message ?? ""}
                </p>
                <p
                  className={`text-[12px] ${
                    (requestTextValue?.length ?? 0) >= 300
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {requestTextValue?.length ?? 0}/300
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="flex-1 h-12 rounded-[12px] bg-[#F8F8F8] hover:bg-gray-200 text-[#181818] text-[14px] font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 h-12 rounded-[12px] bg-[#005864] hover:bg-[#004a52] text-white text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                Submit Request
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Category Request Success Dialog */}
      <SuccessDialog
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Request Submitted"
        description="Thank you! Our operations team has received your category request and will review it."
      />

      {/* Tutorial Success Celebration Dialog */}
      <Dialog open={tutorialSuccessModalOpen} onOpenChange={setTutorialSuccessModalOpen}>
        <DialogContent className="sm:max-w-[480px] p-8 rounded-3xl bg-white border-none shadow-2xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#005864]/10 text-[#005864] mb-4">
            <CheckCircle2 className="size-10" />
          </div>

          <DialogTitle className="text-2xl font-bold text-[#181818]">
            Tutorial Complete! 🎉
          </DialogTitle>

          <DialogDescription className="text-sm text-slate-600 mt-2 leading-relaxed">
            You have successfully completed the walkthrough! You now know how to find experts, describe your requirements, submit leads, track ongoing and completed jobs, and request new service categories on Nexa Home.
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
