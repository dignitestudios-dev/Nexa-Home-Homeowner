"use client";

import React, { useState } from "react";
import { Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import TopHeading from "../../_components/ui/top-heading";
import { Button } from "@/components/ui/button";
import { DEMO_ONGOING_JOBS, DEMO_COMPLETED_JOBS, DemoJobItem } from "./demo-data";

interface DemoDashboardViewProps {
  activeTab: "Ongoing" | "Completed";
  onTabChange: (tab: "Ongoing" | "Completed") => void;
}

const tagStyles: Record<string, string> = {
  Ongoing: "bg-[#3D74FF] text-white",
  Completed: "bg-emerald-500 text-white",
  "Confirm Expert": "bg-[#FF0000] text-white",
  "Awaiting Response": "bg-[#FFF300] text-black",
};

function DemoJobCard({ job }: { job: DemoJobItem }) {
  const isGreenBorder =
    job.actionText.toLowerCase() === "confirm expert" ||
    job.actionText.toLowerCase() === "awaiting response";

  return (
    <div
      className={cn(
        "relative w-full lg:w-[396px] h-[168px] rounded-[12px] bg-[#fffbfb] p-4 transition-all shadow-xs select-none",
        isGreenBorder ? "border-2 border-[#005864]" : "border-2 border-transparent"
      )}
    >
      {/* Badge */}
      <div
        className={cn(
          "absolute right-3 top-3 flex h-[34px] min-w-[80px] items-center justify-center rounded-full px-[10px] py-[6px]",
          tagStyles[job.actionText] ?? tagStyles[job.status] ?? "bg-[#3D74FF]"
        )}
      >
        <span className="text-[14px] font-bold leading-[22px]">
          {job.actionText}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[18px] line-clamp-1 w-[60%] break-all truncate font-semibold leading-[23px] text-[#1C1C1C]">
        {job.serviceName}
      </h3>

      {/* Description */}
      <p className="mt-3 line-clamp-2 text-[16px] break-all leading-[22px] text-[rgba(24,24,24,0.8)]">
        {job.description}
      </p>

      {/* Bottom section */}
      <div className="absolute bottom-[10px] left-1/2 flex h-[58px] w-full lg:w-[360px] -translate-x-1/2 items-center rounded-[12px] bg-[rgba(0,88,100,0.06)]">
        <div className="px-6">
          <p className="text-[12px] text-[#1C1C1C]">Date Posted</p>
          <p className="text-[16px] font-bold text-[#1C1C1C]">{job.postedDate}</p>
        </div>

        <div className="h-9 w-px rounded bg-[rgba(194,194,194,0.25)]" />

        <div className="flex flex-1 justify-center">
          <span className="text-[16px] font-bold text-[#005864]">{job.when}</span>
        </div>
      </div>
    </div>
  );
}

export default function DemoDashboardView({
  activeTab,
  onTabChange,
}: DemoDashboardViewProps) {
  const tabs: ("Ongoing" | "Completed")[] = ["Ongoing", "Completed"];

  return (
    <div className="max-w-[1230px] mx-auto py-2 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <TopHeading title="Welcome Demo Homeowner" />
          <p className="text-gray-400">What do you need help with?</p>
          <div className="flex items-center gap-1.5 text-xl text-slate-600 mt-1">
            <span>Primary Residence, 90210</span>
            <ChevronDown size={14} className="mt-1 text-slate-600" />
          </div>
        </div>

        <div className="flex lg:flex-row flex-col-reverse items-center gap-4">
          <div className="relative w-full lg:w-[320px]">
            <input
              type="text"
              readOnly
              value=""
              placeholder="Search services..."
              className="w-full h-11 pl-10 pr-4 rounded-[12px] bg-[#F8F8F8] border border-slate-200 text-sm focus:outline-none"
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
          </div>

          <Button
            type="button"
            className="flex items-center cursor-pointer w-full lg:w-[172px] gap-2 px-5 bg-[#005864] hover:bg-[#004752] text-white"
          >
            <Search size={18} />
            Find an Expert
          </Button>
        </div>
      </div>

      {/* Tabs Navigation Bar */}
      <div id="tutorial-dashboard-tabs" className="space-y-6">
        <div className="w-full max-w-[510px] rounded-[12px] bg-[#F8F8F8] p-1">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tab) => {
              const active = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => onTabChange(tab)}
                  className={cn(
                    "min-h-[38px] rounded-lg text-sm font-medium transition-colors focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer",
                    active
                      ? "bg-[#005864] text-white shadow-sm"
                      : "bg-white text-[#005864] hover:bg-slate-100"
                  )}
                >
                  <span>{tab}</span>
                  {tab === "Ongoing" && (
                    <span className="inline-flex items-center justify-center text-xs font-semibold px-1.5 min-w-[20px] h-5 rounded-full bg-[#FF0000] text-white">
                      3
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Ongoing Tab Content */}
      {activeTab === "Ongoing" && (
        <div
          id="tutorial-ongoing-tab-section"
          className="space-y-6 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#181818]">
                Ongoing Requests (3 Active Leads)
              </h3>
              <p className="text-sm text-slate-500">
                These requests are currently out for quotes with 3 verified responses waiting for your confirmation.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {DEMO_ONGOING_JOBS.map((job) => (
              <DemoJobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tab Content */}
      {activeTab === "Completed" && (
        <div
          id="tutorial-completed-tab-section"
          className="space-y-6 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-[#181818]">
                Completed Jobs History
              </h3>
              <p className="text-sm text-slate-500">
                View your finished home projects, verified receipts, and past contractor details.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {DEMO_COMPLETED_JOBS.map((job) => (
              <DemoJobCard key={job._id} job={job} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
