import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardSkeleton() {
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
