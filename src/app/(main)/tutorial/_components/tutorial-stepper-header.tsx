"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, X, Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface TutorialStepperHeaderProps {
  currentStep: 1 | 2 | 3;
  title: string;
}

const STEPS = [
  { step: 1, label: "Job Details", href: "/tutorial/step-1" },
  { step: 2, label: "Select Experts", href: "/tutorial/step-2" },
  { step: 3, label: "Review & Submit", href: "/tutorial/step-3" },
];

export default function TutorialStepperHeader({
  currentStep,
  title,
}: TutorialStepperHeaderProps) {
  const router = useRouter();

  const handleExit = () => {
    router.push("/dashboard");
  };

  return (
    <div className="mb-8 space-y-4">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#005864] via-[#004750] to-[#002f35] p-4 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xs text-yellow-300 shadow-xs">
            <Sparkles className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                Interactive Tutorial Demo
              </span>
              <span className="text-xs text-white/70">Step {currentStep} of 3</span>
            </div>
            <p className="text-sm font-semibold text-white mt-0.5">
              {title}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExit}
          className="flex items-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-xs transition border border-white/20 cursor-pointer"
        >
          <X className="size-3.5" />
          Exit Tutorial
        </button>
      </div>

      {/* Stepper Progress Bar */}
      <div className="rounded-2xl bg-white p-4 shadow-xs border border-slate-100 flex items-center justify-between gap-2 overflow-x-auto">
        {STEPS.map((item, idx) => {
          const isDone = item.step < currentStep;
          const isActive = item.step === currentStep;

          return (
            <React.Fragment key={item.step}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-sm font-medium transition-all shrink-0",
                  isActive
                    ? "bg-[#005864] text-white shadow-sm"
                    : isDone
                    ? "bg-[#005864]/10 text-[#005864] hover:bg-[#005864]/15"
                    : "text-slate-400 hover:text-slate-600"
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                    isActive
                      ? "bg-white text-[#005864]"
                      : isDone
                      ? "bg-[#005864] text-white"
                      : "bg-slate-200 text-slate-600"
                  )}
                >
                  {isDone ? <Check className="size-3.5 stroke-[3]" /> : item.step}
                </span>
                <span>{item.label}</span>
              </Link>

              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 min-w-[20px] rounded-full",
                    item.step < currentStep ? "bg-[#005864]" : "bg-slate-200"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
