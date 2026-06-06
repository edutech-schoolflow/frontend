import type { Grade } from "@/src/types/grade";
import GradeBadge from "../report/GradeBadge";

export default function SubjectBreakdown({ grades }: { grades: Grade[] }) {
  const sorted = [...grades].sort(
    (a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0)
  );
  const top3 = sorted.slice(0, 3);
  const bottom2 = sorted.slice(-2).reverse();

  return (
    <div className="grid grid-cols-2 gap-[16px]">
      <div className="rounded-[10px] border border-[#d4f0e1] bg-[#f0faf5] px-[20px] py-[18px]">
        <p className="mb-[14px] text-[12px] font-medium text-[#1ca95c]">
          STRONGEST SUBJECTS
        </p>
        <div className="flex flex-col gap-[12px]">
          {top3.map((g) => (
            <div key={g.id} className="flex items-center justify-between">
              <p className="text-[14px] text-[#1b1b1b]">{g.subjectName}</p>
              <div className="flex items-center gap-[8px]">
                <span className="text-[14px] font-semibold text-[#1b1b1b]">
                  {g.totalScore ?? "—"}
                </span>
                {g.grade && <GradeBadge grade={g.grade} />}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-[10px] border border-[#fde8d4] bg-[#fff8f3] px-[20px] py-[18px]">
        <p className="mb-[14px] text-[12px] font-medium text-[#ff8d28]">
          NEEDS IMPROVEMENT
        </p>
        <div className="flex flex-col gap-[12px]">
          {bottom2.map((g) => (
            <div key={g.id} className="flex items-center justify-between">
              <p className="text-[14px] text-[#1b1b1b]">{g.subjectName}</p>
              <div className="flex items-center gap-[8px]">
                <span className="text-[14px] font-semibold text-[#1b1b1b]">
                  {g.totalScore ?? "—"}
                </span>
                {g.grade && <GradeBadge grade={g.grade} />}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
