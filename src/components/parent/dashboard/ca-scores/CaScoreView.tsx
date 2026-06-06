import type { Grade } from "@/src/types/grade";
import GradeBadge from "../report/GradeBadge";

function caTotal(g: Grade) {
  return (g.ca1 ?? 0) + (g.ca2 ?? 0);
}

function caGrade(total: number): string {
  const pct = Math.round((total / 40) * 100);
  if (pct >= 70) return "A";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}

export default function CaScoreView({
  grades,
  terms,
  selectedTerm,
  onTermChange,
}: {
  grades: Grade[];
  terms: string[];
  selectedTerm: string;
  onTermChange: (t: string) => void;
}) {
  const totals = grades.map(caTotal);
  const best = grades.length
    ? grades.reduce((a, b) => (caTotal(a) > caTotal(b) ? a : b))
    : null;
  const weakest = grades.length
    ? grades.reduce((a, b) => (caTotal(a) < caTotal(b) ? a : b))
    : null;

  return (
    <>
      <div className="mb-[24px] flex items-center justify-between">
        <select
          value={selectedTerm}
          onChange={(e) => onTermChange(e.target.value)}
          className="h-[40px] rounded-[8px] border border-[#ccc] bg-white px-[14px] text-[14px] text-[#1b1b1b] focus:outline-none focus:ring-2 focus:ring-[#1ca95c]/30"
        >
          {terms.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <div className="flex gap-[24px]">
          <div className="text-right">
            <p className="text-[11px] text-[#888]">Subjects</p>
            <p className="text-[20px] font-semibold text-[#1b1b1b]">
              {grades.length}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-[#888]">Avg CA score</p>
            <p className="text-[20px] font-semibold text-[#1b1b1b]">
              {grades.length
                ? (totals.reduce((s, v) => s + v, 0) / grades.length).toFixed(1)
                : "—"}
              <span className="text-[13px] font-normal text-[#aaa]">/40</span>
            </p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-[#e0e0e0]">
        <table className="w-full text-left text-[14px]">
          <thead>
            <tr className="bg-[#f9f9f9] text-[12px] text-[#888]">
              <th className="px-[20px] py-[14px] font-medium">Subject</th>
              {[
                { h: "CA1", max: 20 },
                { h: "CA2", max: 20 },
                { h: "Total", max: 40 },
              ].map(({ h, max }) => (
                <th
                  key={h}
                  className="px-[20px] py-[14px] text-center font-medium"
                >
                  {h}
                  <span className="ml-[4px] text-[10px] text-[#bbb]">
                    /{max}
                  </span>
                </th>
              ))}
              <th className="px-[20px] py-[14px] text-center font-medium">
                Grade
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {grades.map((g) => {
              const total = caTotal(g);
              return (
                <tr key={g.id} className="bg-white hover:bg-[#fafafa]">
                  <td className="px-[20px] py-[16px] font-medium text-[#1b1b1b]">
                    {g.subjectName}
                  </td>
                  <td className="px-[20px] py-[16px] text-center text-[#444]">
                    {g.ca1 ?? "—"}
                  </td>
                  <td className="px-[20px] py-[16px] text-center text-[#444]">
                    {g.ca2 ?? "—"}
                  </td>
                  <td className="px-[20px] py-[16px] text-center font-semibold text-[#1b1b1b]">
                    {total}
                  </td>
                  <td className="px-[20px] py-[16px] text-center">
                    <GradeBadge grade={caGrade(total)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {grades.length > 0 && (
        <div className="mt-[20px] flex gap-[16px]">
          {best && (
            <div className="flex-1 rounded-[10px] border border-[#d4f0e1] bg-[#f0faf5] px-[20px] py-[16px]">
              <p className="text-[11px] font-medium text-[#1ca95c]">
                BEST PERFORMANCE
              </p>
              <p className="mt-[4px] text-[15px] font-semibold text-[#1b1b1b]">
                {best.subjectName}
              </p>
              <p className="text-[13px] text-[#666]">
                {caTotal(best)}/40 ·{" "}
                <span className="font-medium">{caGrade(caTotal(best))}</span>
              </p>
            </div>
          )}
          {weakest && weakest.id !== best?.id && (
            <div className="flex-1 rounded-[10px] border border-[#fde8d4] bg-[#fff8f3] px-[20px] py-[16px]">
              <p className="text-[11px] font-medium text-[#ff8d28]">
                NEEDS IMPROVEMENT
              </p>
              <p className="mt-[4px] text-[15px] font-semibold text-[#1b1b1b]">
                {weakest.subjectName}
              </p>
              <p className="text-[13px] text-[#666]">
                {caTotal(weakest)}/40 ·{" "}
                <span className="font-medium">{caGrade(caTotal(weakest))}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
