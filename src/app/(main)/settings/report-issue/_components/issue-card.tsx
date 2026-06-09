interface IssueCardProps {
  issueId?: string;
  title: string;
  description: string;
  date: string;
}

export default function IssueCard({
  issueId,
  title,
  description,
  date,
}: IssueCardProps) {
  return (
    <div className="w-full rounded-[12px] bg-[#005864]/6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[16px] font-medium text-[#1C1C1C]">
          Issue ID: {issueId}
        </p>

        <p className="text-[16px] font-medium text-[#1C1C1C]">
          {date}
        </p>
      </div>

      {/* Divider */}
      <div className="my-4 h-px w-full bg-[rgba(24,24,24,0.15)]" />

      {/* Title */}
      <h3 className="text-[18px] font-semibold text-[#1C1C1C]">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-3 line-clamp-2 text-[16px] leading-[26px] text-[rgba(24,24,24,0.6)]">
        {description}
      </p>
    </div>
  );
}