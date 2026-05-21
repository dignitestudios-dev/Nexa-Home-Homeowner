"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ServiceCardProps {
  serviceName: string;
  description: string;
  datePosted: string;
  date?: string;
  time?: string;
  status?: "Ongoing" | "Completed" | "Pending";
  showStatus?: boolean;
}

export function ServiceCard({
  serviceName,
  description,
  datePosted,
  status = "Ongoing",
  showStatus = false,
}: ServiceCardProps) {
  const id = showStatus ? "123" : "456"; // Example IDs for demonstration
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(`/service-details/${id}`)}
      className="w-[396px] min-h-[168px] rounded-[12px] bg-[#F8F8F8] p-4 flex flex-col justify-between"
    >
      {/* Top Content */}
      <div className="flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[18px] leading-[23px] font-semibold text-[#1C1C1C] truncate font-['Plus_Jakarta_Sans']">
            {serviceName}
          </h3>

          {showStatus && (
            <div className="h-[34px] min-w-[80px] rounded-full bg-[#3D74FF] px-[10px] flex items-center justify-center shrink-0">
              <span className="text-white text-[14px] leading-[22px] font-medium font-['Plus_Jakarta_Sans']">
                {status}
              </span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-[16px] leading-[22px] text-[rgba(24,24,24,0.8)] line-clamp-2 font-normal font-['Plus_Jakarta_Sans']">
          {description}
        </p>

        {/* Future Button Placement */}
        {/*
          Later you can easily add:
          
          <Button>
            Ready To Hire
          </Button>
        */}
      </div>

      {/* Bottom Strip */}
      <div
        className={`mt-5 rounded-[12px] bg-[rgba(0,88,100,0.06)] px-4 py-[19px] ${showStatus ? "flex" : "flex"} items-center justify-between`}
      >
        {!showStatus && (
          <Button className="text-[#005864] cursor-pointer hover:text-[#005864]/80">
            Ready To Hire
          </Button>
        )}
        {showStatus && (
          <span className="text-[12px] leading-3.75 font-medium text-[#1C1C1C] font-['Plus_Jakarta_Sans']">
            Date Posted
          </span>
        )}

        <span className="text-[16px] leading-5 font-bold text-[#1C1C1C] font-['Plus_Jakarta_Sans']">
          {datePosted}
        </span>
      </div>
    </div>
  );
}
