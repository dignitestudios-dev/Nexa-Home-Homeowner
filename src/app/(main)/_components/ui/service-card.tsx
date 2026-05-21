import Link from "next/link";

type ServiceCardProps = {
  serviceName: string;
  description: string;
  status: "Ongoing" | "Completed" | "Ready";
  postedDate: string;
  actionText: string;
};

const statusStyles = {
  Ongoing: "bg-[#3D74FF]",
  Completed: "bg-emerald-500",
  Ready: "bg-amber-500",
};

export default function ServiceCard({
  serviceName,
  description,
  status,
  postedDate,
  actionText,
}: ServiceCardProps) {
  return (
    <Link href="/service-details/1" className="relative w-[396px] h-[168px] rounded-[12px] bg-[#F8F8F8] p-4">
      {/* Badge */}
      <div
        className={`absolute right-2 top-2 flex h-[34px] min-w-[80px] items-center justify-center rounded-full px-[10px] py-[6px] ${statusStyles[status]}`}
      >
        <span className="text-[14px] font-bold leading-[22px] text-white">
          {status}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[18px] font-semibold leading-[23px] text-[#1C1C1C]">
        {serviceName}
      </h3>

      {/* Description */}
      <p className="mt-3 line-clamp-2 text-[16px] leading-[22px] text-[rgba(24,24,24,0.8)]">
        {description}
      </p>

      {/* Bottom section */}
      <div className="absolute bottom-[10px] left-1/2 flex h-[58px] w-[380px] -translate-x-1/2 items-center rounded-[12px] bg-[rgba(0,88,100,0.06)]">
        <div className="px-6">
          <p className="text-[12px] text-[#1C1C1C]">
            Date Posted
          </p>

          <p className="text-[16px] font-bold text-[#1C1C1C]">
            {postedDate}
          </p>
        </div>

        <div className="h-9 w-px rounded bg-[rgba(194,194,194,0.25)]" />

        <div className="flex flex-1 justify-center">
          <span className="text-[16px] font-bold text-[#005864]">
            {actionText}
          </span>
        </div>
      </div>
    </Link>
  );
}