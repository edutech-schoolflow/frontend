"use client";

const STATS = [
  {
    label: "Total submissions",
    color: "text-text-heading",
    bg: "bg-[#f9fafb]",
  },
  { label: "Pending review", color: "text-[#d97706]", bg: "bg-[#fffbeb]" },
  { label: "Approved", color: "text-[#16a34a]", bg: "bg-[#f0fdf4]" },
  { label: "Ready to print", color: "text-[#2563eb]", bg: "bg-[#eff6ff]" },
] as const;

export default function ExamStatsBar({
  total,
  pending,
  approved,
  finalized,
}: {
  total: number;
  pending: number;
  approved: number;
  finalized: number;
}) {
  const values = [total, pending, approved, finalized];

  return (
    <div className="mb-6 grid grid-cols-4 gap-4">
      {STATS.map((stat, i) => (
        <div key={stat.label} className={`rounded-[12px] ${stat.bg} px-5 py-4`}>
          <p className={`text-[28px] font-bold ${stat.color}`}>{values[i]}</p>
          <p className="mt-0.5 text-[13px] text-text-body">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
