"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getChildProfiles } from "@/src/lib/api/parents";
import { getParentReportsByChild } from "@/src/lib/api/grades";
import type { ChildProfile } from "@/src/types/parent";
import type { Report } from "@/src/types/grade";
import ReportView from "./ReportView";

export default function ParentReportCard() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [reportsByChild, setReportsByChild] = useState<
    Record<string, Report[]>
  >({});
  const [loading, setLoading] = useState(true);

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
      if (!searchParams.get("childId") && profiles.length > 0)
        navigate(profiles[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    const cached = reportsByChild[selectedChildId];
    if (cached) {
      if (!selectedTermName && cached.length > 0)
        navigate(selectedChildId, cached[0].termName);
      return;
    }
    getParentReportsByChild(selectedChildId).then((reports) => {
      setReportsByChild((prev) => ({ ...prev, [selectedChildId]: reports }));
      if (!selectedTermName && reports.length > 0)
        navigate(selectedChildId, reports[0].termName);
    });
  }, [selectedChildId]);

  const reports = reportsByChild[selectedChildId] ?? [];
  const activeReport =
    reports.find((r) => r.termName === selectedTermName) ?? null;

  if (loading)
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#eee] border-t-[#1ca95c]" />
      </div>
    );

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <h1 className="mb-[24px] text-[24px] font-medium text-[#1b1b1b]">
        Report card
      </h1>

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
