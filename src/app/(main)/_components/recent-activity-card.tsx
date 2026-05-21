"use client";

import Image from "next/image";

interface RecentActivityCardProps {
  title: string;
  imageSrc?: string;
  imageClass?: string;
}

export function RecentActivityCard({
  title,
  imageSrc,
  imageClass,
}: RecentActivityCardProps) {
  return (
    <div className="overflow-hidden rounded-[12px] bg-white cursor-pointer hover:shadow-md transition-shadow duration-200">
      {/* Image */}
      <div className="px-3 pt-3">
        <p className="text-[16px] font-medium leading-[22px] capitalize text-[#1C1C1C] mb-2">
          {title}
        </p>
        {imageSrc ? (
          <div className="relative w-full h-[117px] rounded-[12px] overflow-hidden">
            <Image src={imageSrc} alt={title} fill className="object-cover" />
          </div>
        ) : (
          <div
            className={`w-full h-[117px] rounded-[12px] bg-[#D9D9D9] ${imageClass ?? ""}`}
          />
        )}
      </div>
      <div className="h-3" />
    </div>
  );
}
