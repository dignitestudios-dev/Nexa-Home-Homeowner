"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  Search,
  Layers,
  FileEdit,
  Users,
  Send,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetOwnUser } from "@/features/user/hooks";
import { isTutorialCompleted, resetTutorial } from "@/lib/tutorial";
import { toast } from "sonner";

const TUTORIAL_STEPS_OVERVIEW = [
  {
    step: 1,
    title: "Find an Expert",
    icon: Search,
    desc: "Start a service request from the dashboard search button to connect with licensed, verified experts.",
    highlight: "Home Dashboard",
    href: "/dashboard?startTutorial=true",
  },
  {
    step: 2,
    title: "Select Service Category",
    icon: Layers,
    desc: "Choose from popular categories like Landscaping, Plumbing, HVAC, and more. Selecting a card pre-selects the category.",
    highlight: "Popular Services",
    href: "/dashboard?startTutorial=true",
  },
  {
    step: 3,
    title: "Job Details & Requirements",
    icon: FileEdit,
    desc: "Describe your job, select preferred timeline/date, choose property address, and attach optional photos or videos.",
    highlight: "Step 1 Demo Page",
    href: "/tutorial/step-1",
  },
  {
    step: 4,
    title: "Select Matching Pros",
    icon: Users,
    desc: "Adjust the distance radius slider and either pick individual top-rated experts or use 'Send to All' to reach all matches.",
    highlight: "Step 2 Demo Page",
    href: "/tutorial/step-2",
  },
  {
    step: 5,
    title: "Review & Submit Lead",
    icon: Send,
    desc: "Review your request summary and submit your lead. Verified pros will receive your request and respond with quotes.",
    highlight: "Step 3 Demo Page",
    href: "/tutorial/step-3",
  },
  {
    step: 6,
    title: "Track Ongoing & Completed",
    icon: Clock,
    desc: "Monitor submitted requests with live expert responses and review your archived completed projects history.",
    highlight: "Dashboard Ongoing Tab",
    href: "/dashboard?tab=ongoing&startTutorial=ongoing",
  },
];

export default function TutorialSettings() {
  const router = useRouter();
  const { data: userData } = useGetOwnUser();
  const userId = userData?.data?._id;
  const [completed, setCompleted] = useState<boolean>(false);

  useEffect(() => {
    setCompleted(isTutorialCompleted(userId));
  }, [userId]);

  const handleStartTutorial = () => {
    toast.info("Starting Interactive Walkthrough...", {
      description: "Redirecting you to the dashboard tutorial.",
    });
    router.push("/dashboard?startTutorial=true");
  };

  const handleResetStatus = () => {
    resetTutorial(userId);
    setCompleted(false);
    toast.success("Tutorial status reset!", {
      description: "The interactive walkthrough will show automatically on your next visit.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-[#181818]">
          App Tutorial & Guided Walkthrough
        </h2>
        <p className="mt-1 text-sm text-[#18181899]">
          Learn how to find experts, describe your job requirements, and create leads effortlessly on Nexa Home.
        </p>
      </div>

      {/* Hero Action Card */}
      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#005864] via-[#004750] to-[#002f35] p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              {/* <Sparkles className="size-3.5 text-yellow-300" /> */}
              <span>Interactive Step-by-Step Guide</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Watch How to Find an Expert & Create a Lead
            </h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed">
              Take a guided tour through the entire lead creation process with visual highlights and explanations for every step.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto shrink-0">
            <Button
              onClick={handleStartTutorial}
              className="h-12 px-6 rounded-xl bg-white text-[#005864] hover:bg-slate-100 font-bold text-base shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Play className="size-4 fill-[#005864]" />
              Start Interactive Tutorial
            </Button>
            {completed && (
              <Button
                variant="outline"
                onClick={handleResetStatus}
                className="h-11 px-4 rounded-xl border-white/30 bg-white/10 text-white hover:bg-white/20 text-xs font-medium backdrop-blur-sm cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                Reset Status
              </Button>
            )}
          </div>
        </div>

        {/* Status Pill */}
        <div className="mt-6 pt-4 border-t border-white/15 flex items-center justify-between text-xs text-white/70">
          <span>Tutorial Status</span>
          <span className="flex items-center gap-1.5 font-semibold text-white">
            {completed ? (
              <>
                <CheckCircle2 className="size-4 text-emerald-400" />
                Completed
              </>
            ) : (
              <span className="text-yellow-300">● Not Watched Yet</span>
            )}
          </span>
        </div>
      </div>

      {/* 5-Step Process Breakdown */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#181818]">
          Walkthrough Steps Overview
        </h3>

        <div className="grid gap-3.5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {TUTORIAL_STEPS_OVERVIEW.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.step}
                type="button"
                onClick={() => router.push(item.href)}
                className="rounded-2xl border border-slate-100 bg-[#F9FAFA] p-5 transition-all hover:shadow-md hover:border-[#005864]/30 hover:bg-white flex flex-col justify-between text-left cursor-pointer group"
              >
                <div className="space-y-3 w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#005864]/10 text-[#005864] group-hover:bg-[#005864] group-hover:text-white transition-colors">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full bg-[#005864] px-2.5 py-0.5 text-xs font-bold text-white">
                      Step {item.step}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-base text-[#181818] group-hover:text-[#005864] transition-colors">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs text-[#18181899] leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/60 text-[11px] font-medium text-[#005864] flex items-center justify-between w-full">
                  <span>{item.highlight}</span>
                  <ArrowRight className="size-3 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
