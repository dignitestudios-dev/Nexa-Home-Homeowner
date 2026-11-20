import Link from "next/link";
import { Trash2 } from "lucide-react";

type ServiceCardProps = {
  id: string;
  serviceName: string;
  description: string;
  status: "Ongoing" | "Completed" | "Ready";
  postedDate: string;
  actionText: string;
  when: string;
  disableLink?: boolean;
  onDelete?: (e: React.MouseEvent, id: string) => void;
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
  when,
  disableLink = false,
  onDelete,
}: ServiceCardProps) {
  const isGreenBorder =
    actionText?.trim().toLowerCase() === "confirm expert" ||
    actionText?.trim().toLowerCase() === "awaiting response" ||
    status?.trim().toLowerCase() === "confirm expert" ||
    status?.trim().toLowerCase() === "awaiting response";

  const cardContent = (
    <>
      {/* Badge & Optional Delete */}
      <div className="absolute right-3 top-3 flex items-center gap-2">
        {onDelete && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(e, id);
            }}
            className="flex size-[34px] items-center justify-center rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            title="Delete Job"
          >
            <Trash2 className="size-4" strokeWidth={1.8} />
          </button>
        )}
        <div
          className={`flex h-[34px] min-w-[80px] items-center justify-center rounded-full px-[10px] py-[6px] ${getBadgeStyle(actionText, status)}`}
        >
          <span className="text-[14px] font-bold leading-[22px]">
            {actionText}
          </span>
        </div>
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
      <div className="absolute bottom-[10px] left-1/2 flex h-[58px] w-[calc(100%-24px)] -translate-x-1/2 items-center rounded-[12px] bg-[rgba(0,88,100,0.06)]">
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
    </>
  );

  const containerClasses = `relative w-full h-[168px] rounded-[12px] bg-[#fffbfb] p-4 transition-all ${
    isGreenBorder ? "border-2 border-[#005864]" : "border-2 border-transparent"
  }`;

  if (disableLink) {
    return <div className={containerClasses}>{cardContent}</div>;
  }

  return (
    <Link href={`/service-details/${id}`} className={containerClasses}>
      {cardContent}
    </Link>
  );
}