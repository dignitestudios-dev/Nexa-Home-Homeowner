import { Star } from "lucide-react";

interface ReviewCardProps {
  name: string;
  date: string;
  review: string;
  image?: string;
  stars?: number;
}

export default function ReviewCard({ name, date, review, stars = 5 }: ReviewCardProps) {
  const getDisplayName = (fullName: string) => {
    if (!fullName) return "";
    const parts = fullName.trim().split(/\s+/);
    if (parts.length > 1 && parts[1]) {
      return `${parts[0]} ${parts[1].slice(0, 1).toUpperCase()}`;
    }
    return parts[0];
  };

  return (
    <div className="relative w-full">
      {/* Card */}
      <div className="rounded-[34px] bg-[#eaf0f1] h-full px-5 pb-5 pt-6 text-black flex flex-col justify-between">
        <div>
          <h3 className="text-[20px] font-bold leading-[25px]">
            {getDisplayName(name)}
          </h3>
          <p className="mt-1 text-[16px] font-semibold text-black/70">{date}</p>

          {/* Stars below date */}
          <div className="flex items-center gap-1 mt-2">
            {Array.from({ length: 5 }).map((_, i) => {
              const fillAmount = Math.max(0, Math.min(1, (stars ?? 5) - i));
              return (
                <div key={i} className="relative size-4">
                  <Star size={16} className="text-[#C4C4C4] absolute inset-0" />
                  {fillAmount > 0 && (
                    <div
                      className="absolute inset-0 overflow-hidden"
                      style={{ width: `${fillAmount * 100}%` }}
                    >
                      <Star
                        size={16}
                        className="text-[#EDAF35] fill-[#EDAF35] absolute inset-0 max-w-none"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-[16px] break-words font-semibold leading-[26px] text-black/50">
            {review}
          </p>
        </div>
      </div>
    </div>
  );  
}

