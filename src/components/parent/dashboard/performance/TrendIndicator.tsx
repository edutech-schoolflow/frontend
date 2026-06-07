import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { TrendPoint } from "./types";

export default function TrendIndicator({ data }: { data: TrendPoint[] }) {
  if (data.length < 2) return null;
  const last = data[data.length - 1].average;
  const prev = data[data.length - 2].average;
  const diff = last - prev;
  if (diff > 0)
    return (
      <span className="flex items-center gap-[4px] text-[13px] font-medium text-[#1ca95c]">
        <TrendingUp className="h-[14px] w-[14px]" />+{diff.toFixed(1)}
      </span>
    );
  if (diff < 0)
    return (
      <span className="flex items-center gap-[4px] text-[13px] font-medium text-[#e53e3e]">
        <TrendingDown className="h-[14px] w-[14px]" />
        {diff.toFixed(1)}
      </span>
    );
  return (
    <span className="flex items-center gap-[4px] text-[13px] text-[#888]">
      <Minus className="h-[14px] w-[14px]" />
      No change
    </span>
  );
}
