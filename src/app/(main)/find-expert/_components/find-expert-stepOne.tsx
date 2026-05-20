"use client";
import { useState } from "react";
import CustomSelect from "@/components/global/custom-select";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Calendar, FileImage } from "lucide-react";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
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
      <div className="w-full grid grid-cols-2 gap-12">
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
              onChange={(val) => onChange("when", val)}
              options={whenOptions}
              placeholder="Select When"
            />
          </div>
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
                {data.jobType === "recurring" && (
                  <div className="relative flex h-[50px] items-center rounded-lg bg-[#F8F8F8] pl-4 pr-12">
                    <input
                      type="date"
                      value={data.recurringDate}
                      onChange={(e) =>
                        onChange("recurringDate", e.target.value)
                      }
                      className="w-full bg-transparent text-sm text-[rgba(24,24,24,0.8)] outline-none"
                    />
                    <Calendar className="pointer-events-none absolute right-4 h-4 w-4 text-[rgba(24,24,24,0.8)]" />
                  </div>
                )}
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
          <div className="mt-2 flex flex-col items-end gap-6">
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
              className="h-12 min-w-[230px] rounded-xl bg-[#005864] px-6 text-base font-semibold capitalize leading-5 text-white transition hover:bg-[#004a52]"
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
