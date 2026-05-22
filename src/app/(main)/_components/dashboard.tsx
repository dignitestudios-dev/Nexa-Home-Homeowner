"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Search, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import TopHeading from "./ui/top-heading";
import { useGetOwnUser, useGetCategories, useGetAddresses, useSetDefaultAddress } from "@/features/user/hooks";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import CategoriesTab from "./categories-tab";
import OnGoingServicesTab from "./ongoing-services-tab";
import CustomSelect from "@/components/global/custom-select";

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
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState("");

  const { data: userData, isLoading: isUserLoading } = useGetOwnUser();
  const { data: addressData } = useGetAddresses();
  const { mutate: setDefaultAddress, isPending: isSettingDefault } = useSetDefaultAddress({
    onSuccess: () => {
      setIsLocationDialogOpen(false);
    },
  });

  const addresses = addressData?.data?.addresses || [];
  const defaultAddress = addresses.find((addr) => addr.isDefault);
  const addressText = defaultAddress
    ? `${defaultAddress.address}, ${defaultAddress.city}`
    : "Select Location";

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
      userData.data.contactEmail == null
    ) {
      const shown = sessionStorage.getItem("email_popup_shown");
      if (!shown) {
        setEmailPopupOpen(true);
        sessionStorage.setItem("email_popup_shown", "true");
      }
    }
  }, [isUserLoading, userData]);

  useEffect(() => {
    if (isLocationDialogOpen && defaultAddress) {
      setSelectedAddressId(defaultAddress._id);
    }
  }, [isLocationDialogOpen, defaultAddress]);

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

      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="w-[462px] max-w-[calc(100%-2rem)] h-[378px] rounded-[24px] bg-white px-[30px] pt-[34px] pb-[40px] relative flex flex-col justify-between select-none outline-none border-none">
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
                  label: `${addr.label}: ${addr.address}, ${addr.city}, ${addr.country}`,
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
