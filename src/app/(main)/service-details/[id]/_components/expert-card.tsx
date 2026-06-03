"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUpdateJobStatus } from "@/features/user/hooks";

interface ExpertCardProps {
  id: string;
  jobId: string;
  name: string;
  location: string;
  rating: number;
  profilePicture?: string;
}

export function ExpertCard({ id, jobId, name, location, rating, profilePicture }: ExpertCardProps) {
  const router = useRouter();
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  const { mutate: acceptExpert, isPending } = useUpdateJobStatus();

  const handleProfileClick = () => {
    const qs = new URLSearchParams({
      name,
      location,
      rating: String(rating),
      ...(profilePicture ? { picture: profilePicture } : {}),
    });
    router.push(`/provider/${id}?${qs.toString()}`);
  };

  return (
    <div className="bg-white rounded-[12px] p-5">
      {/* Profile Section */}
      <div
        className="flex items-start gap-4 mb-4 cursor-pointer"
        onClick={handleProfileClick}
      >
        <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 bg-[#E5E5E5]">
          {profilePicture ? (
            <Image src={profilePicture} alt={name} fill className="object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center text-lg font-semibold text-[#005864]">
              {name?.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-black truncate hover:text-[#005864] transition-colors">{name}</h3>
          <div className="flex items-center gap-1.5 mt-1">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < fullStars
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
          <p className="text-sm text-[rgba(24,24,24,0.8)] mt-1 truncate">{location}</p>
        </div>
      </div>

      <Button
        disabled={isPending}
        onClick={() => acceptExpert({ jobId, providerId: id })}
        className="w-full h-12 rounded-[12px] bg-[#005864] hover:bg-[#004752] text-white font-bold text-base transition-colors"
      >
        {isPending ? "Selecting..." : "Select Expert"}
      </Button>
    </div>
  );
}
