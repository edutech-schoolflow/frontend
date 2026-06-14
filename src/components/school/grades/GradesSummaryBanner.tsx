import { Zap, CheckCircle2 } from "lucide-react";

interface Props {
  pendingCount: number;
  onPublishAll: () => void;
  publishingAll: boolean;
}

export default function GradesSummaryBanner({
  pendingCount,
  onPublishAll,
  publishingAll,
}: Props) {
  if (pendingCount === 0) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-[12px] border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-3.5">
        <CheckCircle2 className="h-[16px] w-[16px] shrink-0 text-[#16a34a]" />
        <p className="text-[13px] font-medium text-[#15803d]">
          All submitted records are published. Parents can see the latest
          results.
        </p>
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-center justify-between gap-4 rounded-[12px] border border-[#fde68a] bg-[#fffbeb] px-5 py-3.5">
      <div className="flex items-center gap-3">
        <Zap className="h-[16px] w-[16px] shrink-0 text-[#b45309]" />
        <p className="text-[13px] font-medium text-[#92400e]">
          <span className="font-bold">
            {pendingCount} record{pendingCount !== 1 ? "s" : ""}
          </span>{" "}
          submitted by teachers but not yet published to parents.
        </p>
      </div>
      <button
        onClick={onPublishAll}
        disabled={publishingAll}
        className="shrink-0 flex items-center gap-1.5 rounded-[8px] bg-[#b45309] px-4 py-2 text-[12px] font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
      >
        <Zap className="h-[12px] w-[12px]" />
        {publishingAll ? "Publishing…" : "Publish all"}
      </button>
    </div>
  );
}
