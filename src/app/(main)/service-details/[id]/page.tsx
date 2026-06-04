"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useGetJobDetail, useCompleteJob, useSubmitReview } from "@/features/user/hooks";
import { ExpertCard } from "./_components/expert-card";
import { ExperienceDialog } from "./_components/experience-dialog";
import SuccessDialog from "@/components/ui/success-dialog";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center capitalize justify-between gap-4">
      <p className="text-base font-normal text-[rgba(24,24,24,0.6)]">{label}</p>
      <p className="text-base font-medium text-[#005864]">{value}</p>
    </div>
  );
}

const ServiceDetails = () => {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  const { data, isLoading } = useGetJobDetail(id);
  const job = data?.data?.job;
  const appliedProviders = data?.data?.appliedProviders ?? [];
  const provider = job?.provider;

  const handleProviderClick = () => {
    if (!provider) return;
    const qs = new URLSearchParams({
      name: provider.name,
      ...(provider.profilePicture ? { picture: provider.profilePicture.location } : {}),
    });
    router.push(`/provider/${provider._id}?${qs.toString()}`);
  };

  const { mutate: completeJob, isPending: isCompleting } = useCompleteJob({
    onSuccess: (res) => {
      if (res.success) {
        setConfirmOpen(false);
        setSuccessOpen(true);
      }
    },
  });

  const { mutate: submitReview, isPending: isReviewPending } = useSubmitReview({
    onSuccess: () => {
      setReviewOpen(false);
      router.push("/dashboard");
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-[1200px] mx-auto rounded-[24px] py-2">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="flex items-center text-[#005864] hover:text-[#004750] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-[32px] tracking-tight font-semibold">Service Details</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_487px] gap-6">
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            <div className="bg-[#F9FAFA] rounded-[18px] p-6 lg:p-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-2/3" />
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </div>
            </div>

            <div className="bg-[#F9FAFA] rounded-[12px] p-6">
              <div className="space-y-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F9FAFA] rounded-[12px] p-6">
              <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-1/6" />
                  <div className="flex items-start gap-1.5 w-full">
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <Skeleton className="h-[42px] w-[120px] rounded-md" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="bg-[#F9FAFA] rounded-[18px] p-6 h-fit sticky top-6">
            <div className="mb-6 space-y-3">
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="bg-white rounded-[12px] p-5 flex items-start gap-4">
                  <Skeleton className="w-16 h-16 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-[rgba(24,24,24,0.5)]">Job not found.</p>
      </div>
    );
  }

  const postedDate = new Date(job.createdAt).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });

  const scheduledDate = new Date(job.date).toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "2-digit",
  });

  const mapUrl = `https://www.google.com/maps?q=${job.addressDetails.coordinates.coordinates[1]},${job.addressDetails.coordinates.coordinates[0]}`;

  return (
    <div className="max-w-[1200px] mx-auto rounded-[24px] py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#005864] hover:text-[#004750] transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[32px] tracking-tight font-semibold">Service Details</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_487px] gap-6">
        {/* LEFT CONTENT */}
        <div className="space-y-6">
          <div className="bg-[#F9FAFA] rounded-[18px] p-6 lg:p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl break-all line-clamp-2 font-bold text-[#181818] capitalize">{job.title}</h2>
                <span className="rounded-full text-nowrap bg-[#005864]/10 px-3 py-1 text-xs font-semibold text-[#005864] capitalize">
                  {job.category.name}
                </span>
              </div>
              <p className="text-base leading-[26px] text-[rgba(24,24,24,0.6)]">{job.description}</p>
            </div>
          </div>

          <div className="bg-[#F9FAFA] rounded-[12px] p-6">
            <div className="space-y-5">
              <InfoRow label="Date Posted:" value={postedDate} />
              {/* <InfoRow label="Scheduled Date:" value={scheduledDate} /> */}
              <InfoRow label="Status:" value={job.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} />
              <InfoRow label="Job Type:" value={job.type.replace(/\b\w/g, (c) => c.toUpperCase())} />
              <InfoRow label="Time Preference:" value={job.when.replace(/\b\w/g, (c) => c.toUpperCase())} />
              <InfoRow label="Contact Preferences:" value={job.contactPreference.join(", ")} />
              <InfoRow label="Applicants:" value={String(job.applyCount)} />
            </div>
          </div>

          {job.images.length > 0 && (
            <div className="bg-[#F9FAFA] rounded-[12px] p-6">
              <h3 className="text-base font-semibold text-black mb-4">Attachments</h3>
              <div className="flex flex-wrap gap-4">
                {job.images.map((img) => (
                  <a key={img._id} href={img.location} target="_blank" rel="noreferrer">
                    <div className="relative w-[70px] h-[70px] rounded-xl overflow-hidden border border-[#E5E5E5]">
                      <Image src={img.location} alt={img.filename} fill className="object-cover" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#F9FAFA] rounded-[12px] p-6">
            <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
              <div>
                <h3 className="text-base font-semibold text-black mb-4">Location</h3>
                <div className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 size-4 shrink-0 text-[#005864]" strokeWidth={2} />
                  <p className="text-base text-[#787878] max-w-[420px]">
                    {job.addressDetails.address}, {job.addressDetails.city}, {job.addressDetails.state} {job.addressDetails.zipCode}, {job.addressDetails.country}
                  </p>
                </div>
              </div>
              <Link href={mapUrl} target="_blank" rel="noreferrer">
                <Button className="h-[42px] rounded-md bg-[#005864] hover:bg-[#004752] px-5 text-white">
                  View on Map
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="bg-[#F9FAFA] rounded-[18px] p-6 h-fit sticky top-6">
          <div className="mb-6">
            <h2 className="text-[20px] font-bold text-[#181818] mb-2">
              {(job.userDisplayTag == "ongoing" || job.userDisplayTag == "completed") ? "Hired for this Service" : "Experts Ready To Help"}
            </h2>
            {appliedProviders.length > 0 && <p className="text-base font-bold text-[#181818] leading-[26px]">
              Below are available Experts for your requests. Choose the Expert you'd like to work with.
            </p>}
          </div>

          {appliedProviders.length > 0 ? (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {appliedProviders.map((prov) => (
                <ExpertCard
                  key={prov._id}
                  id={prov._id}
                  jobId={id}
                  name={prov.name}
                  location={prov.providerAddress ? `${prov.providerAddress.city}, ${prov.providerAddress.state}` : "Location not available"}
                  rating={prov.averageRating}
                  profilePicture={prov.profilePicture?.location || ""}
                />
              ))}
            </div>
          ) : provider ? (
            <div className="bg-white rounded-[12px] p-5">
              <div>
                <div
                  className="flex items-start gap-4 cursor-pointer"
                  onClick={handleProviderClick}
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#E5E5E5]">
                    {provider.profilePicture?.location ? (
                      <Image src={provider.profilePicture.location} alt={provider.name} fill className="object-cover" />
                    ) : (
                      <div className="flex size-full items-center justify-center text-lg font-semibold text-[#005864]">
                        {provider.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-black truncate hover:text-[#005864] transition-colors">
                      {provider.name}
                    </h3>
                    {(() => {
                      const rating = provider.averageRating || 0;
                      const fullStars = Math.floor(rating);
                      const hasHalfStar = rating % 1 !== 0;
                      return (
                        <div className="flex items-center gap-1.5 mt-1">
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={`${i < fullStars
                                  ? "fill-[#EDAF35] text-[#EDAF35]"
                                  : i === fullStars && hasHalfStar
                                    ? "fill-[#EDAF35] text-[#EDAF35]"
                                    : "text-[#E5E5E5]"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-medium text-[#1C1C1C]">{rating.toFixed(1)}</span>
                        </div>
                      );
                    })()}
                    <p className="text-sm text-[rgba(24,24,24,0.8)] mt-1 truncate">
                      {provider?.providerAddress?.state || ""} ,    {provider?.providerAddress?.country || ""}
                    </p>

                  </div>
                </div>
                {!data?.data?.job?.isReviewSubmitted && <Button onClick={() => setReviewOpen(true)} className="h-12 mt-2 cursor-pointer w-full rounded-[12px] bg-[#005864] hover:bg-[#004752] text-white text-base font-semibold">
                  Give Feedback
                </Button>}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-[12px] p-6 text-center">
              <p className="text-sm text-[rgba(24,24,24,0.5)]">No experts have applied yet.</p>
            </div>
          )}

          <div className="mt-6">
            {job.status === "completed" ? (
              <Button onClick={() => router.push("/find-expert")} className="h-12 cursor-pointer w-full rounded-[12px] bg-[#005864] hover:bg-[#004752] text-white text-base font-semibold">
                Find Another Expert
              </Button>
            ) : job.userDisplayTag === "ongoing" ? (
              <Button
                onClick={() => setConfirmOpen(true)}
                className="h-12 w-full rounded-[12px] bg-[#005864] hover:bg-[#004752] text-white text-base font-semibold"
              >
                Mark As Completed
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="w-[360px] max-w-[calc(100%-2rem)] rounded-[16px] bg-white p-0 border-0 shadow-lg">
          {/* Icon Container */}
          <div className="flex justify-center pt-8">
            <svg width="35" height="32" viewBox="0 0 35 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M21.8352 2.52366L34.5555 24.6001C34.8355 25.2591 34.958 25.7949 34.993 26.3515C35.063 27.6521 34.608 28.9162 33.7157 29.889C32.8233 30.8584 31.616 31.4306 30.3038 31.5H4.68808C4.14567 31.4671 3.60326 31.3439 3.09585 31.1532C0.558778 30.1301 -0.666016 27.2515 0.36631 24.7562L13.1742 2.50805C13.6116 1.72599 14.2765 1.05143 15.0988 0.617914C17.4784 -0.701714 20.5054 0.165321 21.8352 2.52366ZM19.0182 17.0725C19.0182 17.9049 18.3358 18.6002 17.4959 18.6002C16.6561 18.6002 15.9562 17.9049 15.9562 17.0725V12.1668C15.9562 11.3327 16.6561 10.6582 17.4959 10.6582C18.3358 10.6582 19.0182 11.3327 19.0182 12.1668V17.0725ZM17.4958 24.5303C16.6559 24.5303 15.9561 23.8349 15.9561 23.0043C15.9561 22.1702 16.6559 21.4766 17.4958 21.4766C18.3357 21.4766 19.018 22.1546 19.018 22.9852C19.018 23.8349 18.3357 24.5303 17.4958 24.5303Z" fill="#005864" />
            </svg>

          </div>

          {/* Content */}
          <div className="flex flex-col items-center px-8 pb-6 pt-4">
            <DialogTitle className="text-[24px] font-bold text-[#181818] text-center mt-2">
              Mark as Completed
            </DialogTitle>
            <DialogDescription className="mt-2 text-base font-normal text-[#565656] text-center leading-[20px]">
              Are you sure you want to mark this job as completed?
            </DialogDescription>

            {/* Buttons */}
            <div className="flex gap-4 mt-6 w-full">
              <Button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="flex-1 h-[49px] rounded-[12px] bg-[rgba(0,88,100,0.06)] hover:bg-[rgba(0,88,100,0.12)] text-[#005864] text-[12px] font-semibold border-0 shadow-none"
              >
                No
              </Button>
              <Button
                type="button"
                disabled={isCompleting}
                onClick={() => completeJob({ jobId: id })}
                className="flex-1 h-[49px] rounded-[12px] bg-[#005864] hover:bg-[#004752] text-white text-[12px] font-semibold"
              >
                {isCompleting ? "Completing..." : "Yes"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <SuccessDialog
        open={successOpen}
        onClose={() => {
          setSuccessOpen(false);
          setReviewOpen(true);
        }}
        title="Job Completed"
        description="Your job has been marked as completed successfully."
      />

      {/* Review Dialog */}
      <ExperienceDialog
        open={reviewOpen}
        onOpenChange={(open) => {
          setReviewOpen(open);
          if (!open) router.push("/dashboard");
        }}
        onSubmit={({ rating, review }) =>
          submitReview({ jobId: id, stars: rating, description: review })
        }
        isPending={isReviewPending}
      />
    </div>
  );
};

export default ServiceDetails;
