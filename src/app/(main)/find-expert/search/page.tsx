"use client";

import React, { useState, Suspense } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  X,
  Loader2,
  Sparkles,
  ArrowRight,
  Plus,
  HelpCircle,
  Wrench,
  CheckCircle2,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDebounce } from "@/hooks/use-debounce";
import {
  useSearchCategories,
  useRequestCategory,
  CategorySearchItem,
} from "@/features/user/hooks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import SuccessDialog from "@/components/ui/success-dialog";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const POPULAR_TAGS = [
  "Window Washing",
  "Pressure Washing",
  "Laundry Service",
  "Plumbing",
  "Pool Cleaning",
  "Landscaping",
  "Pest Control",
  "Appliance Moving",
  "Electrical",
];

const categoryRequestSchema = z.object({
  text: z
    .string()
    .trim()
    .min(3, "Please write your request (at least 3 characters)")
    .max(300, "Request must be 300 characters or less"),
});

type CategoryRequestFormValues = z.infer<typeof categoryRequestSchema>;

function FindExpertSearchContent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm.trim(), 350);

  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Search categories API call: /category/search?search=...
  const { data: searchData, isLoading: isSearchLoading, isFetching } = useSearchCategories(
    debouncedSearch,
    debouncedSearch.length > 0
  );

  const suggestedCategories: CategorySearchItem[] = searchData?.data ?? [];

  // Request category mutation
  const { mutate: requestCategory, isPending: isSubmittingRequest } = useRequestCategory({
    onSuccess: () => {
      setIsRequestModalOpen(false);
      setIsSuccessModalOpen(true);
      resetRequestForm();
      toast.success("Category request submitted successfully!");
    },
  });

  const {
    register: registerRequest,
    handleSubmit: handleRequestSubmit,
    setValue: setRequestValue,
    watch: watchRequest,
    reset: resetRequestForm,
    formState: { errors: requestErrors },
  } = useForm<CategoryRequestFormValues>({
    resolver: zodResolver(categoryRequestSchema),
    defaultValues: {
      text: "",
    },
  });

  const requestTextValue = watchRequest("text");

  const openRequestModalWithPrefill = (prefillTerm?: string) => {
    const term = prefillTerm ?? searchTerm.trim();
    const initialText = term ? `Please add ${term} services in my area.` : "";
    setRequestValue("text", initialText);
    setIsRequestModalOpen(true);
  };

  const handleSelectCategory = (cat: CategorySearchItem) => {
    router.push(
      `/find-expert?categoryId=${encodeURIComponent(cat._id)}&categoryName=${encodeURIComponent(
        cat.name
      )}`
    );
  };

  const onRequestSubmit = (values: CategoryRequestFormValues) => {
    requestCategory({
      text: values.text.trim(),
    });
  };

  const isQuerying = searchTerm.trim().length > 0;
  const showLoading = isQuerying && (isSearchLoading || isFetching);
  const showResults = isQuerying && !showLoading && suggestedCategories.length > 0;
  const showNoResults = isQuerying && !showLoading && suggestedCategories.length === 0;

  return (
    <div className="max-w-[1100px] mx-auto py-5 px-4 sm:px-6 lg:px-8 space-y-8 min-h-[85vh] flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center justify-center size-10 rounded-full bg-white border border-[#E5E5E5] text-[#005864] hover:bg-[#005864]/5 transition-colors shadow-xs"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-[26px] sm:text-[30px] font-semibold text-[#181818] tracking-tight">
              Find an Expert
            </h1>
            <p className="text-[13px] sm:text-[14px] text-gray-500">
              Search by service or ask our smart assistant
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => openRequestModalWithPrefill()}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium text-[#005864] bg-white border border-[#005864]/20 hover:bg-[#005864]/5 hover:border-[#005864]/40 transition-colors shadow-xs"
        >
          <Plus size={16} />
          Request Category
        </button>
      </div>

      {/* Main Interactive AI Search Card */}
      <div className="relative rounded-[24px] bg-white border border-[#E5E5E5] p-6 sm:p-10 shadow-sm flex flex-col items-center text-center overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-16 -right-16 size-48 rounded-full bg-[#005864]/5 pointer-events-none blur-2xl" />
        <div className="absolute -bottom-16 -left-16 size-48 rounded-full bg-[#D7DF23]/10 pointer-events-none blur-2xl" />

        {/* Center AI Image */}
        <div className="relative mb-5 group">
          <div className="size-24 sm:size-28 rounded-2xl overflow-hidden border-2 border-white  ring-[#005864]/10 transition-transform duration-300 group-hover:scale-105 bg-white flex items-center justify-center">
            <Image
              src="/images/ai.jpg"
              alt="AI Assistant"
              width={120}
              height={120}
              priority
              className="object-contain w-full h-full p-1"
            />
          </div>
          {/* <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#005864] text-white text-[11px] font-semibold tracking-wide shadow-sm uppercase">
            <Sparkles size={11} className="text-[#D7DF23]" />
            AI Search
          </span> */}
        </div>

        {/* Title and description */}
        <h2 className="text-[22px] sm:text-[28px] font-bold text-[#181818] mt-2 max-w-xl">
          What service do you need help with?
        </h2>
        <p className="text-[14px] sm:text-[15px] text-gray-500 mt-1.5 max-w-lg">
          Type your required service name to find matching experts instantly.
        </p>

        {/* Search Input Box */}
        <div className="w-full max-w-[620px] mt-6 relative">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-[#005864]">
              {showLoading ? (
                <Loader2 size={20} className="animate-spin text-[#005864]" />
              ) : (
                <Search size={20} className="text-[#005864]" />
              )}
            </div>

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Window washing, Pressure washing, Plumbing..."
              autoFocus
              className="w-full h-14 pl-12 pr-12 rounded-[16px] bg-[#F8F8F8] border border-[#E5E5E5] text-[16px] text-[#181818] placeholder:text-gray-400 outline-none transition focus:border-[#005864] focus:bg-white focus:ring-3 focus:ring-[#005864]/15 shadow-xs"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-4 size-7 flex items-center justify-center rounded-full bg-gray-200/70 hover:bg-gray-300 text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Quick Suggestions / Popular Tags */}
          {/* <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[12px] font-medium text-gray-400 mr-1">Popular:</span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchTerm(tag)}
                className={`px-3 py-1 rounded-full text-[12px] font-medium transition-all ${
                  searchTerm.toLowerCase() === tag.toLowerCase()
                    ? "bg-[#005864] text-white shadow-xs"
                    : "bg-[#F8F8F8] text-gray-600 border border-[#EBEBEB] hover:border-[#005864]/40 hover:text-[#005864] hover:bg-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div> */}
        </div>
      </div>

      {/* Dynamic Results & Suggestions Section */}
      <div className="space-y-4">
        {/* Loading Skeletons */}
        {showLoading && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-48 rounded-md" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[16px] bg-white border border-[#E5E5E5] p-4 flex items-center gap-3.5"
                >
                  <Skeleton className="size-14 rounded-[12px] shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4 rounded" />
                    <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggested Categories Found */}
        {showResults && (
          <div className="space-y-4 animate-in fade-in-50 duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#005864]" />
                <h3 className="text-[17px] font-semibold text-[#181818]">
                  Suggested Categories ({suggestedCategories.length})
                </h3>
              </div>
              <p className="text-[13px] text-gray-500">
                Click a category to continue
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {suggestedCategories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => handleSelectCategory(cat)}
                  className="group relative rounded-[16px] bg-white border border-[#E5E5E5] hover:border-[#005864] hover:shadow-md transition-all duration-200 p-4 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="size-14 rounded-[12px] bg-[#F8F8F8] border border-[#EBEBEB] overflow-hidden shrink-0 flex items-center justify-center group-hover:ring-2 group-hover:ring-[#005864]/20 transition-all">
                      {cat.icon?.location ? (
                        <img
                          src={cat.icon.location}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Wrench className="size-6 text-[#005864]" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-[15px] font-semibold text-[#181818] group-hover:text-[#005864] transition-colors truncate">
                        {cat.name}
                      </h4>
                      {cat.pricing?.dollarPrice ? (
                        <p className="text-[12px] text-gray-500 mt-0.5">
                          From ${cat.pricing.dollarPrice}
                        </p>
                      ) : (
                        <p className="text-[12px] text-gray-400 mt-0.5">
                          Top rated service
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="size-8 rounded-full bg-[#F8F8F8] group-hover:bg-[#005864] group-hover:text-white text-gray-400 flex items-center justify-center transition-colors shrink-0">
                    <ArrowRight
                      size={15}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Suggested Categories Found */}
        {showNoResults && (
          <div className="rounded-[20px] bg-white border border-[#E5E5E5] p-8 sm:p-10 text-center flex flex-col items-center max-w-lg mx-auto shadow-xs animate-in fade-in-50 duration-300">
            <div className="size-16 rounded-full bg-[#005864]/10 text-[#005864] flex items-center justify-center mb-4">
              <HelpCircle size={32} />
            </div>
            <h3 className="text-[19px] font-bold text-[#181818]">
              No category found for &ldquo;{debouncedSearch}&rdquo;
            </h3>
            <p className="text-[14px] text-gray-500 mt-2 max-w-md">
              We couldn&apos;t find any active services matching your query. Would you like to request this new category?
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => openRequestModalWithPrefill(debouncedSearch)}
                className="h-12 px-6 rounded-xl bg-[#005864] hover:bg-[#004a52] text-white text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Plus size={16} />
                Request &ldquo;{debouncedSearch}&rdquo;
              </button>
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="h-12 px-5 rounded-xl bg-[#F8F8F8] hover:bg-gray-200 text-gray-700 text-[14px] font-medium transition-colors cursor-pointer"
              >
                Clear Search
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom helper card */}
      <div className="mt-auto pt-6 border-t border-[#EBEBEB] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <p className="text-[14px] font-medium text-[#181818]">
            Can&apos;t find the specific service you need?
          </p>
          <p className="text-[12px] text-gray-500">
            Submit a category request and our team will onboard experts for you.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openRequestModalWithPrefill()}
          className="text-[14px] font-semibold text-[#005864] hover:text-[#004750] underline underline-offset-4 transition-colors cursor-pointer shrink-0"
        >
          Request a New Category
        </button>
      </div>

      {/* Request Category Dialog */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-[24px] border-none bg-white p-6 sm:p-8 shadow-xl">
          <DialogHeader className="space-y-2 text-left">
            <div className="size-12 rounded-2xl bg-[#005864]/10 text-[#005864] flex items-center justify-center mb-1">
              <Plus size={24} />
            </div>
            <DialogTitle className="text-[22px] font-bold text-[#181818]">
              Request a Category
            </DialogTitle>
            <DialogDescription className="text-[14px] text-gray-500">
              Tell us what service you need. We will review and make it available on Nexa Home.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={handleRequestSubmit(onRequestSubmit)}
            className="mt-4 space-y-4"
            noValidate
          >
            {/* Request Text Field */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-[#181818]">
                Request Details <span className="text-red-500">*</span>
              </label>
              <textarea
                {...registerRequest("text")}
                rows={4}
                placeholder="e.g. Please add gardening services in my area."
                maxLength={300}
                className={`w-full resize-none rounded-[12px] bg-[#F8F8F8] border px-4 py-3 text-[14px] text-[#181818] placeholder:text-gray-400 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#005864]/20 ${
                  requestErrors.text
                    ? "border-red-400 focus:border-red-400"
                    : "border-[#E5E5E5] focus:border-[#005864]"
                }`}
              />
              <div className="flex items-center justify-between">
                <p className="text-[12px] text-red-500">
                  {requestErrors.text?.message ?? ""}
                </p>
                <p
                  className={`text-[12px] ${
                    (requestTextValue?.length ?? 0) >= 300
                      ? "text-red-500"
                      : "text-gray-400"
                  }`}
                >
                  {requestTextValue?.length ?? 0}/300
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsRequestModalOpen(false)}
                className="flex-1 h-12 rounded-[12px] bg-[#F8F8F8] hover:bg-gray-200 text-[#181818] text-[14px] font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmittingRequest}
                className="flex-1 h-12 rounded-[12px] bg-[#005864] hover:bg-[#004a52] text-white text-[14px] font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer shadow-xs"
              >
                {isSubmittingRequest ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <SuccessDialog
        open={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Category Requested"
        description="Thank you! We've received your category request and will review it shortly."
      />
    </div>
  );
}

export default function FindExpertSearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="size-7 animate-spin text-[#005864]" />
        </div>
      }
    >
      <FindExpertSearchContent />
    </Suspense>
  );
}
