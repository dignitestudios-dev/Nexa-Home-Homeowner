"use client";

import { useMemo, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Check, ChevronLeft, ChevronRight, ChevronsUpDown, FileImage, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useGetCategories, useGetAddresses } from "@/features/user/hooks";
import { useDebounce } from "@/hooks/use-debounce";
import CustomSelect from "@/components/global/custom-select";
import { StepOneData } from "../page";
import { Skeleton } from "@/components/ui/skeleton";

const schema = z.object({
  categoryId: z.string().min(1, "Please select a service"),
  title: z.string().min(1, "Title is required").max(60, "Title must be 60 characters or less"),
  description: z.string().min(1, "Description is required").max(500, "Description must be 500 characters or less"),
  when: z.string().min(1, "Please select when"),
  addressId: z.string().min(1, "Please select a location"),
  jobType: z.enum(["one-time", "recurring"]),
  contactCall: z.boolean(),
  contactEmail: z.boolean(),
  uploadedImages: z.array(z.instanceof(File)).min(1, "At least one image is required").max(10, "Maximum 10 images allowed"),
}).refine((d) => d.contactCall || d.contactEmail, {
  message: "Please select at least one contact preference",
  path: ["contactCall"],
});

type FormValues = z.infer<typeof schema>;

const whenOptions = [
  { label: "Need an expert right away", value: "Need an expert right away" },
  { label: "Ready to hire", value: "Ready to hire" },
  { label: "Researching options", value: "Researching options" },
  { label: "Select Specific Date", value: "select-specific-date" },
];

interface StepOneProps {
  data: StepOneData;
  onChange: <K extends keyof StepOneData>(field: K, value: StepOneData[K]) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function FindExpertStepOne({ data, onChange, onRemoveImage, onBack, onNext }: StepOneProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      categoryId: data.categoryId,
      title: data.title,
      description: data.description,
      when: data.when,
      addressId: data.addressId,
      jobType: data.jobType,
      contactCall: data.contactCall,
      contactEmail: data.contactEmail,
      uploadedImages: data.uploadedImages,
    },
  });

  // Sync RHF → parent state on every change
  const watched = watch();
  useEffect(() => {
    onChange("title", watched.title ?? "");
    onChange("description", watched.description ?? "");
    onChange("jobType", watched.jobType ?? "one-time");
    onChange("contactCall", !!watched.contactCall);
    onChange("contactEmail", !!watched.contactEmail);
  }, [watched.title, watched.description, watched.jobType, watched.contactCall, watched.contactEmail]);

  // Sync parent category pre-selection (from URL) → RHF
  useEffect(() => {
    if (data.categoryId) setValue("categoryId", data.categoryId);
  }, [data.categoryId]);

  useEffect(() => {
    if (data.when) setValue("when", data.when);
  }, [data.when]);

  useEffect(() => {
    if (data.addressId) setValue("addressId", data.addressId);
  }, [data.addressId]);

  useEffect(() => {
    setValue("uploadedImages", data.uploadedImages);
  }, [data.uploadedImages]);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [categoryPage, setCategoryPage] = useState(1);
  const debouncedSearch = useDebounce(categorySearch, 400);
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState("");
  const [activeMonth, setActiveMonth] = useState(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), 1);
  });

  const { data: categoryData, isLoading: isCategoriesLoading } = useGetCategories({ page: categoryPage, limit: 15, search: debouncedSearch });
  const { data: addressData } = useGetAddresses();
  const addresses = addressData?.data?.addresses ?? [];
  const addressOptions = addresses.map((a) => ({ label: `${a.label}: ${a.address}, ${a.city}`, value: a._id }));
  const categories = categoryData?.data ?? [];
  const totalCatPages = categoryData?.pagination?.totalPages ?? 1;

  const calendarDays = useMemo(() => {
    const daysInMonth = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0).getDate();
    const days: (Date | null)[] = Array.from({ length: activeMonth.getDay() }, () => null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(activeMonth.getFullYear(), activeMonth.getMonth(), d));
    return days;
  }, [activeMonth]);

  const today = useMemo(() => {
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return t;
  }, []);

  const isCurrentMonthOrEarlier = useMemo(() => {
    return activeMonth.getFullYear() < today.getFullYear() ||
      (activeMonth.getFullYear() === today.getFullYear() && activeMonth.getMonth() <= today.getMonth());
  }, [activeMonth, today]);

  const formatDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };


  const handleSaveDate = () => {
    if (!pendingDate) return;
    setValue("when", pendingDate, { shouldValidate: true });
    onChange("when", pendingDate);
    setIsDateDialogOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const valid = Array.from(files).filter((f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type));
    const next = [...data.uploadedImages, ...valid].slice(0, 10);
    onChange("uploadedImages", next);
    setValue("uploadedImages", next, { shouldValidate: true });
    e.target.value = "";
  };

  const handleRemove = (index: number) => {
    onRemoveImage(index);
    const next = data.uploadedImages.filter((_, i) => i !== index);
    setValue("uploadedImages", next, { shouldValidate: true });
  };



  const onSubmit = () => onNext();

  const titleVal = watch("title");
  const descVal = watch("description");

  return (
    <div className="min-h-screen">
      <div className="flex items-center gap-4 py-2">
        <button onClick={onBack} className="flex items-center text-[#005864] hover:text-[#004750] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[32px] font-semibold">Find Expert</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            {/* Category */}
            <div className="flex flex-col gap-2 w-full my-4">
              <Label className="text-[16px] font-medium leading-[18px]">Select Service <span className="text-red-500">*</span></Label>
              <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn("flex h-12 w-full items-center justify-between rounded-[12px] bg-[#F8F8F8] px-4 text-sm text-[#181818] shadow-[0_1px_2px_rgba(0,0,0,0.05)] focus:outline-none", errors.categoryId && "border border-red-400")}
                  >
                    <span className={cn(!data.categoryName && "text-[rgba(24,24,24,0.5)]")}>
                      {data.categoryName || "Select Service"}
                    </span>
                    <ChevronsUpDown className="size-4 opacity-50" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[350px] p-0 bg-white shadow-lg rounded-xl border border-[#E5E5E5]" align="start">
                  <div className="p-2 border-b border-[#E5E5E5]">
                    <input
                      placeholder="Search service..."
                      value={categorySearch}
                      onChange={(e) => { setCategorySearch(e.target.value); setCategoryPage(1); }}
                      className="w-full rounded-lg bg-[#F8F8F8] px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="max-h-56 overflow-y-auto">
                    {isCategoriesLoading ? (
                      <div className="p-2 space-y-2">
                        <Skeleton className="h-9 w-full rounded-md" />
                        <Skeleton className="h-9 w-full rounded-md" />
                        <Skeleton className="h-9 w-full rounded-md" />
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="py-4 text-center text-sm text-[rgba(24,24,24,0.5)]">No services found.</div>
                    ) : categories.map((cat) => (
                      <button
                        key={cat._id}
                        type="button"
                        onClick={() => {
                          onChange("categoryId", cat._id);
                          onChange("categoryName", cat.name);
                          setValue("categoryId", cat._id, { shouldValidate: true });
                          setCategoryOpen(false);
                          setCategorySearch("");
                        }}
                        className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-[#181818] hover:bg-[#F8F8F8] transition-colors"
                      >
                        <Check className={cn("size-4 text-[#005864]", data.categoryId === cat._id ? "opacity-100" : "opacity-0")} />
                        {cat.name}
                      </button>
                    ))}
                  </div>
                  {totalCatPages > 1 && (
                    <div className="flex items-center justify-between border-t border-[#E5E5E5] px-3 py-2">
                      <button type="button" disabled={categoryPage === 1} onClick={() => setCategoryPage((p) => p - 1)} className="rounded p-1 text-[#005864] disabled:opacity-30"><ChevronLeft size={16} /></button>
                      <span className="text-xs text-[rgba(24,24,24,0.5)]">{categoryPage} / {totalCatPages}</span>
                      <button type="button" disabled={categoryPage === totalCatPages} onClick={() => setCategoryPage((p) => p + 1)} className="rounded p-1 text-[#005864] disabled:opacity-30"><ChevronRight size={16} /></button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
              <p className="text-[#18181899]">Choose the service type that matches your requirement.</p>
              {errors.categoryId && <p className="text-xs text-red-500">{errors.categoryId.message}</p>}
            </div>

            {/* Title */}
            <div className="flex flex-col gap-2 my-4">
              <Label className="text-sm font-medium text-black">Title <span className="text-red-500">*</span></Label>
              <div className="relative">
                <input
                  {...register("title")}
                  placeholder="e.g. Pool cleaning needed"
                  maxLength={60}
                  className={cn("h-12 pr-20 rounded-[12px] bg-[#F8F8F8] px-4 text-sm text-[#181818] placeholder:text-[rgba(24,24,24,0.5)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] outline-none w-full", errors.title && "border border-red-400")}
                />
                <span className="absolute right-3 top-3.5 text-xs text-[#18181899]">{(titleVal ?? "").length}/60</span>
              </div>
              {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 my-4">
              <Label className="text-sm font-medium text-black">Description <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Textarea
                  {...register("description")}
                  placeholder="Write here"
                  maxLength={500}
                  className={cn("rounded-[12px] h-28 outline-0 bg-[#F8F8F8] shadow-[0_1px_2px_rgba(0,0,0,0.05)] text-[16px] font-normal text-[#18181899] border-0 px-4 resize-none", errors.description && "border border-red-400")}
                />
                <span className="absolute right-3 bottom-3 text-xs text-[#18181899]">{(descVal ?? "").length}/500</span>
              </div>
              <p className="text-[#18181899]">Explain what the job involves or what needs to be done.</p>
              {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
            </div>

            {/* Attachments */}
            <div className="flex flex-col gap-2 my-4">
              <Label className="text-sm font-medium text-black">Add Attachment <span className="text-red-500">*</span></Label>
              <label className={cn("flex-1 flex flex-col items-center justify-center py-6 border-2 border-dashed rounded-xl bg-[#FBFBFB] cursor-pointer hover:bg-gray-50 transition", errors.uploadedImages ? "border-red-400" : "border-[#D9D9D9]")}>
                <input type="file" multiple accept=".jpg,.jpeg,.png,.webp" onChange={handleImageChange} className="hidden" />
                <div className="flex flex-col items-center gap-2">
                  <FileImage size={30} className="text-[#005864]" />
                  <span className="text-center text-[13px] text-[#18181899]">JPG, PNG, or WebP (Max 10 images)</span>
                </div>
              </label>
              {errors.uploadedImages && <p className="text-xs text-red-500">{errors.uploadedImages.message as string}</p>}
              {data.uploadedImages.length > 0 && (
                <div>
                  <p className="text-xs text-[#18181899] mb-2">{data.uploadedImages.length}/10 images</p>
                  <div className="grid grid-cols-3 gap-2">
                    {data.uploadedImages.map((file, index) => (
                      <div key={index} className="relative w-full flex items-center justify-center lg:w-[200px] lg:h-[200px] rounded-[7px] overflow-hidden bg-gray-200 group">
                        <img src={URL.createObjectURL(file)} alt={`preview-${index}`} className="object-contain" />
                        <button type="button" onClick={() => handleRemove(index)} className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* When */}
            <div className="flex flex-col gap-2 w-full my-4">
              <Label className="text-[16px] font-medium leading-[18px]">When</Label>
              <Controller
                control={control}
                name="when"
                render={({ field }) => {
                  const opts = [
                    ...whenOptions,
                    ...(field.value && !whenOptions.some((o) => o.value === field.value)
                      ? [{ label: field.value, value: field.value }]
                      : []),
                  ];
                  return (
                    <CustomSelect
                      value={field.value}
                      onChange={(val) => {
                        if (val === "select-specific-date") {
                          setTimeout(() => setIsDateDialogOpen(true), 150);
                          return;
                        }
                        field.onChange(val);
                        onChange("when", val);
                      }}
                      options={opts}
                      placeholder="Select When"
                    />
                  );
                }}
              />
              {errors.when && <p className="text-xs text-red-500">{errors.when.message}</p>}
            </div>

            {/* Where */}
            <div className="flex flex-col gap-2 w-full my-4">
              <Label className="text-[16px] font-medium leading-[18px]">Where</Label>
              <CustomSelect
                value={data.addressId}
                onChange={(val) => {
                  onChange("addressId", val);
                  setValue("addressId", val, { shouldValidate: true });
                }}
                options={addressOptions}
                placeholder="Select Location"
              />
              <p className="text-[#18181899]">Select the location for this service.</p>
              {errors.addressId && <p className="text-xs text-red-500">{errors.addressId.message}</p>}
            </div>
          </div>

          <div>
            {/* Job Type */}
            <div>
              <p className="text-[20px] font-semibold leading-14">Select Job Type</p>
              <p className="text-[#18181899]">Pick the job type that matches your service need.</p>
            </div>
            <div className="flex flex-col gap-9 py-4">
              <div className="flex flex-col gap-6">
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="radio" value="one-time" {...register("jobType")} className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#005864] focus:ring-[#005864]" />
                  <span className="text-base font-normal leading-[22px] text-[#181818]">One Time Job</span>
                </label>
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="radio" value="recurring" {...register("jobType")} className="mt-0.5 h-4 w-4 shrink-0 text-[#005864] focus:ring-[#005864]" />
                  <span className="text-base font-normal leading-5 text-black">Recurring Job</span>
                </label>
              </div>

              {/* Contact Preferences */}
              <div className="flex flex-col gap-3.5">
                <h3 className="text-xl font-semibold leading-[22px] text-black">Contact Preferences</h3>
                <p className="text-[#18181899] text-base">Select your preferred way to be contacted.</p>
                <div className="mt-2 flex flex-col gap-5">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" {...register("contactCall")} className="h-[18px] w-[18px] rounded text-[#005864] focus:ring-[#005864]" />
                    <span className="text-lg font-normal text-[#181818]">Call/Text</span>
                  </label>
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" {...register("contactEmail")} className="h-[18px] w-[18px] rounded text-[#005864] focus:ring-[#005864]" />
                    <span className="text-base font-normal text-[#181818]">Email</span>
                  </label>
                </div>
                {errors.contactCall && <p className="text-xs text-red-500">{errors.contactCall.message}</p>}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="h-12 w-full md:w-auto md:min-w-[230px] rounded-xl bg-[#005864] px-6 text-base font-semibold text-white transition hover:bg-[#004a52]"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Date Dialog */}
      <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
        <DialogContent className="w-[515px] max-w-[515px] rounded-[24px] border-0 bg-white p-0 overflow-hidden">
          <div className="relative px-[30px] pt-6">
            <DialogTitle className="text-center text-[16px] font-bold text-black">Select Date</DialogTitle>
            <button type="button" onClick={() => setIsDateDialogOpen(false)} className="absolute right-[28px] top-6"><X className="h-4 w-4" /></button>
          </div>
          <div className="mt-[28px] px-[30px] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">{activeMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}</h2>
              <button
                type="button"
                disabled={isCurrentMonthOrEarlier}
                onClick={() => setActiveMonth(new Date(activeMonth.getFullYear(), activeMonth.getMonth() - 1, 1))}
                className="disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
            </div>
            <button type="button" onClick={() => setActiveMonth(new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 1))}><ChevronRight size={18} /></button>
          </div>
          <div className="px-[30px] mt-8">
            <div className="grid grid-cols-7 text-center mb-5">
              {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((d) => (
                <div key={d} className="text-[16px] font-semibold">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-y-7 text-center">
              {calendarDays.map((day, index) => {
                if (!day) return <div key={index} />;
                const dv = formatDate(day);
                const isPast = day < today;
                return (
                  <button
                    type="button"
                    key={dv}
                    disabled={isPast}
                    onClick={() => setPendingDate(dv)}
                    className={cn(
                      "mx-auto flex h-[34px] w-[34px] items-center justify-center rounded-full text-[16px] transition-all",
                      dv === pendingDate
                        ? "bg-[#005864] text-white"
                        : isPast
                          ? "text-black/30 cursor-not-allowed"
                          : "text-black hover:bg-slate-100"
                    )}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="px-[30px] mt-10 pb-6">
            <button type="button" disabled={!pendingDate} onClick={handleSaveDate} className="h-12 w-full rounded-xl bg-[#005864] text-sm font-semibold text-white disabled:opacity-50">Save</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
