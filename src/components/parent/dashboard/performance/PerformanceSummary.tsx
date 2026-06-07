import type { TrendPoint } from "./types";
import TrendIndicator from "./TrendIndicator";

export default function PerformanceSummary({ trend }: { trend: TrendPoint[] }) {
  const latestAvg = trend.length ? trend[trend.length - 1].average : null;
  const maxAvg = Math.max(...trend.map((t) => t.average));
  const bestTerm = trend.find((t) => t.average === maxAvg)?.term;

  return (
    <div className="flex gap-[20px]">
      <div className="flex flex-1 flex-col gap-[4px] rounded-[10px] border border-[#e0e0e0] px-[24px] py-[18px]">
        <p className="text-[12px] text-[#888]">Latest average</p>
        <div className="flex items-end gap-[10px]">
          <p className="text-[28px] font-semibold text-[#1b1b1b]">
            {latestAvg?.toFixed(1)}
            <span className="text-[16px] font-normal text-[#aaa]">/100</span>
          </p>
          <div className="mb-[4px]">
            <TrendIndicator data={trend} />
          </div>
        </div>
        <p className="text-[12px] text-[#aaa]">vs. previous term</p>
      </div>
      <div className="flex flex-1 flex-col gap-[4px] rounded-[10px] border border-[#e0e0e0] px-[24px] py-[18px]">
        <p className="text-[12px] text-[#888]">Terms tracked</p>
        <p className="text-[28px] font-semibold text-[#1b1b1b]">
          {trend.length}
        </p>
        <p className="text-[12px] text-[#aaa]">since {trend[0]?.term}</p>
      </div>
      <div className="flex flex-1 flex-col gap-[4px] rounded-[10px] border border-[#e0e0e0] px-[24px] py-[18px]">
        <p className="text-[12px] text-[#888]">Highest average</p>
        <p className="text-[28px] font-semibold text-[#1b1b1b]">
          {maxAvg.toFixed(1)}
          <span className="text-[16px] font-normal text-[#aaa]">/100</span>
        </p>
        <p className="text-[12px] text-[#aaa]">{bestTerm}</p>
      </div>
    </div>
  );
}
