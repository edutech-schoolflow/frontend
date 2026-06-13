"use client";

import { useEffect, useState } from "react";
import { Users, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { getAttendanceOverview } from "@/src/lib/api/attendance";
import type { AttendanceOverview } from "@/src/types/attendance";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function SchoolAttendanceOverview() {
  const [data, setData] = useState<AttendanceOverview | null>(null);
  const today = todayIso();

  useEffect(() => {
    getAttendanceOverview(today).then(setData);
  }, [today]);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  const submittedCount = data.arms.filter((a) => a.submitted).length;
  const pendingCount = data.arms.length - submittedCount;

  return (
    <div className="px-[32px] py-[28px] pb-[60px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Attendance
        </h1>
        <p className="mt-0.5 text-[13px] text-text-body">{formatDate(today)}</p>
      </div>

      {/* Pending notice */}
      {pendingCount > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-[10px] border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="h-[16px] w-[16px] shrink-0 text-amber-600" />
          <p className="text-[13px] text-amber-800">
            <strong>
              {pendingCount} class{" "}
              {pendingCount === 1 ? "arm has" : "arms have"} not submitted
            </strong>{" "}
            attendance yet today. Teachers mark attendance from their portal.
          </p>
        </div>
      )}

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: "Overall attendance",
            value: `${data.overallPresentPct}%`,
            icon: Users,
            accent: "bg-[#e8f5ee] text-brand-green",
          },
          {
            label: "Present today",
            value: data.totalPresent,
            icon: CheckCircle2,
            accent: "bg-[#e8f5ee] text-[#16a34a]",
          },
          {
            label: "Absent today",
            value: data.totalAbsent,
            icon: XCircle,
            accent: "bg-[#fce8e8] text-[#dc2626]",
          },
          {
            label: "Late today",
            value: data.totalLate,
            icon: Clock,
            accent: "bg-[#fff3e8] text-[#d97706]",
          },
        ].map(({ label, value, icon: Icon, accent }) => (
          <div
            key={label}
            className="flex flex-col gap-3 rounded-[12px] border border-[#e5e7eb] bg-white p-5"
          >
            <div className="flex items-center justify-between">
              <p className="text-[13px] text-text-body">{label}</p>
              <div
                className={`flex h-[34px] w-[34px] items-center justify-center rounded-[8px] ${accent}`}
              >
                <Icon className="h-[16px] w-[16px]" />
              </div>
            </div>
            <p className="text-[26px] font-semibold leading-none text-text-heading">
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Per-arm breakdown */}
      <div className="mb-6 overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
        <div className="border-b border-[#e5e7eb] bg-[#f9fafb] px-5 py-3.5">
          <h2 className="text-[14px] font-semibold text-text-heading">
            Attendance by class arm
          </h2>
        </div>

        {data.arms.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Users className="h-[28px] w-[28px] text-[#d1d5db]" />
            <p className="text-[13px] text-text-body">No classes set up yet.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f3f4f6]">
                {[
                  "Class arm",
                  "Present",
                  "Absent",
                  "Late",
                  "Total",
                  "Rate",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="py-3 px-4 text-left text-[11px] font-semibold uppercase tracking-wider text-text-body first:pl-5 last:pr-5"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {data.arms.map((arm) => (
                <tr
                  key={arm.armId}
                  className={!arm.submitted ? "opacity-50" : ""}
                >
                  <td className="py-3.5 pl-5 text-[13px] font-medium text-text-heading">
                    {arm.armName}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] font-medium text-[#16a34a]">
                    {arm.submitted ? arm.presentCount : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] font-medium text-[#dc2626]">
                    {arm.submitted ? arm.absentCount : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] font-medium text-[#d97706]">
                    {arm.submitted ? arm.lateCount : "—"}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-text-body">
                    {arm.totalCount}
                  </td>
                  <td className="px-4 py-3.5">
                    {arm.submitted ? (
                      <div className="flex items-center gap-2">
                        <div className="h-[6px] w-[60px] overflow-hidden rounded-full bg-[#f3f4f6]">
                          <div
                            className="h-full rounded-full bg-brand-green"
                            style={{ width: `${arm.presentPct}%` }}
                          />
                        </div>
                        <span className="text-[12px] text-text-body">
                          {arm.presentPct}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-[12px] text-text-body">—</span>
                    )}
                  </td>
                  <td className="py-3.5 pr-5">
                    {arm.submitted ? (
                      <span className="rounded-full bg-green-50 px-[8px] py-[3px] text-[11px] font-medium text-green-700">
                        Submitted
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#f3f4f6] px-[8px] py-[3px] text-[11px] font-medium text-text-body">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Absent students */}
      {data.absentStudents.length > 0 && (
        <div className="rounded-[12px] border border-[#e5e7eb] bg-white">
          <div className="border-b border-[#e5e7eb] bg-[#f9fafb] px-5 py-3.5">
            <h2 className="text-[14px] font-semibold text-text-heading">
              Absent today ({data.absentStudents.length})
            </h2>
          </div>
          <div className="divide-y divide-[#f3f4f6]">
            {data.absentStudents.map((s, i) => (
              <div key={i} className="flex items-center gap-3 px-5 py-3">
                <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-red-50 text-[11px] font-semibold text-[#dc2626]">
                  {s.studentName
                    .split(" ")
                    .slice(0, 2)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </div>
                <div>
                  <p className="text-[13px] font-medium text-text-heading">
                    {s.studentName}
                  </p>
                  <p className="text-[12px] text-text-body">{s.armName}</p>
                </div>
                <span className="ml-auto rounded-full bg-red-50 px-[8px] py-[2px] text-[11px] font-medium text-[#dc2626]">
                  Absent
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No data at all */}
      {submittedCount === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-[16px] border-2 border-dashed border-[#e5e7eb] bg-white py-[60px] text-center">
          <Clock className="h-[32px] w-[32px] text-[#d1d5db]" />
          <p className="text-[15px] font-semibold text-text-heading">
            No attendance submitted yet today
          </p>
          <p className="max-w-[340px] text-[13px] text-text-body">
            Teachers mark attendance from the teacher portal. Results will
            appear here once submitted.
          </p>
        </div>
      )}
    </div>
  );
}
