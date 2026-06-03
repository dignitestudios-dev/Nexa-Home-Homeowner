"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface CategoryCardProps {
  id: string;
  title: string;
  imageSrc?: string;
}

export function CategoryCard({ id, title, imageSrc }: CategoryCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/find-expert?categoryId=${encodeURIComponent(id)}&categoryName=${encodeURIComponent(title)}`);
  };
  return (
    <div
      onClick={handleClick}
      className="overflow-hidden rounded-[4px] bg-white cursor-pointer hover:shadow-md transition-shadow duration-200"
    >
      {/* Image area */}
      {imageSrc ? (
        <div className="relative mx-3 mt-3 h-[211px] rounded-[2px] overflow-hidden">
          <Image src={imageSrc} alt={title} fill className="object-cover" />
        </div>
      ) : (
        <div className="mx-3 mt-3 h-[211px] rounded-[2px] bg-[#BDBCBC]" />
      )}

      {/* Title */}
      <div className="px-3 pt-3 pb-4">
        <p className="text-[16px] font-medium leading-[22px] capitalize text-[#1C1C1C]">
          {title}
        </p>
      </div>
    </div>
  );
}
