"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Printer, UserRound } from "lucide-react";
import { getChildProfiles } from "@/src/lib/api/parents";
import { getParentReportsByChild } from "@/src/lib/api/grades";
import type { ChildProfile } from "@/src/types/parent";
import type { Report } from "@/src/types/grade";
import { formatCurrency } from "../fees/feeUtils";
import {
  gradeStyle,
  traitLabel,
  ordinal,
  attendanceRate,
  formatReportDate,
} from "./reportUtils";

// ─── grade badge ──────────────────────────────────────────────────────────────

function GradeBadge({ grade }: { grade: string }) {
  const { bg, text } = gradeStyle(grade);
  return (
    <span
      className="inline-flex items-center justify-center rounded-[4px] px-[10px] py-[2px] text-[12px] font-semibold"
      style={{ backgroundColor: bg, color: text }}
    >
      {grade}
    </span>
  );
}

// ─── dot rating ───────────────────────────────────────────────────────────────

function DotRating({ score, max = 5 }: { score: number; max?: number }) {
  return (
    <div className="flex gap-[4px]">
      {Array.from({ length: max }).map((_, i) => (
        <div
          key={i}
          className="h-[8px] w-[8px] rounded-full"
          style={{ backgroundColor: i < score ? "#1ca95c" : "#e0e0e0" }}
        />
      ))}
    </div>
  );
}

// ─── full report view ─────────────────────────────────────────────────────────

function ReportView({ report }: { report: Report }) {
  const rate = report.attendanceDays
    ? attendanceRate(report.presentDays ?? 0, report.attendanceDays)
    : null;

  return (
    <div className="flex flex-col gap-[20px]">
      {/* Header card */}
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

      {/* Summary stats */}
      {report.overallAverage !== undefined && (
        <div className="grid grid-cols-3 gap-[16px]">
          <div className="rounded-[10px] border border-[#ccc] bg-white px-[20px] py-[16px]">
            <p className="text-[12px] text-[#888]">Overall average</p>
            <p className="mt-[4px] text-[22px] font-semibold text-[#1b1b1b]">
              {report.overallAverage.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-[10px] border border-[#ccc] bg-white px-[20px] py-[16px]">
            <p className="text-[12px] text-[#888]">Class position</p>
            <p className="mt-[4px] text-[22px] font-semibold text-[#1b1b1b]">
              {report.overallPosition
                ? `${ordinal(report.overallPosition)} / ${report.totalStudentsInClass}`
                : "—"}
            </p>
          </div>
          <div className="rounded-[10px] border border-[#ccc] bg-white px-[20px] py-[16px]">
            <p className="text-[12px] text-[#888]">Attendance rate</p>
            <p className="mt-[4px] text-[22px] font-semibold text-[#1b1b1b]">
              {rate !== null ? `${rate}%` : "—"}
            </p>
          </div>
        </div>
      )}

      {/* Academic performance */}
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

      {/* Bottom two columns */}
      <div className="grid grid-cols-2 gap-[20px]">
        {/* Left: behavioral + attendance */}
        <div className="flex flex-col gap-[20px]">
          {/* Behavioral assessment */}
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

          {/* Attendance */}
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

        {/* Right: comments */}
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

          {/* Next term */}
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

// ─── main ─────────────────────────────────────────────────────────────────────

export default function ParentReportCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [reportsByChild, setReportsByChild] = useState<
    Record<string, Report[]>
  >({});
  const [loading, setLoading] = useState(true);

  // URL is the source of truth — survives refresh and is shareable
  const selectedChildId = searchParams.get("childId") ?? "";
  const selectedTermName = searchParams.get("term") ?? "";

  function navigate(childId: string, term?: string) {
    const params = new URLSearchParams();
    params.set("childId", childId);
    if (term) params.set("term", term);
    router.replace(`${pathname}?${params.toString()}`);
  }

  useEffect(() => {
    getChildProfiles().then((profiles) => {
      setChildren(profiles);
      setLoading(false);
      if (!searchParams.get("childId") && profiles.length > 0) {
        navigate(profiles[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    const cached = reportsByChild[selectedChildId];
    if (cached) {
      if (!selectedTermName && cached.length > 0) {
        navigate(selectedChildId, cached[0].termName);
      }
      return;
    }
    getParentReportsByChild(selectedChildId).then((reports) => {
      setReportsByChild((prev) => ({ ...prev, [selectedChildId]: reports }));
      if (!selectedTermName && reports.length > 0) {
        navigate(selectedChildId, reports[0].termName);
      }
    });
  }, [selectedChildId]);

  const reports = reportsByChild[selectedChildId] ?? [];
  const activeReport =
    reports.find((r) => r.termName === selectedTermName) ?? null;

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#eee] border-t-[#1ca95c]" />
      </div>
    );
  }

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <h1 className="mb-[24px] text-[24px] font-medium text-[#1b1b1b]">
        Report card
      </h1>

      {/* Child tabs + term selector */}
      <div className="mb-[24px] flex items-center justify-between">
        <div className="flex rounded-[6px] border border-[#ccc] bg-white p-[3px]">
          {children.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => navigate(child.id)}
              className={`rounded-[4px] px-[16px] py-[6px] text-[13px] transition-colors ${
                selectedChildId === child.id
                  ? "bg-[#1ca95c] text-white"
                  : "text-[#666] hover:text-[#1b1b1b]"
              }`}
            >
              {child.firstName}
            </button>
          ))}
        </div>

        {reports.length > 0 && (
          <select
            value={selectedTermName}
            onChange={(e) => navigate(selectedChildId, e.target.value)}
            className="h-[36px] rounded-[6px] border border-[#ccc] bg-white px-[12px] text-[13px] text-[#1b1b1b] focus:outline-none"
          >
            {reports.map((r) => (
              <option key={r.id} value={r.termName}>
                {r.termName}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Content */}
      {!(selectedChildId in reportsByChild) ? (
        <div className="flex h-[200px] items-center justify-center">
          <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#eee] border-t-[#1ca95c]" />
        </div>
      ) : reports.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center rounded-[10px] border border-[#ccc] bg-white">
          <p className="text-[14px] text-[#888]">
            No published report cards yet.
          </p>
        </div>
      ) : activeReport ? (
        <ReportView report={activeReport} />
      ) : null}
    </div>
  );
}
