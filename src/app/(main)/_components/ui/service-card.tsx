import Link from "next/link";

type ServiceCardProps = {
  id: string
  serviceName: string;
  description: string;
  status: "Ongoing" | "Completed" | "Ready";
  postedDate: string;
  actionText: string;
  when:string;
};

const tagStyles: Record<string, string> = {
  Ongoing: "bg-[#3D74FF] text-white",
  Completed: "bg-emerald-500 text-white",
  Ready: "bg-amber-500 text-white",
  "Confirm Expert": "bg-[#FF0000] text-white",
  "Awaiting Response": "bg-[#FFF300] text-black",
};

function getBadgeStyle(actionText: string, status: string) {
  return tagStyles[actionText] ?? tagStyles[status] ?? "bg-[#3D74FF]";
}

export default function ServiceCard({
  id,
  serviceName,
  description,
  status,
  postedDate,
  actionText,
  when
}: ServiceCardProps) {
  return (
    <Link href={`/service-details/${id}`} className="relative w-full lg:w-[396px] h-[168px] rounded-[12px] bg-[#F8F8F8] p-4">
      {/* Badge */}
      <div
        className={`absolute right-2 top-2 flex h-[34px] min-w-[80px] items-center justify-center rounded-full px-[10px] py-[6px] ${getBadgeStyle(actionText, status)}`}
      >
        <span className="text-[14px] font-bold leading-[22px] ">
          {actionText}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-[18px] line-clamp-1 w-[60%] break-all truncate font-semibold leading-[23px] text-[#1C1C1C]">
        {serviceName}
      </h3>

      {/* Description */}
      <p className="mt-3 line-clamp-2 text-[16px] break-all leading-[22px] text-[rgba(24,24,24,0.8)]">
        {description}
      </p>

      {/* Bottom section */}
      <div className="absolute bottom-[10px] left-1/2 flex h-[58px]   w-full lg:w-[380px] -translate-x-1/2 items-center rounded-[12px] bg-[rgba(0,88,100,0.06)]">
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
           {when}
          </span>
        </div>
      </div>
    </Link>
  );
}