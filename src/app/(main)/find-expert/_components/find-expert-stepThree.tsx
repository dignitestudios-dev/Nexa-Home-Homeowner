"use client";

import Image from "next/image";
import { ArrowLeft, MapPin, Play, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Expert, StepOneData } from "../page";

const experts = [
  {
    name: "Boot Krewe Cleaner",
    location: "Greater New-Orleans Area",
    image: "https://picsum.photos/200/300",
  },
  {
    name: "Landscape Workshop",
    location: "Baton Rouge",
    image: "https://picsum.photos/200/300",
  },
  {
    name: "Makaira Landscape Pools",
    location: "Baton Rouge",
    image: "https://picsum.photos/200/300",
  },
  {
    name: "Supreme Fencing LLC",
    location: "Greater New-Orleans Area",
    image: "https://picsum.photos/200/300",
  },
  {
    name: "Boot Krewe Cleaner",
    location: "Greater New-Orleans Area",
    image: "https://picsum.photos/200/300",
  },
];

const infoItems = [
  {
    label: "Date Posted:",
    value: "12/02/26",
  },
  {
    label: "Status:",
    value: "Ready To Hire",
  },
  {
    label: "Job Type:",
    value: "One Time",
  },
  {
    label: "Contact Preferences:",
    value: "Email",
  },
];

interface StepThreeProps {
  stepOneData: StepOneData;
  selectedExperts: Expert[];
  onBack: () => void;
  onSubmit: () => void;
}

export default function SummaryForm({
  stepOneData,
  selectedExperts,
  onBack,
  onSubmit,
}: StepThreeProps) {
  const router = useRouter();
  return (
    <div className="min-h-screen ">
      <div className="max-w-[1400px] mx-auto rounded-[24px] py-2 ">
        {/* Header */}

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="flex items-center text-[#005864] hover:text-[#004750] transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-[32px] font-semibold">Summary</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_487px] gap-6">
          {/* LEFT CONTENT */}
          <div className="space-y-6">
            {/* Service Details */}
            <div className="bg-[#F9FAFA] rounded-[18px] p-6 lg:p-8">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#181818] capitalize">
                  Service Name
                </h2>

                <p className="text-base leading-[26px] text-[rgba(24,24,24,0.6)]">
                  Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus
                  laoreet enim faucibus vitae facilisi. Quis amet imperdiet ut
                  molestie luctus risus lacinia. Mauris vel mus at urna
                  vulputate aliquet eu. Lorem ipsum dolor sit amet consectetur.
                  Lorem ipsum dolor sit amet consectetur. Diam aliquet lectus
                  laoreet enim faucibus vitae facilisi. Quis amet imperdiet ut
                  molestie luctus risus lacinia. Mauris vel mus at urna
                  vulputate aliquet eu.
                </p>
              </div>
            </div>

            {/* Job Info */}
            <div className="bg-[#F9FAFA] rounded-[12px] p-6">
              <div className="space-y-5">
                {infoItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4"
                  >
                    <p className="text-base font-normal text-[rgba(24,24,24,0.6)]">
                      {item.label}
                    </p>

                    <p className="text-base font-medium text-[#005864]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div className="bg-[#F9FAFA] rounded-[12px] p-6">
              <h3 className="text-base font-semibold text-black mb-4">
                Attachment
              </h3>

              <div className="flex gap-4">
                {[1, 2, 3].map((item, index) => (
                  <div
                    key={item}
                    className="relative w-[70px] h-[70px] rounded-xl overflow-hidden"
                  >
                    <Image
                      src={`https://picsum.photos/200/200?random=${index + 1}`}
                      alt="attachment"
                      fill
                      className="object-cover"
                    />

                    {index === 2 && (
                      <div className="absolute inset-0 bg-[#005864]/40 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <Play className="w-3 h-3 text-white fill-white" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-[#F9FAFA] rounded-[12px] p-6">
              <div className="flex items-start justify-between gap-6 flex-col sm:flex-row">
                <div>
                  <h3 className="text-base font-semibold text-black mb-4">
                    Location
                  </h3>

                  <div className="space-y-2">
                    <p className="text-base font-medium text-[#282828]">
                      Office
                    </p>

                    <p className="text-base text-[#787878] max-w-[420px]">
                      123 Bay Street, Downtown Toronto, ON M5J 2X8, Canada
                    </p>
                  </div>
                </div>

                <Button className="h-[42px] rounded-md bg-[#005864] hover:bg-[#004752] px-5 text-white">
                  <MapPin className="w-4 h-4 mr-2" />
                  View on map
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="bg-[#F9FAFA] rounded-[18px] p-6 flex flex-col">
            <h2 className="text-[20px] font-bold text-[#181818] mb-6">
              Selected Experts
            </h2>

            <div className="space-y-4 flex-1">
              {experts.map((expert, index) => (
                <div
                  key={index}
                  className="border border-[#005864] bg-[rgba(0,88,100,0.06)] rounded-xl p-4 transition hover:shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0">
                      <Image
                        src={expert.image}
                        alt={expert.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-black">
                        {expert.name}
                      </h3>

                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-3 h-3 fill-[#EDAF35] text-[#EDAF35]"
                          />
                        ))}

                        <span className="ml-1 text-xs font-medium text-[#1C1C1C]">
                          4.5
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[rgba(24,24,24,0.8)]">
                        {expert.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <Button className="mt-8 h-12 rounded-xl bg-[#005864] hover:bg-[#004752] text-white text-base font-semibold">
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
