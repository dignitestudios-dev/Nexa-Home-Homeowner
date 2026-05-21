"use client";

import { useState } from "react";
import { ArrowLeft, Search, SlidersHorizontal, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { ExpertFilters } from "./expert-filters";
import { Expert, StepTwoData } from "../page";

interface StepTwoProps {
  data: StepTwoData;
  allExperts: Expert[];
  onToggleExpert: (id: number) => void;
  onToggleSendToAll: () => void;
  onBack: () => void;
  onNext: () => void;
}

const experts = [
  {
    id: 1,
    name: "Landscape Workshop",
    rating: 4.5,
    location: "Greater New-Orleans Area",
    avatar: "/avatars/landscape-workshop.png",
    initials: "LW",
    avatarBg: "#e8f5e9",
  },
  {
    id: 2,
    name: "Boot Krewe Cleaner",
    rating: 4.5,
    location: "Greater New-Orleans Area",
    avatar: null,
    initials: "BK",
    avatarBg: "#fff3e0",
  },
  {
    id: 3,
    name: "Makaira Landscape Pools",
    rating: 4.5,
    location: "Baton Rouge",
    avatar: null,
    initials: "ML",
    avatarBg: "#e3f2fd",
  },
  {
    id: 4,
    name: "Supreme Fencing LLC",
    rating: 4.5,
    location: "Greater New-Orleans Area",
    avatar: null,
    initials: "SF",
    avatarBg: "#212121",
  },
  {
    id: 5,
    name: "Boot Krewe Cleaner",
    rating: 4.5,
    location: "Greater New-Orleans Area",
    avatar: null,
    initials: "BK",
    avatarBg: "#fff3e0",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill={star <= Math.floor(rating) ? "#EDAF35" : "none"}
          stroke="#EDAF35"
          strokeWidth="1"
        >
          <polygon points="6,1 7.5,4.5 11,4.5 8.5,7 9.5,10.5 6,8.5 2.5,10.5 3.5,7 1,4.5 4.5,4.5" />
        </svg>
      ))}
      <span className="text-[12px] font-medium text-[#1C1C1C] ml-1">
        {rating}
      </span>
    </div>
  );
}

function ExpertAvatar({ expert }: { expert: (typeof experts)[0] }) {
  const isDark = expert.avatarBg === "#212121";
  return (
    <div
      className="w-[52px] h-[52px] rounded-full flex items-center justify-center flex-shrink-0 text-sm font-semibold"
      style={{
        backgroundColor: expert.avatarBg,
        color: isDark ? "#ffffff" : "#333333",
      }}
    >
      {expert.initials}
    </div>
  );
}

function CheckboxIcon({ checked }: { checked: boolean }) {
  if (!checked) return null;
  return (
    <div className="absolute top-2 right-2 w-5 h-5 rounded-[4px] bg-[#005864] flex items-center justify-center">
      <Check size={12} color="white" strokeWidth={2.5} />
    </div>
  );
}

export default function ExpertMatchesForm({
  data,
  allExperts,
  onToggleExpert,
  onToggleSendToAll,
  onBack,
  onNext,
}: StepTwoProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="flex items-center text-[#005864] hover:text-[#004750] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <h1 className="text-[32px] font-semibold">Expert Matches</h1>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
          <div className="relative w-full sm:max-w-[417px]">
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-4 pr-12 rounded-3xl bg-[#F9FAFA] text-[14px] text-[#5C5C5C] placeholder:text-[#5C5C5C] outline-none border-none"
            />
            <Search
              size={20}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[rgba(24,24,24,0.8)]"
            />
          </div>
          <div className="sm:ml-2">
            <ExpertFilters />
          </div>
        </div>
      </div>
      <div className="px-8">
        <p className="text-[16px] text-[rgba(24,24,24,0.6)] leading-[20px] mt-1">
          Send to multiple Experts for faster replies.
        </p>
      </div>
      {/* Send to All Experts */}
      <div className="flex items-center gap-3 mb-6 mt-8">
        <button
          onClick={onToggleSendToAll}
          className={`w-6 h-6 rounded-[4px] flex items-center justify-center border transition-colors ${
            data.sendToAll
              ? "bg-[#005864] border-[#005864]"
              : "bg-white border-gray-300"
          }`}
        >
          {data.sendToAll && (
            <Check size={16} color="white" strokeWidth={2.5} />
          )}
        </button>
        <span className="text-[18px] font-semibold text-[#005864] capitalize">
          Send To All Experts (Recommended)
        </span>
      </div>

      {/* Expert Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 min-h-70">
        {allExperts.map((expert) => {
          const isSelected = data.selectedExpertIds.includes(expert.id);
          return (
            <button
              key={expert.id}
              onClick={() => onToggleExpert(expert.id)}
              className={`relative w-full h-[116px] rounded-2xl border text-left transition-all px-3 py-4 flex items-start gap-3 ${
                isSelected
                  ? "bg-[rgba(0,88,100,0.1)] border-[#005864]"
                  : "bg-white border-gray-200 hover:border-[#005864]/40"
              }`}
            >
              <CheckboxIcon checked={isSelected} />
              <ExpertAvatar expert={expert} />
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[16px] font-semibold text-black leading-[20px] truncate pr-6">
                  {expert.name}
                </span>
                <StarRating rating={expert.rating} />
                <span className="text-[14px] text-[rgba(24,24,24,0.8)] leading-[18px] truncate">
                  {expert.location}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          className="w-full sm:w-[230px] h-12 bg-[#005864] rounded-[12px] text-white text-[16px] font-semibold capitalize hover:bg-[#004750] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
