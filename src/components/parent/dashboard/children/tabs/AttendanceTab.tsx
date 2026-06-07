"use client";

import { useEffect, useState } from "react";
import { getChildAttendance } from "@/src/lib/api/parents";
import type { AttendanceSummary } from "@/src/types/parent";
import Spinner from "./Spinner";

const STATS = [
  { key: "totalDays" as const, label: "School days", color: "#1b1b1b" },
  { key: "presentDays" as const, label: "Present", color: "#1ca95c" },
  { key: "absentDays" as const, label: "Absent", color: "#e53e3e" },
  { key: "lateDays" as const, label: "Late", color: "#f59e0b" },
];

export default function AttendanceTab({ studentId }: { studentId: string }) {
  const [records, setRecords] = useState<AttendanceSummary[] | undefined>(
    undefined
  );

  useEffect(() => {
    getChildAttendance(studentId).then(setRecords);
  }, [studentId]);

  if (records === undefined) return <Spinner />;
  if (records.length === 0)
    return (
      <p className="py-[48px] text-center text-[14px] text-[#888]">
        No attendance records available.
      </p>
    );

  return (
    <div className="flex flex-col gap-[16px]">
      {records.map((r) => {
        const pct = Math.round((r.presentDays / r.totalDays) * 100);
        const barColor =
          pct >= 80 ? "#1ca95c" : pct >= 60 ? "#f59e0b" : "#e53e3e";
        return (
          <div
            key={r.term}
            className="rounded-[10px] border border-[#e0e0e0] bg-white px-[24px] py-[20px]"
          >
            <div className="mb-[16px] flex items-center justify-between">
              <p className="text-[15px] font-medium text-[#1b1b1b]">{r.term}</p>
              <span
                className="text-[14px] font-semibold"
                style={{ color: barColor }}
              >
                {pct}%
              </span>
            </div>
            <div className="mb-[16px] h-[8px] w-full overflow-hidden rounded-full bg-[#eee]">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: barColor }}
              />
            </div>
            <div className="grid grid-cols-4 gap-[12px]">
              {STATS.map(({ key, label, color }) => (
                <div
                  key={key}
                  className="flex flex-col items-center rounded-[8px] bg-[#f9f9f9] py-[12px]"
                >
                  <span className="text-[18px] font-semibold" style={{ color }}>
                    {r[key]}
                  </span>
                  <span className="mt-[2px] text-[11px] text-[#888]">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
