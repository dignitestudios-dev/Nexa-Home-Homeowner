"use client";
import { useMemo, useState } from "react";
import CustomSelect from "@/components/global/custom-select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ChevronLeft, ChevronRight, FileImage, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { StepOneData } from "../page";

const serviceOptions = [
  { label: "Plumbing Services", value: "Plumbing Services" },
  { label: "Electrical Services", value: "electrical-services" },
  { label: "Cleaning Services", value: "cleaning-services" },
];

const whenOptions = [
  { label: "Need an expert right away", value: "right-away" },
  { label: "Ready to hire", value: "ready-to-hire" },
  { label: "Researching options", value: "researching-options" },
  { label: "Select specific date", value: "select-specific-date" },
];
const whereOptions = [
  { label: "Need an expert right away", value: "right-away" },
  { label: "Ready to hire", value: "ready-to-hire" },
  { label: "Researching options", value: "researching-options" },
];

interface StepOneProps {
  data: StepOneData;
  onChange: <K extends keyof StepOneData>(
    field: K,
    value: StepOneData[K],
  ) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onBack: () => void;
  onNext: () => void;
}

const FindExpertForm = ({
  data,
  onChange,
  onImageUpload,
  onBack,
  onNext,
}: StepOneProps) => {
  const [isDateDialogOpen, setIsDateDialogOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState("");
  const [activeMonth, setActiveMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const parseLocalDate = (value: string) => {
    if (!value) return new Date(NaN);
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split("-").map(Number);
      return new Date(year, month - 1, day);
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return parsed;
    return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
  };

  const formatDateInputValue = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const currentSelectedDate = useMemo(() => {
    const parsed = parseLocalDate(data.when);
    return !isNaN(parsed.getTime()) ? parsed : null;
  }, [data.when]);

  const formatDateLabel = (value: string) => {
    if (!value) return "";
    const date = parseLocalDate(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getMonthDays = (monthStart: Date) => {
    const daysInMonth = new Date(
      monthStart.getFullYear(),
      monthStart.getMonth() + 1,
      0,
    ).getDate();
    const firstDayIndex = monthStart.getDay();
    const days = Array.from({ length: firstDayIndex }, () => null as Date | null);

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(new Date(monthStart.getFullYear(), monthStart.getMonth(), day));
    }

    return days;
  };

  const calendarDays = useMemo(() => getMonthDays(activeMonth), [activeMonth]);

  const handleWhenChange = (value: string) => {
    if (value === "select-specific-date") {
      if (currentSelectedDate) {
        setPendingDate(formatDateInputValue(currentSelectedDate));
        setActiveMonth(
          new Date(currentSelectedDate.getFullYear(), currentSelectedDate.getMonth(), 1),
        );
      } else {
        setPendingDate("");
      }
      setIsDateDialogOpen(true);
      return;
    }

    onChange("when", value);
  };

  const handleSaveDate = () => {
    if (!pendingDate) return;

    const formattedDate = formatDateLabel(pendingDate);
    onChange("when", formattedDate);
    setIsDateDialogOpen(false);
  };

  const dynamicWhenOptions = [
    ...whenOptions,
    ...(data.when && !whenOptions.some((option) => option.value === data.when)
      ? [{ label: data.when, value: data.when }]
      : []),
  ];

  console.log("🚀 ~ FindExpertForm ~ data:", data);
  return (
    <div className="min-h-screen ">
      <div className="flex items-center gap-4 py-2">
        <button
          onClick={onBack}
          className="flex items-center text-[#005864] hover:text-[#004750] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[32px] font-semibold">Find Expert</h1>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="flex flex-col gap-2 w-full  my-4">
            {/* Label */}
            <Label className="text-[16px] font-medium leading-[18px]">
              Select Service
            </Label>
            <CustomSelect
              value={data.service}
              onChange={(val) => onChange("service", val)}
              options={serviceOptions}
              placeholder="Select Service"
            />
            <p className="text-[#18181899] ">
              Choose the service type that matches your Service requirement.
            </p>
          </div>
          <div className="flex flex-col gap-2 my-4">
            <Label className="text-sm font-medium text-black">
              Description
            </Label>
            <Textarea
              placeholder="Write here"
              value={data.description}
              onChange={(e) => onChange("description", e.target.value)}
              // 3. Update styling: remove fixed height, add min-h, or resize-none
              className="rounded-[12px] h-28
          bg-[#F8F8F8]
          shadow-[0_1px_2px_rgba(0,0,0,0.05)]
          text-[16px]
          font-normal
          text-[#18181899] border-0 px-4  resize-none"
            />
            <p className="text-[#18181899] ">
              Explain what the job involves or what needs to be done.
            </p>
          </div>
          <div className="flex flex-col gap-2 my-4">
            <Label className="text-sm font-medium text-black">
              Add Attachment
            </Label>

            {/* Upload Area */}
            <label className="flex-1 flex flex-col items-center justify-center py-6 border-2 border-dashed border-[#D9D9D9] rounded-xl bg-[#FBFBFB] cursor-pointer hover:bg-gray-50 transition">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                <FileImage size={30.84} className="text-[#005864]" />
                <span className="text-center text-[13px] text-[#18181899] text-base font-medium">
                  PNG, JPEG, or MP4 (up to 30 sec)
                </span>
              </div>
            </label>

            {/* Uploaded Images Preview */}
            {data.uploadedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {data.uploadedImages.map((file, index) => (
                  <div
                    key={index}
                    className="relative w-full aspect-square rounded-[7px] overflow-hidden bg-gray-200"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 w-full  my-4">
            {/* Label */}
            <Label className="text-[16px] font-medium leading-[18px]">
              When
            </Label>
            <CustomSelect
              value={data.when}
              onChange={handleWhenChange}
              options={dynamicWhenOptions}
              placeholder="Select When"
            />
          </div>
          <Dialog open={isDateDialogOpen} onOpenChange={setIsDateDialogOpen}>
  <DialogContent className="w-[515px] max-w-[515px] rounded-[24px] border-0 bg-white p-0 overflow-hidden">
    
    {/* Header */}
    <div className="relative px-[30px] pt-6">
      <DialogTitle className="text-center text-[16px] font-bold text-black">
        Select Date
      </DialogTitle>

      <button
        onClick={() => setIsDateDialogOpen(false)}
        className="absolute right-[28px] top-6 flex h-[18px] w-[18px] items-center justify-center"
      >
        <X className="h-4 w-4" />
      </button>
    </div>

    {/* Month + navigation */}
    <div className="mt-[28px] px-[30px] flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h2 className="text-2xl font-bold">
          {activeMonth.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button
          onClick={() =>
            setActiveMonth(
              new Date(
                activeMonth.getFullYear(),
                activeMonth.getMonth() - 1,
                1
              )
            )
          }
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      <button
        onClick={() =>
          setActiveMonth(
            new Date(
              activeMonth.getFullYear(),
              activeMonth.getMonth() + 1,
              1
            )
          )
        }
      >
        <ChevronRight size={18} />
      </button>
    </div>

    {/* Calendar */}
    <div className="px-[30px] mt-8">
      {/* Week Names */}
      <div className="grid grid-cols-7 text-center mb-5">
        {["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"].map((day) => (
          <div
            key={day}
            className="text-[16px] font-semibold tracking-[-0.078px]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Dates */}
      <div className="grid grid-cols-7 gap-y-7 text-center">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={index} />;
          }

          const dateValue = formatDateInputValue(day);
          const isSelected = dateValue === pendingDate;

          return (
            <button
              key={dateValue}
              onClick={() => setPendingDate(dateValue)}
              className={`
                mx-auto flex h-[34px] w-[34px]
                items-center justify-center
                rounded-full
                text-[16px]
                transition-all
                ${
                  isSelected
                    ? "bg-[#005864] text-white"
                    : "text-black hover:bg-slate-100"
                }
              `}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>

    {/* Save */}
    <div className="px-[30px] mt-10 pb-6">
      <button
        disabled={!pendingDate}
        onClick={handleSaveDate}
        className="
          h-12
          w-full
          rounded-xl
          bg-[#005864]
          text-sm
          font-semibold
          text-white
          disabled:opacity-50
        "
      >
        Save
      </button>
    </div>
  </DialogContent>
</Dialog>
          <div className="flex flex-col gap-2 w-full  my-4">
            {/* Label */}
            <Label className="text-[16px] font-medium leading-[18px]">
              Where
            </Label>
            <CustomSelect
              value={data.where}
              onChange={(val) => onChange("where", val)}
              options={whenOptions}
              placeholder="Select Where "
            />
            <p className="text-[#18181899] ">
              Select the location you’ve added or add a new address for this
              Service.
            </p>
          </div>
        </div>
        <div>
          <div>
            <p className="text-[20px] font-semibold leading-14">
              Select Job Type
            </p>
            <p className="text-[#18181899]">
              Pick the job type that matches your service need.
            </p>
          </div>

          <div className="flex flex-col gap-9 py-4">
            <div className="flex flex-col gap-6">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="jobType"
                  checked={data.jobType === "one-time"}
                  onChange={() => onChange("jobType", "one-time")}
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 border-[rgba(24,24,24,0.6)] text-[#005864] focus:ring-[#005864]"
                />
                <span className="text-base font-normal leading-[22px] tracking-[-0.408px] text-[#181818]">
                  One Time Job
                </span>
              </label>

              <div className="flex flex-col gap-3">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="radio"
                    name="jobType"
                    checked={data.jobType === "recurring"}
                    onChange={() => onChange("jobType", "recurring")}
                    className="mt-0.5 h-4 w-4 shrink-0 border-[rgba(24,24,24,0.8)] text-[#005864] focus:ring-[#005864]"
                  />
                  <span className="text-base font-normal leading-5 text-black">
                    Recurring Job
                  </span>
                </label>
             
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              <h3 className="text-xl font-semibold leading-[22px] tracking-[-0.408px] text-black">
                Contact Preferences
              </h3>
              <p className="text-[#18181899] text-base font-normal leading-[22px] tracking-[-0.408px]">
                Select your preferred way to be contacted - you can choose both
                options.
              </p>
              <div className="mt-2 flex flex-col gap-5">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={data.contactCall}
                    onChange={(e) => onChange("contactCall", e.target.checked)}
                    className="h-[18px] w-[18px] rounded border-[rgba(24,24,24,0.6)] text-[#005864] focus:ring-[#005864]"
                  />
                  <span className="text-lg font-normal leading-[22px] tracking-[-0.408px] text-[#181818]">
                    Call/Text
                  </span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={data.contactEmail}
                    onChange={(e) => onChange("contactEmail", e.target.checked)}
                    className="h-[18px] w-[18px] rounded border-[rgba(24,24,24,0.6)] text-[#005864] focus:ring-[#005864]"
                  />
                  <span className="text-base font-normal leading-[22px] tracking-[-0.408px] text-[#181818]">
                    Email
                  </span>
                </label>
              </div>
            </div>
          </div>
          {/* Preview card + CTA */}
          <div className="mt-2 flex flex-col items-center md:items-end gap-6 w-full">
            <div className="relative h-[223px] w-full overflow-hidden rounded-[24px]">
              <Image
                src="https://picsum.photos/200/300"
                alt="Service preview"
                className="object-cover"
                fill
                sizes="532px"
              />
              <div
                className="absolute inset-0 rounded-[24px]"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(0, 0, 0, 0) 55%, #000000 100%)",
                }}
              />
              <Link
                href="https://www.examplelink.io/contact-request"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-5 left-[18px] max-w-[calc(100%-36px)] truncate text-base font-normal leading-5 tracking-[-0.408px] text-[#0374FF] underline-offset-2 hover:underline"
              >
                https://www.examplelink.io/contact-request
              </Link>
            </div>
            <button
              onClick={onNext}
              type="button"
              className="h-12 w-full md:w-auto md:min-w-[230px] rounded-xl bg-[#005864] px-6 text-base font-semibold capitalize leading-5 text-white transition hover:bg-[#004a52]"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindExpertForm;
