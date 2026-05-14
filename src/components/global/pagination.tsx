// components/Pagination.tsx

"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPrev,
  onNext,
}: PaginationProps) {
  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-end py-4">
      <div className="flex items-center space-x-4 bg-white rounded-full ">
        {/* Prev Button */}
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isPrevDisabled}
          className={`
            border-none
            ${isPrevDisabled ? "bg-[#00586417] rounded-full" : "text-white bg-[#005864] rounded-full"}
          `}
        >
          <ChevronLeft />
        </Button>

        {/* Page Number */}
        <span className="text-sm font-medium">
          {String(currentPage).padStart(2, "0")}
        </span>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={isNextDisabled}
          className={`
            border-none
            ${isNextDisabled ? "bg-[#00586417] rounded-full" : "text-white bg-[#005864] rounded-full"}
          `}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
