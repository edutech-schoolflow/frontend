"use client";

import { Printer, UserRound } from "lucide-react";
import type { Report } from "@/src/types/grade";
import { formatCurrency } from "../fees/feeUtils";
import {
  traitLabel,
  ordinal,
  attendanceRate,
  formatReportDate,
} from "./reportUtils";
import GradeBadge from "./GradeBadge";
import DotRating from "./DotRating";

export default function ReportView({ report }: { report: Report }) {
  const rate = report.attendanceDays
    ? attendanceRate(report.presentDays ?? 0, report.attendanceDays)
    : null;

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-start justify-between rounded-[10px] border border-[#ccc] bg-white px-[28px] py-[24px]">
        <div className="flex items-center gap-[16px]">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#1ca95c]/10">
            <UserRound className="h-[28px] w-[28px] text-[#1ca95c]" />
          </div>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[18px] font-semibold text-[#1b1b1b]">
              {report.studentName}
            </p>
            <p className="text-[13px] text-[#666]">
              {report.className} · {report.termName} · {report.academicYear}
            </p>
            <p className="text-[13px] text-[#666]">Greenfield Academy</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-[4px]">
          {report.overallPosition && report.totalStudentsInClass && (
            <div className="rounded-[6px] bg-[#1ca95c] px-[16px] py-[8px] text-center">
              <p className="text-[20px] font-bold text-white leading-none">
                {ordinal(report.overallPosition)}
              </p>
              <p className="text-[11px] text-white/80">
                of {report.totalStudentsInClass} students
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={() => window.print()}
            className="mt-[4px] flex items-center gap-[6px] rounded-[6px] border border-[#ccc] px-[14px] py-[7px] text-[13px] text-[#666] transition-colors hover:border-[#1b1b1b] hover:text-[#1b1b1b]"
          >
            <Printer className="h-[14px] w-[14px]" />
            Print
          </button>
        </div>
      </div>

      {report.overallAverage !== undefined && (
        <div className="grid grid-cols-3 gap-[16px]">
          {[
            {
              label: "Overall average",
              value: `${report.overallAverage.toFixed(1)}%`,
            },
            {
              label: "Class position",
              value: report.overallPosition
                ? `${ordinal(report.overallPosition)} / ${report.totalStudentsInClass}`
                : "—",
            },
            {
              label: "Attendance rate",
              value: rate !== null ? `${rate}%` : "—",
            },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-[10px] border border-[#ccc] bg-white px-[20px] py-[16px]"
            >
              <p className="text-[12px] text-[#888]">{label}</p>
              <p className="mt-[4px] text-[22px] font-semibold text-[#1b1b1b]">
                {value}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-[10px] border border-[#ccc] bg-white px-[28px] py-[24px]">
        <p className="mb-[16px] text-[15px] font-semibold text-[#1b1b1b]">
          Academic performance
        </p>
        <div className="grid grid-cols-[1fr_70px_70px_80px_90px_70px_70px] gap-[4px] border-b border-[#eee] pb-[8px] text-[12px] text-[#aaa]">
          <span>Subject</span>
          <span className="text-center">CA1 /40</span>
          <span className="text-center">CA2 /40</span>
          <span className="text-center">Exam /60</span>
          <span className="text-center">Total /100</span>
          <span className="text-center">Grade</span>
          <span className="text-center">Position</span>
        </div>
        {report.grades.map((g) => (
          <div
            key={g.id}
            className="grid grid-cols-[1fr_70px_70px_80px_90px_70px_70px] items-center gap-[4px] border-b border-[#f5f5f5] py-[13px] last:border-0"
          >
            <p className="text-[14px] text-[#1b1b1b]">{g.subjectName}</p>
            <p className="text-center text-[14px] text-[#1b1b1b]">
              {g.ca1 ?? "—"}
            </p>
            <p className="text-center text-[14px] text-[#1b1b1b]">
              {g.ca2 ?? "—"}
            </p>
            <p className="text-center text-[14px] text-[#1b1b1b]">
              {g.examScore ?? "—"}
            </p>
            <p className="text-center text-[14px] font-medium text-[#1b1b1b]">
              {g.totalScore ?? "—"}
            </p>
            <div className="flex justify-center">
              {g.grade ? (
                <GradeBadge grade={g.grade} />
              ) : (
                <span className="text-[#aaa]">—</span>
              )}
            </div>
            <p className="text-center text-[14px] text-[#888]">
              {g.position ? ordinal(g.position) : "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-[20px]">
        <div className="flex flex-col gap-[20px]">
          <div className="rounded-[10px] border border-[#ccc] bg-white px-[24px] py-[20px]">
            <p className="mb-[16px] text-[15px] font-semibold text-[#1b1b1b]">
              Behavioural assessment
            </p>
            <div className="flex flex-col gap-[12px]">
              {report.behavioralRatings.map((r) => (
                <div
                  key={r.trait}
                  className="flex items-center justify-between"
                >
                  <p className="text-[13px] text-[#444]">
                    {traitLabel(r.trait)}
                  </p>
                  <DotRating score={r.score} />
                </div>
              ))}
            </div>
          </div>

          {report.attendanceDays !== undefined && (
            <div className="rounded-[10px] border border-[#ccc] bg-white px-[24px] py-[20px]">
              <p className="mb-[16px] text-[15px] font-semibold text-[#1b1b1b]">
                Attendance
              </p>
              <div className="grid grid-cols-4 gap-[8px]">
                {[
                  {
                    label: "Total",
                    value: report.attendanceDays,
                    color: "#1b1b1b",
                  },
                  {
                    label: "Present",
                    value: report.presentDays,
                    color: "#1ca95c",
                  },
                  {
                    label: "Absent",
                    value: report.absentDays,
                    color: "#e84040",
                  },
                  { label: "Late", value: report.lateDays, color: "#ff8d28" },
                ].map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center rounded-[8px] border border-[#eee] py-[12px]"
                  >
                    <p className="text-[20px] font-bold" style={{ color }}>
                      {value ?? 0}
                    </p>
                    <p className="text-[11px] text-[#888]">{label}</p>
                  </div>
                ))}
              </div>
              {rate !== null && (
                <div className="mt-[14px]">
                  <div className="mb-[4px] flex justify-between text-[12px] text-[#888]">
                    <span>Attendance rate</span>
                    <span>{rate}%</span>
                  </div>
                  <div className="h-[6px] w-full overflow-hidden rounded-full bg-[#eee]">
                    <div
                      className="h-full rounded-full bg-[#1ca95c]"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-[20px]">
          {report.teacherComment && (
            <div className="rounded-[10px] border border-[#ccc] bg-white px-[24px] py-[20px]">
              <p className="mb-[10px] text-[15px] font-semibold text-[#1b1b1b]">
                Class teacher&apos;s comment
              </p>
              <p className="text-[13px] leading-[1.6] text-[#444] italic">
                &ldquo;{report.teacherComment}&rdquo;
              </p>
            </div>
          )}
          {report.principalComment && (
            <div className="rounded-[10px] border border-[#ccc] bg-white px-[24px] py-[20px]">
              <p className="mb-[10px] text-[15px] font-semibold text-[#1b1b1b]">
                Principal&apos;s comment
              </p>
              <p className="text-[13px] leading-[1.6] text-[#444] italic">
                &ldquo;{report.principalComment}&rdquo;
              </p>
            </div>
          )}
          {(report.nextTermResumption || report.nextTermFees) && (
            <div className="rounded-[10px] border border-[#1ca95c]/30 bg-[#f0faf5] px-[24px] py-[20px]">
              <p className="mb-[14px] text-[15px] font-semibold text-[#1b1b1b]">
                Next term
              </p>
              <div className="flex flex-col gap-[10px]">
                {report.nextTermResumption && (
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] text-[#666]">Resumption date</p>
                    <p className="text-[13px] font-medium text-[#1b1b1b]">
                      {formatReportDate(report.nextTermResumption)}
                    </p>
                  </div>
                )}
                {report.nextTermFees !== undefined && (
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] text-[#666]">Next term fees</p>
                    <p className="text-[13px] font-semibold text-[#1ca95c]">
                      {formatCurrency(report.nextTermFees)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
