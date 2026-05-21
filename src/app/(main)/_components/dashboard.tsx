"use client";

import { useState, useEffect, useRef } from "react";
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
import CategoriesTab from "./categories-tab";
import OnGoingServicesTab from "./ongoing-services-tab";

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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const recentCategoryDocs = categoryDocs.slice(0, 5);
  const carouselItems = !isCategoriesLoading && recentCategoryDocs.length ? recentCategoryDocs : recentActivities;

  const scrollCarousel = (direction: number) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: direction * 252, behavior: "smooth" });
  };

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
        <Button onClick={() => router.push("/find-expert")} className="flex items-center cursor-pointer gap-2 px-5" variant="primary">
          <Search size={18} />
          Find an Expert
        </Button>
      </div>

      <div className="space-y-8">
        <div className="w-full max-w-[510px] rounded-[12px] bg-[#F8F8F8] p-1">
          <div className="grid grid-cols-3 ">
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
      </div>
 {activeTab == "Home" &&
 (
<CategoriesTab
  carouselItems={carouselItems}
  isCategoriesLoading={isCategoriesLoading}
  categoryDocs={categoryDocs}
  scrollContainerRef={scrollContainerRef}
  scrollCarousel={scrollCarousel}
  categoryPage={categoryPage}
  setCategoryPage={setCategoryPage}
  totalPages={totalPages}
/>
 )
 
 }
 {activeTab == "Ongoing" &&
 (
<OnGoingServicesTab
  carouselItems={carouselItems}
  isCategoriesLoading={isCategoriesLoading}
  categoryDocs={categoryDocs}
  scrollContainerRef={scrollContainerRef}
  scrollCarousel={scrollCarousel}
  categoryPage={categoryPage}
  setCategoryPage={setCategoryPage}
  totalPages={totalPages}
/>
 )
 
 }
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
