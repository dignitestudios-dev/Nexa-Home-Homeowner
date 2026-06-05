import { User } from "lucide-react";

interface ReviewCardProps {
  name: string;
  date: string;
  review: string;
  image?: string;
}

export default function ReviewCard({ name, date, review, image }: ReviewCardProps) {
  return (
    <div className="relative w-full pt-10">
      {/* Avatar */}
      <div className="absolute left-5 top-0 z-10">
        <div className="h-[122px] w-[122px] overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
          {image ? (
            <img src={image} alt={name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-300">
              <User className="h-12 w-12 text-white" />
            </div>
          )}
        </div>
      </div>

      {/* Card */}
      <div className="rounded-[34px] bg-[#eaf0f1] px-5 pb-5 pt-2 text-black">
        <div className="ml-[130px]">
          <h3 className="text-[20px] font-bold leading-[25px]">{name}</h3>
          <p className="mt-1 text-[16px]   font-semibold  text-black/70">{date}</p>
        </div>
        <p className="mt-8 text-[16px] font-semibold leading-[26px] text-black/50">{review}</p>
      </div>
    </div>
  );
}
