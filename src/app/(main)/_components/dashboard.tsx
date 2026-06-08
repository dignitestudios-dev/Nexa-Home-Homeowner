"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import TopHeading from "./ui/top-heading";
import { useGetOwnUser, useGetCategories, useGetAddresses, useSetDefaultAddress, useGetJobsCount, useGetRecentActivityCategories } from "@/features/user/hooks";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CategoriesTab from "./categories-tab";
import OnGoingServicesTab from "./ongoing-services-tab";
import CustomSelect from "@/components/global/custom-select";
import { Skeleton } from "@/components/ui/skeleton";
import SearchInput from "./ui/search-input";

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
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab");

  const activeTab =
    tabs.find(
      (t) => t.toLowerCase() === tabParam?.toLowerCase()
    ) ?? "Home";

  const handleTabChange = (tab: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("tab", tab.toLowerCase());

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    });
  };
  const [emailPopupOpen, setEmailPopupOpen] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [search, setSearch] = useState("");
  const [jobsCountPopupOpen, setJobsCountPopupOpen] = useState(false);
  const { data: userData, isLoading: isUserLoading } = useGetOwnUser();
  const { data: addressData } = useGetAddresses();
  const { mutate: setDefaultAddress, isPending: isSettingDefault } = useSetDefaultAddress({
    onSuccess: () => {
      setIsLocationDialogOpen(false);
    },
  });

  // Fetch jobs count — enabled only once per session when user data is ready
  const hasShownJobsPopup = typeof window !== 'undefined' && sessionStorage.getItem('jobs-count-popup-shown') === 'true';
  const { data: jobsCountData } = useGetJobsCount(!isUserLoading && !!userData?.data && !hasShownJobsPopup);

  const addresses = addressData?.data?.addresses || [];
  const defaultAddress = addresses.find((addr) => addr.isDefault);
  const addressText = defaultAddress
    ? `${defaultAddress.label}, ${defaultAddress.zipCode}`
    : "Select Location";

  // Paginated Categories state & query
  const [categoryPage, setCategoryPage] = useState(1);
  const { data: categoryData, isLoading: isCategoriesLoading } = useGetCategories({
    page: categoryPage,
    limit: 15,
  });



  const { data: recentActivityData, isLoading: isRecentActivityLoading } = useGetRecentActivityCategories();
  const recentActivityCategories = recentActivityData?.data ?? [];

  const categoryDocs = categoryData?.data || [];
  const totalPages = categoryData?.pagination?.totalPages || 1;
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const carouselItems = recentActivityCategories;

  const scrollCarousel = (direction: number) => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: direction * 252, behavior: "smooth" });
  };

  const hasEmail = !!userData?.data?.contactEmail;

  const handleFindExpert = (path = "/find-expert") => {
    if (!hasEmail) {
      setEmailPopupOpen(true);
      return;
    }
    router.push(path);
  };

  useEffect(() => {
    if (isLocationDialogOpen && defaultAddress) {
      setSelectedAddressId(defaultAddress._id);
    }
  }, [isLocationDialogOpen, defaultAddress]);

  useEffect(() => {
    if (isUserLoading || !userData?.data) return;
    const hasShown = sessionStorage.getItem("email-popup-shown");
    console.log(userData.data.contactEmail, hasShown)
    if (userData.data.contactEmail === null && hasShown === "false") {
      setEmailPopupOpen(true);
      console.log("insode ------------>")
      sessionStorage.setItem("email-popup-shown", "true");
      console.log(emailPopupOpen)
    }
  }, [isUserLoading, userData]);

  // Show jobs-count popup once per login session
  useEffect(() => {
    if (!jobsCountData) return;
    const alreadyShown = sessionStorage.getItem('jobs-count-popup-shown') === 'true';
    if (!alreadyShown && jobsCountData.data?.count > 0) {
      setJobsCountPopupOpen(true);
      sessionStorage.setItem('jobs-count-popup-shown', 'true');
    } else if (!alreadyShown) {
      // count is 0 — still mark as shown so we don't refetch
      sessionStorage.setItem('jobs-count-popup-shown', 'true');
    }
  }, [jobsCountData, hasShownJobsPopup]);


  if (isUserLoading) {
    return (
      <div className="max-w-[1230px] mx-auto py-5 space-y-10 px-4 sm:px-6 lg:px-0">
        {/* Header Skeleton */}
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-10 w-64 rounded-md" />
            <Skeleton className="h-5 w-48 rounded-md" />
            <Skeleton className="h-6 w-32 mt-1 rounded-md" />
          </div>
          <Skeleton className="h-11 w-44 rounded-md" />
        </div>

        {/* Tabs Bar Skeleton */}
        <div className="space-y-8">
          <div className="w-full max-w-[510px] rounded-[12px] bg-[#F8F8F8] p-1">
            <div className="grid grid-cols-3 gap-2">
              <Skeleton className="h-[38px] rounded-lg" />
              <Skeleton className="h-[38px] rounded-lg" />
              <Skeleton className="h-[38px] rounded-lg" />
            </div>
          </div>
        </div>

        {/* Carousel/Recent Activity Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-72 rounded-md" />
          <div className="flex gap-4 overflow-hidden mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="min-w-[231px] w-[231px] rounded-[12px] bg-white border border-slate-200 overflow-hidden"
              >
                <Skeleton className="h-[117px] w-full rounded-t-[12px]" />
                <div className="px-4 py-4">
                  <Skeleton className="h-5 w-3/4 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Services Grid Skeleton */}
        <div className="space-y-6 mt-10">
          <Skeleton className="h-8 w-60 rounded-md" />
          <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-[12px] bg-white p-3 border border-slate-200"
              >
                <Skeleton className="h-[211px] w-full rounded-lg" />
                <div className="px-1 py-4">
                  <Skeleton className="h-5 w-2/3 rounded" />
                </div>
              </div>
            ))}
          </div>
          {/* Pagination Skeleton */}
          <div className="flex justify-end pt-2">
            <div className="flex items-center gap-1">
              <Skeleton className="h-12 w-12 rounded-full" />
              <Skeleton className="h-12 w-16" />
              <Skeleton className="h-12 w-12 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1230px] mx-auto py-5 space-y-10 px-4 sm:px-6 lg:px-0">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <TopHeading title={`Welcome ${userData?.data.name}`} />
          <p className="text-gray-400" >What do you need help with?</p>
          <button
            onClick={() => setIsLocationDialogOpen(true)}
            className="flex items-center gap-1.5 text-xl text-slate-600 mt-1 hover:text-[#005864] transition-colors focus:outline-none"
          >
            {addressText}
            <span className="text-[12px] mt-1 text-slate-600"><svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M1.94002 0C1.10235 0 0.404289 0.520661 0.125065 1.26446C-0.15416 2.00826 0.0552587 2.75207 0.543901 3.34711L5.50013 8.40496C5.84916 8.77686 6.3378 9 6.89625 9C7.38489 9 7.87354 8.85124 8.22257 8.47934L13.3882 3.42149C13.9467 2.90083 14.1561 2.08264 13.8769 1.33884C13.5278 0.520661 12.8298 0 11.9921 0H1.94002Z" fill="#181818" fill-opacity="0.8" />
            </svg>
            </span>
          </button>
        </div>
        <div className="flex items-center gap-4">

          {(activeTab == "Ongoing" || activeTab == "Completed") && <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search"
          />}
          <Button onClick={() => handleFindExpert()} className="flex items-center cursor-pointer gap-2 px-5" variant="primary">
            <Search size={18} />
            Find an Expert
          </Button>
        </div>
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
                  onClick={() => handleTabChange(tab)}
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
            onCategoryClick={handleFindExpert}
          />
        )

      }
      {activeTab === 'Ongoing' && <OnGoingServicesTab tab="ongoing" search={search} />}
      {activeTab === 'Completed' && <OnGoingServicesTab tab="completed" search={search} />}
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

      {/* Jobs Awaiting Completion Popup */}
      <Dialog open={jobsCountPopupOpen} onOpenChange={setJobsCountPopupOpen}>
        <DialogContent className="p-0 border-none shadow-xl rounded-[24px] bg-white w-[515px] max-w-[515px]! overflow-hidden">
          {/* Icon circle */}
          <div className="flex flex-col items-center px-[43px] pt-[34px] pb-[32px]">
            <div
              className="flex items-center justify-center rounded-full"
              style={{ width: 80, height: 80, background: 'rgba(0, 88, 100, 0.06)' }}
            >
              {/* Tick icon */}
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 21L16 29L32 13"
                  stroke="#005864"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Text block */}
            <div className="flex flex-col items-center gap-4 mt-[22px] w-full">
              <DialogTitle
                className="text-center font-semibold text-[#181818] capitalize leading-[40px] tracking-[-0.008em]"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 32, lineHeight: '40px' }}
              >
                Mark Your Jobs As Completed
              </DialogTitle>

              <DialogDescription
                className="text-center text-[#676767] font-normal"
                style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 18, lineHeight: '160.5%' }}
              >
                You have {String(jobsCountData?.data?.count ?? 0).padStart(2, '0')} job{(jobsCountData?.data?.count ?? 0) !== 1 ? 's' : ''} waiting to be marked as complete.
              </DialogDescription>

              {/* Buttons */}
              <div className="flex flex-row gap-4 w-full mt-2">
                {/* Later */}
                <button
                  type="button"
                  onClick={() => setJobsCountPopupOpen(false)}
                  className="flex-1 h-[55px] flex items-center justify-center rounded-[8px] font-semibold text-[13px] text-[#005864] transition-colors hover:opacity-80"
                  style={{ background: 'rgba(0, 88, 100, 0.06)', fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: '16px' }}
                >
                  Later
                </button>

                {/* View Jobs */}
                <button
                  type="button"
                  onClick={() => {
                    setJobsCountPopupOpen(false);
                    handleTabChange('Ongoing');
                  }}
                  className="flex-1 h-[55px] flex items-center justify-center rounded-[8px] font-semibold text-[13px] text-white bg-[#005864] hover:bg-[#004d57] transition-colors"
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: '16px' }}
                >
                  View Jobs
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="relative w-full max-w-131.25! fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%] h-[50%] overflow-y-auto rounded-xl bg-[#F8F8F8] p-6 sm:p-8">
          <button
            type="button"
            onClick={() => setIsLocationDialogOpen(false)}
            className="absolute right-[24px] top-[24px] w-10 h-10 inline-flex items-center justify-center rounded-full text-[#181818] hover:bg-black/5 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} className="stroke-[1.8]" />
          </button>

          <div>
            <DialogTitle className="text-[24px] font-semibold leading-[30px] text-center text-black capitalize">
              Select Address
            </DialogTitle>
          </div>

          <div className="flex-1 flex flex-col justify-center mt-4">
            <label className="text-base font-medium leading-[22px] text-black mb-2">
              Select Location
            </label>
            {addresses.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4 bg-[#F8F8F8] rounded-[12px]">
                No addresses found. Please add an address in profile settings.
              </p>
            ) : (
              <CustomSelect
                value={selectedAddressId}
                onChange={setSelectedAddressId}
                options={addresses.map((addr) => ({
                  label: `${addr.label}: ${addr.address}, ${addr.city}`,
                  value: addr._id,
                }))}
                placeholder="Select Location"
              />
            )}
          </div>

          <Button
            type="button"
            disabled={isSettingDefault || !selectedAddressId || selectedAddressId === defaultAddress?._id}
            onClick={() => {
              if (selectedAddressId) {
                setDefaultAddress({ id: selectedAddressId });
              }
            }}
            className="w-full h-12 bg-[#005864] hover:bg-[#004d57] text-white text-[16px] font-semibold rounded-[12px] transition-colors mt-6"
          >
            {isSettingDefault ? "Saving..." : "Save"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
