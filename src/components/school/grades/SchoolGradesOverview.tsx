"use client";

import { useEffect, useState } from "react";
import { ChevronDown, CheckCircle2, Clock, BookOpen } from "lucide-react";
import {
  getGradesOverview,
  publishGradeRecord,
} from "@/src/lib/api/gradeEntry";
import type {
  GradesOverview,
  GradeSummaryRow,
  GradeTerm,
} from "@/src/types/scoreEntry";
import { TERM_LABELS, ASSESSMENT_LABELS } from "@/src/types/scoreEntry";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function PassBar({ pass, total }: { pass: number; total: number }) {
  const pct = total > 0 ? Math.round((pass / total) * 100) : 0;
  const color = pct >= 70 ? "#16a34a" : pct >= 50 ? "#d97706" : "#dc2626";
  return (
    <div className="flex items-center gap-2">
      <div className="h-[6px] w-[60px] overflow-hidden rounded-full bg-[#e5e7eb]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-[12px] text-text-body">{pct}%</span>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function SchoolGradesOverview() {
  const [selectedTerm, setSelectedTerm] = useState<GradeTerm>("second_term");
  const [overview, setOverview] = useState<GradesOverview | null>(null);
  const [dataKey, setDataKey] = useState("");
  const [publishing, setPublishing] = useState<string | null>(null); // recordId being published

  const loadingOverview = dataKey !== selectedTerm;

  useEffect(() => {
    let cancelled = false;
    getGradesOverview(selectedTerm).then((data) => {
      if (cancelled) return;
      setOverview(data);
      setDataKey(selectedTerm);
    });
    return () => {
      cancelled = true;
    };
  }, [selectedTerm]);

  const handlePublish = async (row: GradeSummaryRow) => {
    setPublishing(row.recordId);
    await publishGradeRecord(row.recordId);
    // Optimistic update — mark published in local state
    setOverview((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        totalPublished: prev.totalPublished + 1,
        rows: prev.rows.map((r) =>
          r.recordId === row.recordId ? { ...r, published: true } : r
        ),
      };
    });
    setPublishing(null);
  };

  const rows = overview?.rows ?? [];

  return (
    <div className="p-[30px]">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-text-heading">
            Grades &amp; Results
          </h1>
          <p className="mt-0.5 text-[14px] text-text-body">
            Review submitted scores and publish results to parents.
          </p>
        </div>

        {/* Term selector */}
        <div className="relative">
          <select
            value={selectedTerm}
            onChange={(e) => {
              setSelectedTerm(e.target.value as GradeTerm);
              setDataKey(""); // force reload
            }}
            className="h-[40px] appearance-none rounded-[8px] border border-[#e5e7eb] bg-white px-[14px] pr-[36px] text-[14px] text-text-heading focus:border-brand-green focus:outline-none"
          >
            {(Object.entries(TERM_LABELS) as [GradeTerm, string][]).map(
              ([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              )
            )}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-[12px] h-[16px] w-[16px] -translate-y-1/2 text-[#6b7280]" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-5">
          <p className="text-[13px] text-text-body">Records Submitted</p>
          <p className="mt-1 text-[28px] font-bold text-text-heading">
            {loadingOverview ? "—" : (overview?.totalSubmitted ?? 0)}
          </p>
        </div>
        <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-5">
          <p className="text-[13px] text-text-body">Published</p>
          <p className="mt-1 text-[28px] font-bold text-[#16a34a]">
            {loadingOverview ? "—" : (overview?.totalPublished ?? 0)}
          </p>
        </div>
        <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-5">
          <p className="text-[13px] text-text-body">Pending Publish</p>
          <p className="mt-1 text-[28px] font-bold text-[#d97706]">
            {loadingOverview
              ? "—"
              : (overview?.totalSubmitted ?? 0) -
                (overview?.totalPublished ?? 0)}
          </p>
        </div>
      </div>

      {/* Loading skeleton */}
      {loadingOverview && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[52px] animate-pulse rounded-[8px] bg-[#f3f4f6]"
            />
          ))}
        </div>
      )}

      {/* Records table */}
      {!loadingOverview && rows.length > 0 && (
        <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                <th className="py-3 pr-4 pl-5 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Class Arm
                </th>
                <th className="py-3 pr-4 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Subject
                </th>
                <th className="py-3 pr-4 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Assessment
                </th>
                <th className="py-3 pr-4 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Avg Score
                </th>
                <th className="py-3 pr-4 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Pass Rate
                </th>
                <th className="py-3 pr-4 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Submitted
                </th>
                <th className="py-3 pr-4 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Status
                </th>
                <th className="py-3 pr-5 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f3f4f6]">
              {rows.map((row) => (
                <tr
                  key={row.recordId}
                  className="bg-white transition-colors hover:bg-[#fafafa]"
                >
                  <td className="py-3.5 pr-4 pl-5">
                    <span className="text-[14px] font-medium text-text-heading">
                      {row.armName}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4 text-[14px] text-text-heading">
                    {row.subject}
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="rounded-[5px] bg-[#f3f4f6] px-2 py-0.5 text-[12px] font-medium text-text-body">
                      {ASSESSMENT_LABELS[row.assessmentType]}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <span className="text-[14px] font-semibold text-text-heading">
                      {row.averageScore}
                    </span>
                    <span className="text-[12px] text-[#9ca3af]">
                      /{row.maxScore}
                    </span>
                  </td>
                  <td className="py-3.5 pr-4">
                    <PassBar pass={row.passCount} total={row.totalCount} />
                  </td>
                  <td className="py-3.5 pr-4 text-[13px] text-text-body">
                    {formatDate(row.submittedAt)}
                  </td>
                  <td className="py-3.5 pr-4">
                    {row.published ? (
                      <span className="flex items-center gap-1 text-[12px] font-medium text-[#16a34a]">
                        <CheckCircle2 className="h-[13px] w-[13px]" />
                        Published
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[12px] font-medium text-[#d97706]">
                        <Clock className="h-[13px] w-[13px]" />
                        Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 pr-5">
                    {!row.published && (
                      <button
                        onClick={() => handlePublish(row)}
                        disabled={publishing === row.recordId}
                        className="rounded-[6px] bg-brand-green px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-90 disabled:opacity-50"
                      >
                        {publishing === row.recordId
                          ? "Publishing…"
                          : "Publish"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty state */}
      {!loadingOverview && rows.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-[12px] border border-dashed border-[#e5e7eb] py-16 text-center">
          <BookOpen className="h-[40px] w-[40px] text-[#d1d5db]" />
          <p className="text-[15px] font-medium text-text-heading">
            No scores submitted yet
          </p>
          <p className="max-w-[320px] text-[13px] text-text-body">
            Teachers submit scores from their portal. Once submitted, they will
            appear here for review and publishing.
          </p>
        </div>
      )}
    </div>
  );
}
