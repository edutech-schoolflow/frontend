"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getChildProfiles } from "@/src/lib/api/parents";
import {
  getChildPerformanceTrend,
  getParentReportsByChild,
} from "@/src/lib/api/grades";
import type { ChildProfile } from "@/src/types/parent";
import type { Grade } from "@/src/types/reportCard";
import type { TrendPoint } from "./types";
import ChildAvatar from "../shared/ChildAvatar";
import PerformanceSummary from "./PerformanceSummary";
import TrendChart from "./TrendChart";
import SubjectBreakdown from "./SubjectBreakdown";

export default function ParentPerformance() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const selectedChildId = searchParams.get("childId") ?? "";

  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [trendByChild, setTrendByChild] = useState<
    Record<string, TrendPoint[]>
  >({});
  const [subjectsByChild, setSubjectsByChild] = useState<
    Record<string, Grade[]>
  >({});

  function navigate(childId: string) {
    router.replace(`${pathname}?childId=${childId}`);
  }

  useEffect(() => {
    getChildProfiles().then((list) => {
      setChildren(list);
      if (!selectedChildId && list.length > 0) navigate(list[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    if (!trendByChild[selectedChildId]) {
      getChildPerformanceTrend(selectedChildId).then((data) =>
        setTrendByChild((prev) => ({ ...prev, [selectedChildId]: data }))
      );
    }
    if (!subjectsByChild[selectedChildId]) {
      getParentReportsByChild(selectedChildId).then((reports) => {
        const published = reports.filter((r) => r.status === "published");
        if (published.length > 0) {
          setSubjectsByChild((prev) => ({
            ...prev,
            [selectedChildId]: published[published.length - 1].grades,
          }));
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId]);

  const trend = trendByChild[selectedChildId] ?? [];
  const grades = subjectsByChild[selectedChildId] ?? [];
  const loading =
    selectedChildId &&
    (!trendByChild[selectedChildId] || !subjectsByChild[selectedChildId]);

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <h1 className="mb-[24px] text-[24px] font-medium text-[#1b1b1b]">
        Performance trend
      </h1>

      {children.length > 0 && (
        <div className="mb-[24px] flex gap-[8px]">
          {children.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => navigate(child.id)}
              className={`flex items-center gap-[8px] rounded-full px-[16px] py-[8px] text-[13px] font-medium transition-colors ${
                child.id === selectedChildId
                  ? "bg-[#1ca95c] text-white"
                  : "bg-[#f5f5f5] text-[#555] hover:bg-[#e8f5ee] hover:text-[#1ca95c]"
              }`}
            >
              <ChildAvatar child={child} />
              {child.firstName}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-[80px]">
          <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#1ca95c] border-t-transparent" />
        </div>
      ) : trend.length === 0 ? (
        <div className="flex flex-col items-center gap-[12px] py-[80px] text-center">
          <p className="text-[16px] font-medium text-[#1b1b1b]">
            No performance data yet
          </p>
          <p className="text-[14px] text-[#888]">
            Data will appear here after the first term results are published.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-[24px]">
          <PerformanceSummary trend={trend} />
          <TrendChart data={trend} />
          {grades.length > 0 && <SubjectBreakdown grades={grades} />}
        </div>
      )}
    </div>
  );
}
