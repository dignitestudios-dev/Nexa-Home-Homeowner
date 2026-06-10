"use client";

import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Star, Play } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useGetProviderDetail, useGetProviderReviews } from "@/features/user/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import ReviewCard from "./_components/review-card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Pagination } from "@/components/ui/pagination";

type Tab = "basic" | "portfolio" | "reviews";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.floor(rating) ? "fill-[#EDAF35] text-[#EDAF35]" : "text-[#E5E5E5]"}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-[#1C1C1C]">{rating.toFixed(1)}</span>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="relative w-full pt-10">
          <div className="absolute left-5 top-0 z-10">
            <Skeleton className="h-[122px] w-[122px] rounded-full" />
          </div>
          <div className="rounded-[34px] bg-[#E5E5E5] px-5 pb-5 pt-14 space-y-3">
            <div className="ml-[130px] space-y-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-4 w-full mt-8" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function ProviderProfile() {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>("basic");
  const [reviewPage, setReviewPage] = useState(1);

  const { data, isLoading } = useGetProviderDetail(id);
  const provider = data?.data;

  const { data: reviewsData, isLoading: isReviewsLoading } = useGetProviderReviews(id, reviewPage);
  const reviews = reviewsData?.data?.reviews ?? [];
  const reviewPagination = reviewsData?.data?.pagination;
  const totalReviewPages = reviewPagination?.totalPages ?? 1;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="size-6 animate-spin text-[#005864]" />
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[rgba(24,24,24,0.5)]">Provider not found.</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "basic", label: "Basic Info" },
    { id: "portfolio", label: "Portfolio" },
    { id: "reviews", label: "Reviews" },
  ];

  const isVideo = (url: string) => /\.(mp4|webm|ogg|mov)$/i.test(url);

  const openImage = (index: number) => setSelectedImageIndex(index);
  const closeImage = () => setSelectedImageIndex(null);
  const showPrevImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(selectedImageIndex === 0 ? provider.portfolioMedia.length - 1 : selectedImageIndex - 1);
  };
  const showNextImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex(selectedImageIndex === provider.portfolioMedia.length - 1 ? 0 : selectedImageIndex + 1);
  };

  return (
    <div className="max-w-[1200px] mx-auto py-2 px-4 lg:px-0">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#005864] hover:text-[#004750] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl lg:text-[32px] tracking-tight font-semibold">Expert Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-[#F9FAFA] rounded-[18px] p-5 lg:p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 lg:gap-6">
          {/* Avatar */}
          <div className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shrink-0 bg-[#E5E5E5]">
            {provider.profilePicture?.location ? (
              <Image src={provider.profilePicture.location} alt={provider.name} fill className="object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-3xl font-semibold text-[#005864]">
                {provider.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left min-w-0">
            <h2 className="text-xl lg:text-2xl font-bold text-[#181818] truncate">{provider.name}</h2>
            <div className="mt-2">
              <StarRating rating={provider.rating} />
            </div>
            <div className="mt-2 text-sm lg:text-base text-[#18181899]">
              {provider.defaultAddress.city} - {provider.defaultAddress.state}
            </div>
          </div>

          {/* Jobs count */}
          <div className="bg-white rounded-[12px] px-6 lg:px-8 py-4 lg:py-5 text-center shrink-0 w-full sm:w-auto">
            <p className="text-2xl lg:text-3xl font-bold text-[#005864]">{provider.jobCount}</p>
            <p className="text-xs lg:text-sm text-[rgba(24,24,24,0.6)] mt-1">Completed Jobs</p>
          </div>
        </div>
      </div>

      {/* Tabs — scrollable on mobile, inline on desktop */}
      <div className="mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="bg-[#F8F8F8] rounded-[12px] p-1 inline-flex gap-1 min-w-max lg:min-w-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-8 lg:px-16 py-2.5 rounded-[10px] text-sm font-semibold transition-colors whitespace-nowrap",
                activeTab === tab.id ? "bg-[#005864] text-white" : "text-[#005864] hover:bg-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="bg-[#F9FAFA] rounded-[18px] p-5 lg:p-8">

        {/* Basic Info */}
        {activeTab === "basic" && (
          <div className="space-y-6">
            {provider.overview && (
              <div>
                <h3 className="text-base font-semibold text-[#181818] mb-2">Overview</h3>
                <p className="text-sm lg:text-base text-[rgba(24,24,24,0.7)] break-words leading-relaxed">
                  {provider.overview}
                </p>
              </div>
            )}
            {provider.services.length > 0 && (
              <div>
                <h3 className="text-base font-semibold text-[#181818] mb-3">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {provider.services.map((service) => (
                    <span
                      key={service}
                      className="rounded-full bg-[#005864]/10 px-4 py-1.5 text-sm font-medium text-[#005864]"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <h3 className="text-base font-semibold text-[#181818] mb-1">Member Since</h3>
              <p className="text-sm lg:text-base text-[rgba(24,24,24,0.7)]">
                {new Date(provider.createdAt).toLocaleDateString("en-US", {
                  month: "long", day: "numeric", year: "numeric",
                })}
              </p>
            </div>
          </div>
        )}

        {/* Portfolio — 2 cols mobile, 4 cols desktop */}
        {activeTab === "portfolio" && (
          provider.portfolioMedia.length === 0 ? (
            <p className="text-center text-sm text-[rgba(24,24,24,0.5)] py-10">No portfolio media yet.</p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {provider.portfolioMedia.map((media, index) => (
                <button
                  key={media._id}
                  type="button"
                  onClick={() => openImage(index)}
                  className="w-full"
                >
                  <div className="relative aspect-square rounded-[12px] overflow-hidden bg-[#E5E5E5]">
                    {isVideo(media.location) ? (
                      <>
                        <video src={media.location} className="h-full w-full object-cover" muted />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <div className="flex h-10 w-10 lg:h-14 lg:w-14 items-center justify-center rounded-full bg-black/60">
                            <Play size={18} className="text-white fill-white" />
                          </div>
                        </div>
                      </>
                    ) : (
                      <Image
                        src={media.location}
                        alt={media.fileName}
                        fill
                        className="object-cover hover:scale-105 transition-transform duration-200"
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )
        )}

        {/* Reviews */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {isReviewsLoading ? (
              <ReviewsSkeleton />
            ) : reviews.length === 0 ? (
              <p className="text-sm text-[rgba(24,24,24,0.5)] text-center py-10">No reviews yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((r) => (
                  <ReviewCard
                    key={r._id}
                    name={r.reviewer.name}
                    date={new Date(r.createdAt).toLocaleDateString("en-US", {
                      month: "2-digit", day: "2-digit", year: "2-digit",
                    })}
                    review={r.description}
                    image={r.reviewer.profilePicture?.url || r.reviewer.profilePicture?.location}
                  />
                ))}
              </div>
            )}
            <Pagination
              page={reviewPage}
              totalPages={totalReviewPages}
              onPageChange={setReviewPage}
            />
          </div>
        )}
      </div>

      {/* Image / Video lightbox */}
      <Dialog open={selectedImageIndex !== null} onOpenChange={(open) => { if (!open) closeImage() }}>
        <DialogContent className="max-w-[800px]! w-full border-0 bg-black p-0 overflow-hidden">
          <DialogTitle className="sr-only">Portfolio Media</DialogTitle>
          {selectedImageIndex !== null && (
            <div className="relative flex items-center justify-center">
              <div className="relative flex h-[60vh] lg:h-[80vh] w-full items-center justify-center bg-black">
                {isVideo(provider.portfolioMedia[selectedImageIndex].location) ? (
                  <video
                    src={provider.portfolioMedia[selectedImageIndex].location}
                    controls
                    autoPlay
                    className="max-h-full max-w-full"
                  />
                ) : (
                  <Image
                    src={provider.portfolioMedia[selectedImageIndex].location}
                    alt={provider.portfolioMedia[selectedImageIndex].fileName}
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              {provider.portfolioMedia.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrevImage}
                    className="absolute left-2 lg:left-4 z-10 flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    className="absolute right-2 lg:right-4 z-10 flex h-10 w-10 lg:h-12 lg:w-12 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
                {selectedImageIndex + 1} / {provider.portfolioMedia.length}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}