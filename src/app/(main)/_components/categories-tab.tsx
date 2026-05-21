"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/features/user/hooks";

type RecentActivity = {
  title: string;
  imageClass: string;
};

type CarouselItem = Category | RecentActivity;

type Props = {
  carouselItems: CarouselItem[];
  isCategoriesLoading: boolean;
  categoryDocs: Category[];

  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  scrollCarousel: (direction: number) => void;

  categoryPage: number;
  setCategoryPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
};

const CategoriesTab = ({
  carouselItems,
  isCategoriesLoading,
  categoryDocs,
  scrollContainerRef,
  scrollCarousel,
  categoryPage,
  setCategoryPage,
  totalPages,
}: Props) => {
  return (
    <>
      {/* Recent Activity Carousel */}
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-950">
            Based on your recent activity
          </h2>
        </div>

        <div className="relative mt-4">
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-2 pr-2 scroll-smooth scrollbar-hide snap-x snap-mandatory"
          >
            {carouselItems.map((item) => {
              const title =
                "name" in item ? item.name : item.title;

              const imageSrc =
                "icon" in item
                  ? item.icon?.location
                  : undefined;

              return (
                <div
                  key={title}
                  className="min-w-[231px] snap-start overflow-hidden rounded-[12px] bg-white shadow-sm border border-slate-200"
                >
                  <div className="h-[117px] rounded-t-[12px] overflow-hidden bg-slate-100">
                    {imageSrc ? (
                      <img
                        src={imageSrc}
                        alt={title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-slate-200 flex items-center justify-center">
                        <span className="text-sm text-slate-400">
                          No Image
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-4">
                    <p className="text-base font-medium text-slate-900">
                      {title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollCarousel(-1)}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ChevronLeft size={18} />
          </button>

          <button
            type="button"
            onClick={() => scrollCarousel(1)}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="space-y-6 mt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-semibold text-slate-950">
            Categories
          </h2>
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

        {/* Pagination */}
        <div className="flex justify-end pt-2">
          <div className="flex items-center ">
            <button
              type="button"
              disabled={categoryPage === 1}
              onClick={() =>
                setCategoryPage((prev) =>
                  Math.max(prev - 1, 1)
                )
              }
              className={cn(
                "inline-flex h-12 w-12 z-20 items-center justify-center rounded-full transition-colors",
                categoryPage === 1
                  ? "bg-[#0058640F] text-[#005864]/40 cursor-not-allowed"
                  : "bg-[#005864] text-white hover:bg-[#004d57]"
              )}
            >
              <ChevronLeft size={30} strokeWidth={2.5} />
            </button>

            <div className="inline-flex h-12 items-center justify-center  bg-[#F9FAFA] px-6 text-base -mx-4 font-bold text-[#181818] border border-slate-100 min-w-[54px]">
              {categoryPage.toString().padStart(2, "0")}
            </div>

            <button
              type="button"
              disabled={categoryPage >= totalPages}
              onClick={() =>
                setCategoryPage((prev) =>
                  Math.min(prev + 1, totalPages)
                )
              }
              className={cn(
                "inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                categoryPage >= totalPages
                  ? "bg-[#005864]/5 text-[#005864]/40 cursor-not-allowed"
                  : "bg-[#005864] text-white hover:bg-[#004d57]"
              )}
            >
              <ChevronRight size={30} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesTab;