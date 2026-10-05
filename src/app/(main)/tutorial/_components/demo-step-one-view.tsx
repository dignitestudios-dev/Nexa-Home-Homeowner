"use client";

import React, { useState } from "react";
import { ArrowLeft, Check, ChevronsUpDown, FileImage, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CustomSelect from "@/components/global/custom-select";
import { StepOneData } from "../../find-expert/page";

const DEMO_CATEGORIES = [
  { _id: "c1", name: "Landscaping & Lawn Care" },
  { _id: "c2", name: "Plumbing Services" },
  { _id: "c3", name: "HVAC & Air Conditioning" },
  { _id: "c4", name: "Electrical & Lighting" },
  { _id: "c5", name: "Pest Control" },
  { _id: "c6", name: "Pool Cleaning & Repair" },
];

const DEMO_ADDRESSES = [
  { label: "Home: 123 Innovation Way, Austin TX 78701", value: "demo-address-id" },
  { label: "Vacation Home: 456 Lakeview Dr, Austin TX 78702", value: "demo-address-2" },
];

const whenOptions = [
  { label: "Need an expert right away", value: "Need an expert right away" },
  { label: "Ready to hire", value: "Ready to hire" },
  { label: "Researching options", value: "Researching options" },
];

interface DemoStepOneViewProps {
  data: StepOneData;
  onChange: <K extends keyof StepOneData>(field: K, value: StepOneData[K]) => void;
  onBack: () => void;
  onNext: () => void;
}

export default function DemoStepOneView({
  data,
  onChange,
  onBack,
  onNext,
}: DemoStepOneViewProps) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");

  const filteredCategories = DEMO_CATEGORIES.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      <div id="tutorial-step-one-header" className="flex items-center gap-4 py-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center text-[#005864] hover:text-[#004750] transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[32px] font-semibold">Find Expert</h1>
      </div>

      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-12 mt-4">
        {/* Left Column */}
        <div>
          {/* Category */}
          <div className="flex flex-col gap-2 w-full my-4">
            <Label className="font-medium text-base leading-[18px]">
              Select Service <span className="text-red-500">*</span>
            </Label>
            <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-between rounded-[12px] bg-[#F8F8F8] px-4 text-base text-[#181818] shadow-[0_1px_2px_rgba(0,0,0,0.05)] focus:outline-none"
                >
                  <span>{data.categoryName || "Select Service"}</span>
                  <ChevronsUpDown className="size-4 opacity-50" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[350px] p-0 bg-white shadow-lg rounded-xl border border-[#E5E5E5]"
                align="start"
              >
                <div className="p-2 border-b border-[#E5E5E5]">
                  <input
                    placeholder="Search service..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="w-full rounded-lg bg-[#F8F8F8] px-3 py-2 text-base outline-none"
                  />
                </div>
                <div className="max-h-56 overflow-y-auto">
                  {filteredCategories.map((cat) => (
                    <button
                      key={cat._id}
                      type="button"
                      onClick={() => {
                        onChange("categoryId", cat._id);
                        onChange("categoryName", cat.name);
                        setCategoryOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-base text-[#181818] hover:bg-[#F8F8F8] transition-colors"
                    >
                      <Check
                        className={`size-4 text-[#005864] ${
                          data.categoryId === cat._id ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {cat.name}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <p className="text-[#18181899]">Choose the service type that matches your requirement.</p>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 my-4">
            <Label className="text-base font-medium text-black">
              Description <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Textarea
                value={data.description}
                onChange={(e) => onChange("description", e.target.value)}
                placeholder="Write here"
                maxLength={500}
                className="h-28 resize-none rounded-[12px] bg-[#F8F8F8] px-4 border-0 outline-none text-[16px]! shadow-[0_1px_2px_rgba(0,0,0,0.05)] focus:ring-0"
              />
              <span className="absolute right-3 bottom-3 text-xs text-[#18181899]">
                {data.description.length}/500
              </span>
            </div>
            <p className="text-[#18181899]">Explain what the job involves or what needs to be done.</p>
          </div>

          {/* Attachments */}
          <div className="flex flex-col gap-2 my-4">
            <Label className="text-base font-medium text-black">
              Add Photos/Videos <span className="text-gray-400 font-normal text-sm">(Optional)</span>
            </Label>
            <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-[#D9D9D9] rounded-xl bg-[#FBFBFB]">
              <FileImage size={30} className="text-[#005864] mb-1" />
              <span className="text-center text-[13px] text-[#18181899]">
                Images (JPG, PNG, WebP · max 100MB) or Videos (MP4, WebM, MOV · max 100MB)
              </span>
              <span className="text-[12px] text-[#18181899]">
                Up to 10 files total · optional
              </span>
            </div>
          </div>

          {/* When */}
          <div className="flex flex-col gap-2 w-full my-4">
            <Label className="text-base font-medium leading-[18px]">
              When <span className="text-red-500">*</span>
            </Label>
            <CustomSelect
              value={data.when}
              onChange={(val) => onChange("when", val)}
              options={whenOptions}
              placeholder="Select When"
            />
          </div>

          {/* Where */}
          <div className="flex flex-col gap-2 w-full my-4">
            <Label className="text-base font-medium leading-[18px]">
              Where <span className="text-red-500">*</span>
            </Label>
            <CustomSelect
              value={data.addressId}
              onChange={(val) => onChange("addressId", val)}
              options={DEMO_ADDRESSES}
              placeholder="Select Location"
            />
            <p className="text-[#18181899]">Select the location for this service.</p>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {/* Job Type */}
          <div>
            <p className="leading-14 font-medium text-base">
              Job Type <span className="text-red-500">*</span>
            </p>
            <p className="text-[#18181899]">Pick the job type that matches your service need.</p>
          </div>
          <div className="flex flex-col gap-9 py-4">
            <div className="flex flex-col gap-6">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="jobType"
                  value="one-time"
                  checked={data.jobType === "one-time"}
                  onChange={() => onChange("jobType", "one-time")}
                  className="mt-0.5 h-[18px] w-[18px] shrink-0 text-[#005864] focus:ring-[#005864]"
                />
                <span className="text-base font-normal leading-[22px] text-[#181818]">One-Time Job</span>
              </label>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="jobType"
                  value="recurring"
                  checked={data.jobType === "recurring"}
                  onChange={() => onChange("jobType", "recurring")}
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#005864] focus:ring-[#005864]"
                />
                <span className="text-base font-normal leading-5 text-black">Recurring Job</span>
              </label>
            </div>

            {/* Contact Preferences */}
            <div className="flex flex-col gap-3.5">
              <h3 className="font-medium text-base leading-[22px] text-black">
                Contact Preferences <span className="text-red-500">*</span>
              </h3>
              <p className="text-[#18181899] text-base">Select your preferred way to be contacted.</p>
              <div className="mt-2 flex flex-col gap-5">
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={data.contactCall}
                    onChange={(e) => onChange("contactCall", e.target.checked)}
                    className="h-[18px] w-[18px] rounded text-[#005864] focus:ring-[#005864]"
                  />
                  <span className="text-base font-normal text-[#181818]">Call/Text</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={data.contactEmail}
                    onChange={(e) => onChange("contactEmail", e.target.checked)}
                    className="h-[18px] w-[18px] rounded text-[#005864] focus:ring-[#005864]"
                  />
                  <span className="text-base font-normal text-[#181818]">Email</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-12">
            <button
              type="button"
              onClick={onNext}
              className="h-12 w-full md:w-auto md:min-w-[230px] rounded-xl bg-[#005864] px-6 text-base font-semibold text-white transition hover:bg-[#004a52] cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
