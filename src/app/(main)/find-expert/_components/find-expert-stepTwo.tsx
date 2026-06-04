"use client";

import { ArrowLeft, Check, Loader2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useGetMatchingProviders } from "@/features/user/hooks";
import { StepTwoData } from "../page";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

const sliderStyles = `
  input[type="range"].slider::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    width: 76px;
    height: 46px;
    background: #005864;
    border-radius: 10px;
    cursor: pointer;
    border: none;
    position: relative;
    z-index: 3;
  }
  
  input[type="range"].slider::-moz-range-thumb {
    width: 76px;
    height: 46px;
    background: #ffffff;
    border-radius: 10px;
    cursor: pointer;
    border: none;
  }

  .slider-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    height: 100px;
    justify-content: center;
  }

  .slider-label {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    background: #005864;
    color: white;
    padding: 5px 8px;
    border-radius: 10px;
    font-family: 'Plus Jakarta Sans';
    font-size: 14px;
    font-weight: 400;
    line-height: 18px;
    text-align: center;
    width: 76px;
    height: 46px;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
  }

  .slider-track {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
`;

interface StepTwoProps {
  data: StepTwoData;
  categoryId: string;
  addressId: string;
  onToggleProvider: (id: string, allProviderIds: string[]) => void;
  onToggleSendToAll: (allProviderIds: string[]) => void;
  onRadiusChange: (radius: number) => void;
  onProvidersLoaded: (providers: MatchingProvider[]) => void;
  onBack: () => void;
  onNext: () => void;
}

function ProviderAvatar({ name, profilePicture }: { name: string; profilePicture: MatchingProvider['profilePicture'] }) {
  if (profilePicture?.location) {
    return (
      <div className="w-[52px] h-[52px] rounded-full overflow-hidden shrink-0">
        <img src={profilePicture.location} alt={name} className="w-full h-full object-cover" />
      </div>
    );
  }
  return (
    <div className="w-[52px] h-[52px] rounded-full shrink-0 bg-[#005864]/10 flex items-center justify-center text-sm font-semibold text-[#005864]">
      {name?.slice(0, 2).toUpperCase()}
    </div>
  );
}

export default function FindExpertStepTwo({
  data,
  categoryId,
  addressId,
  onToggleProvider,
  onToggleSendToAll,
  onRadiusChange,
  onProvidersLoaded,
  onBack,
  onNext,
}: StepTwoProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [localRadius, setLocalRadius] = useState(data.radius);

  const { data: providersData, isLoading } = useGetMatchingProviders(
    { addressId, category: categoryId, radius: data.radius },
    !!addressId && !!categoryId
  );

  const providers = providersData?.data?.providers ?? [];
  const total = providersData?.data?.pagination?.total ?? 0;
  const allProviderIds = providers.map((p) => p._id);
  const allSelected = allProviderIds.length > 0 && allProviderIds.every((id) => data.selectedProviderIds.includes(id));

  useEffect(() => {
    if (providers.length > 0) onProvidersLoaded(providers);
  }, [providers.length]);

  const handleApplyRadius = () => {
    onRadiusChange(localRadius);
    setShowFilters(false);
  };

  return (
    <div>
      <style>{sliderStyles}</style>
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="flex items-center text-[#005864] hover:text-[#004750] transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[32px] font-semibold">Expert Matches</h1>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((v) => !v)}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#005864] text-white"
        >
          <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.41935 11.931C8.44173 11.9509 8.46287 11.9696 8.484 11.992C9.82555 13.3671 10.5653 15.1886 10.5653 17.1219V22.0754L13.3454 20.561C13.5642 20.4416 13.6998 20.2079 13.6998 19.9505V17.107C13.6998 15.1811 14.4321 13.3658 15.7612 11.9982L21.7752 5.60126C22.1643 5.18723 22.3782 4.6439 22.3782 4.07072V2.90697C22.3782 2.33006 21.9231 1.86133 21.3661 1.86133H2.87659C2.31834 1.86133 1.86328 2.33006 1.86328 2.90697V4.07072C1.86328 4.6439 2.07713 5.18723 2.4663 5.60002L8.41935 11.931ZM10.1282 24.2461C9.877 24.2461 9.62833 24.179 9.40205 24.0447C8.9644 23.7836 8.70205 23.3224 8.70205 22.8101V17.1256C8.70205 15.7144 8.17613 14.3853 7.21752 13.367C7.18892 13.3434 7.16033 13.3173 7.13546 13.2899L1.11029 6.88306C0.394135 6.12215 0 5.12376 0 4.07439V2.91063C0 1.30549 1.29182 0 2.8783 0H21.3678C22.9531 0 24.2449 1.30549 24.2449 2.91063V4.07439C24.2449 5.12251 23.8508 6.11966 23.1371 6.88182L17.1107 13.2899C16.1123 14.3194 15.5665 15.6734 15.5665 17.1107V19.9542C15.5665 20.8941 15.0579 21.7545 14.2398 22.2021L10.807 24.0721C10.5932 24.1877 10.3607 24.2461 10.1282 24.2461Z" fill="#FBFBFB"/>
</svg>

        </button>
      </div>

      <p className="text-[16px] text-[rgba(24,24,24,0.6)] leading-[20px] mt-1 px-8">
        {total} expert{total !== 1 ? "s" : ""} found within {data.radius} miles.
      </p>

      {/* Radius Filter Sheet */}
      <Sheet open={showFilters} onOpenChange={setShowFilters}>
        <SheetContent side="right" className="w-[490px] max-w-full bg-white rounded-[24px] p-0 border-0">
          {/* Header */}
          <div className="flex items-center justify-between pt-14 px-8 pb-8 border-b border-[#E5E5E5]">
            <h2 className="text-[32px] font-semibold text-[#1C1C1C]">Filters</h2>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Distance Section */}
            <div className="space-y-6">
              <h3 className="text-[20px] font-medium text-[#1C1C1C] capitalize">Distance</h3>

              {/* Slider Container */}
              <div className="space-y-6">
                {/* Slider */}
                <div className="pt-4 pb-8">
                  <div className="slider-wrapper w-full relative">
                    <div className="slider-label">
                      {localRadius} miles
                    </div>
                    <div className="slider-track w-full">
                      <input
                        type="range"
                        min={1}
                        max={75}
                        value={localRadius}
                        onChange={(e) => setLocalRadius(Number(e.target.value))}
                        className="w-full h-[6px] rounded-[13.5px] bg-[rgba(0,88,100,0.36)] accent-[#005864] slider"
                        style={{
                          appearance: "none",
                          WebkitAppearance: "none",
                        }}
                      />
                    </div>
                  </div>

                  {/* Min/Max Labels */}
                  <div className="flex justify-between mt-4">
                    <span className="text-[16px] font-medium text-[#1C1C1C]">01 Miles</span>
                    <span className="text-[16px] font-medium text-[#1C1C1C]">75 Miles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Apply Button */}
          <div className="px-8 pb-8 border-t border-[#E5E5E5] pt-6">
            <button
              type="button"
              onClick={handleApplyRadius}
              className="w-full h-12 rounded-[12px] bg-[#005864] hover:bg-[#004752] text-white text-base font-semibold transition-colors"
            >
              Apply
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Send to All */}
      <div className="flex items-center gap-3 mb-6 mt-6">
        <button
          onClick={() => onToggleSendToAll(allProviderIds)}
          className={`w-6 h-6 rounded-[4px] flex items-center justify-center border transition-colors ${
            data.sendToAll ? "bg-[#005864] border-[#005864]" : "bg-white border-gray-300"
          }`}
        >
          {data.sendToAll && <Check size={16} color="white" strokeWidth={2.5} />}
        </button>
        <span className="text-[18px] font-semibold text-[#005864]">Send To All Experts (Recommended)</span>
      </div>

      {/* Providers Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 min-h-70">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-full h-[100px] rounded-2xl border border-gray-200 px-3 py-4 flex items-start gap-3 bg-white">
              <Skeleton className="w-[52px] h-[52px] rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : providers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="font-medium text-[#181818]">No matching experts found.</p>
          <p className="mt-1 text-sm text-[rgba(24,24,24,0.5)]">Try increasing the search radius.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 min-h-70">
          {providers.map((provider) => {
            const isSelected = data.selectedProviderIds.includes(provider._id);
            return (
              <button
                key={provider._id}
                onClick={() => onToggleProvider(provider._id, allProviderIds)}
                className={`relative w-full h-[100px] rounded-2xl border text-left transition-all px-3 py-4 flex items-start gap-3 ${
                  isSelected
                    ? "bg-[rgba(0,88,100,0.1)] border-[#005864]"
                    : "bg-white border-gray-200 hover:border-[#005864]/40"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-[4px] bg-[#005864] flex items-center justify-center">
                    <Check size={12} color="white" strokeWidth={2.5} />
                  </div>
                )}
                <ProviderAvatar name={provider.name} profilePicture={provider.profilePicture} />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-[16px] font-semibold text-black leading-[20px] truncate pr-6">
                    {provider.name}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={11} className={i < Math.floor(provider.averageRating) ? "fill-[#EDAF35] text-[#EDAF35]" : "fill-[#E5E5E5] text-[#E5E5E5]"} />
                    ))}
                    <span className="text-[11px] font-medium text-[rgba(24,24,24,0.6)] ml-1">{provider.averageRating.toFixed(1)}</span>
                  </div>
                  {provider.area && (
                    <span className="text-[13px] text-[rgba(24,24,24,0.8)] leading-[18px] truncate">
                      {provider.area}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          disabled={(!data.sendToAll && data.selectedProviderIds.length === 0) || (data.sendToAll && providers.length === 0)}
          className="w-full sm:w-[230px] h-12 bg-[#005864] rounded-[12px] text-white text-[16px] font-semibold hover:bg-[#004750] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}
