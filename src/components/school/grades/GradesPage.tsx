"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen } from "lucide-react";
import {
  getGradesOverview,
  publishGradeRecord,
  publishAllForArm,
  publishAllForTerm,
} from "@/src/lib/api/gradeEntry";
import type { GradeSummaryRow, GradeTerm } from "@/src/types/scoreEntry";
import { buildGroups, filterGroups, totalPending } from "./grades.utils";
import type { StatusFilter } from "./grades.utils";
import GradesTopBar from "./GradesTopBar";
import GradesSummaryBanner from "./GradesSummaryBanner";
import ClassSection from "./ClassSection";

export default function GradesPage() {
  const [term, setTerm] = useState<GradeTerm>("second_term");
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [rows, setRows] = useState<GradeSummaryRow[]>([]);
  const [loadedTerm, setLoadedTerm] = useState<GradeTerm | null>(null);
  const loaded = loadedTerm === term;

  // Granular publish loading states
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [publishingArm, setPublishingArm] = useState<string | null>(null);
  const [publishingAll, setPublishingAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getGradesOverview(term).then((data) => {
      if (cancelled) return;
      setRows(data.rows);
      setLoadedTerm(term);
    });
    return () => {
      cancelled = true;
    };
  }, [term]);

  // Mark specific record IDs as published in local state
  const markPublished = useCallback((ids: string[]) => {
    setRows((prev) =>
      prev.map((r) =>
        ids.includes(r.recordId) ? { ...r, published: true } : r
      )
    );
  }, []);

  const handlePublishRecord = async (recordId: string) => {
    setPublishingId(recordId);
    await publishGradeRecord(recordId);
    markPublished([recordId]);
    setPublishingId(null);
  };

  const handlePublishArm = async (armId: string) => {
    setPublishingArm(armId);
    const ids = await publishAllForArm(armId, term);
    markPublished(ids);
    setPublishingArm(null);
  };

  const handlePublishAll = async () => {
    setPublishingAll(true);
    const ids = await publishAllForTerm(term);
    markPublished(ids);
    setPublishingAll(false);
  };

  const groups = buildGroups(rows);
  const visible = filterGroups(groups, filter);
  const pending = totalPending(groups);

  if (!loaded) {
    return (
      <div className="p-[30px]">
        <div className="mb-6 h-[32px] w-[180px] animate-pulse rounded-[8px] bg-[#f3f4f6]" />
        <div className="mb-4 h-[56px] animate-pulse rounded-[12px] bg-[#f3f4f6]" />
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="mb-3 h-[64px] animate-pulse rounded-[14px] bg-[#f3f4f6]"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="p-[30px]">
      <GradesTopBar
        term={term}
        onTermChange={(t) => {
          setTerm(t);
          setFilter("all");
        }}
        filter={filter}
        onFilterChange={setFilter}
      />

      <GradesSummaryBanner
        pendingCount={pending}
        onPublishAll={handlePublishAll}
        publishingAll={publishingAll}
      />

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-[#e5e7eb] py-[60px] text-center">
          <BookOpen className="h-[36px] w-[36px] text-[#d1d5db]" />
          <p className="text-[15px] font-medium text-text-heading">
            {filter === "pending"
              ? "No records pending publish"
              : filter === "published"
                ? "No published records yet"
                : "No scores submitted yet"}
          </p>
          <p className="max-w-[320px] text-[13px] text-text-body">
            {filter === "all"
              ? "Teachers submit scores from their portal. Once submitted they appear here for review and publishing."
              : `Try switching to the "All" filter to see everything.`}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((cls) => (
            <ClassSection
              key={cls.className}
              cls={cls}
              term={term}
              onPublish={handlePublishRecord}
              onPublishArm={handlePublishArm}
              publishingId={publishingId}
              publishingArm={publishingArm}
            />
          ))}
        </div>
      )}
    </div>
  );
}
