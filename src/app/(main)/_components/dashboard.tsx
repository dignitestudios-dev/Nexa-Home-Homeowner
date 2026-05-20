"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import TopHeading from "./ui/top-heading";
import { useGetOwnUser, useGetCategories } from "@/features/user/hooks";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

type Props = {};

const tabs = ["Home", "Ongoing", "Completed"];

const recentActivities = [
  {
    title: "Landscaping",
    imageClass:
      "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-200 via-slate-100 to-slate-200",
  },
  {
    title: "Pool Cleaning",
    imageClass:
      "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-cyan-200 via-sky-100 to-slate-200",
  },
  {
    title: "Fence Installation",
    imageClass:
      "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-200 via-orange-100 to-slate-200",
  },
  {
    title: "Pest Control",
    imageClass:
      "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-emerald-200 via-emerald-100 to-slate-200",
  },
  {
    title: "Gutter Cleaning",
    imageClass:
      "bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-slate-300 via-slate-100 to-slate-200",
  },
];

const Dashboard = (props: Props) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [emailPopupOpen, setEmailPopupOpen] = useState(false);
  const { data: userData, isLoading: isUserLoading } = useGetOwnUser();

  // Paginated Categories state & query
  const [categoryPage, setCategoryPage] = useState(1);
  const { data: categoryData, isLoading: isCategoriesLoading } = useGetCategories({
    page: categoryPage,
    limit: 15,
  });

  const categoryDocs = categoryData?.data || [];
  const totalPages = categoryData?.pagination?.totalPages || 1;

  useEffect(() => {
    if (
      !isUserLoading &&
      userData?.data &&
      userData.data.isEmailVerified === false
    ) {
      const shown = sessionStorage.getItem("email_popup_shown");
      if (!shown) {
        setEmailPopupOpen(true);
        sessionStorage.setItem("email_popup_shown", "true");
      }
    }
  }, [isUserLoading, userData]);

  if (isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-[1230px] mx-auto py-5 space-y-10 px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <TopHeading title={`Welcome ${userData?.data.name}`} />
          <p className="text-xl text-slate-600 mt-1">Toronto, Canada</p>
        </div>
        <Button className="flex items-center gap-2 px-5" variant="primary">
          <Search size={18} />
          Find an Expert
        </Button>
      </div>

      <div className="space-y-8">
        <div className="w-full max-w-[510px] rounded-[12px] bg-[#F8F8F8] p-1">
          <div className="grid grid-cols-3 gap-1">
            {tabs.map((tab) => {
              const active = tab === activeTab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "min-h-[38px] rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#005864]/20",
                    active
                      ? "bg-[#005864] text-white shadow-sm"
                      : "bg-white text-[#005864] hover:bg-slate-100",
                  )}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-950">
            Based on your recent activity
          </h2>
          <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2">
            {recentActivities.map((activity) => (
              <div
                key={activity.title}
                className="overflow-hidden rounded-[12px] bg-white shadow-sm border border-slate-200"
              >
                <div
                  className={cn(
                    "h-[117px] rounded-t-[12px] p-4",
                    activity.imageClass,
                  )}
                />
                <div className="px-4 py-4">
                  <p className="text-base font-medium text-slate-900">
                    {activity.title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-slate-950">Categories</h2>
        </div>

        {isCategoriesLoading ? (
          <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2 animate-pulse">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[12px] bg-white p-3 shadow-sm border border-slate-200"
              >
                <div className="h-[211px] rounded-lg bg-slate-200" />
                <div className="px-1 py-4 space-y-2">
                  <div className="h-5 w-2/3 bg-slate-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2">
            {categoryDocs.map((category) => (
              <div
                key={category._id}
                className="overflow-hidden rounded-[12px] bg-white p-3 shadow-sm border border-slate-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="h-[211px] rounded-lg bg-slate-100 overflow-hidden relative border border-slate-100">
                  {category.icon?.location ? (
                    <img
                      src={category.icon.location}
                      alt={category.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400 font-medium">
                      No Image
                    </div>
                  )}
                </div>
                <div className="px-1 py-4">
                  <p className="text-base font-semibold text-[#1C1C1C] truncate">
                    {category.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Circular & Pill Pagination UI matching Figma perfectly and floating below the grid */}
        <div className="flex justify-end pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={categoryPage === 1}
              onClick={() => setCategoryPage((prev) => Math.max(prev - 1, 1))}
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                categoryPage === 1
                  ? "bg-[#005864]/5 text-[#005864]/40 cursor-not-allowed"
                  : "bg-[rgba(0,88,100,0.06)] text-[#005864] hover:bg-[rgba(0,88,100,0.12)]"
              )}
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>
            
            <div className="inline-flex h-12 items-center justify-center rounded-full bg-[#F9FAFA] px-6 text-base font-semibold text-[#181818] border border-slate-100 min-w-[54px]">
              {categoryPage.toString().padStart(2, "0")}
            </div>
            
            <button
              type="button"
              disabled={categoryPage >= totalPages}
              onClick={() => setCategoryPage((prev) => Math.min(prev + 1, totalPages))}
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                categoryPage >= totalPages
                  ? "bg-[#005864]/5 text-[#005864]/40 cursor-not-allowed"
                  : "bg-[#005864] text-white hover:bg-[#004d57]"
              )}
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={emailPopupOpen} onOpenChange={setEmailPopupOpen}>
        <DialogContent className="sm:max-w-[400px] border-none p-6 rounded-[24px] bg-white flex flex-col items-center select-none outline-none">
          {/* Circular green/teal background check icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#005864] text-white mt-4 shadow-sm">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>

          <DialogTitle className="text-[24px] font-bold text-[#181818] text-center mt-6 tracking-tight">
            Add Email
          </DialogTitle>
          
          <DialogDescription className="text-[15px] leading-6 text-center text-[rgba(24,24,24,0.6)] mt-2 mb-8 max-w-[280px]">
            Please add your email to secure your account and receive updates.
          </DialogDescription>

          <Button
            type="button"
            onClick={() => {
              setEmailPopupOpen(false);
              router.push("/settings/email");
            }}
            className="w-full h-12 bg-[#005864] hover:bg-[#004d57] text-white text-[16px] font-semibold rounded-[12px] transition-colors"
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
