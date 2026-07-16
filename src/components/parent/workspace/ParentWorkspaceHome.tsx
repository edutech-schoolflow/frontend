"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  GraduationCap,
  Receipt,
  FileText,
  ArrowRight,
} from "lucide-react";
import { useWorkspace } from "@/src/context/WorkspaceContext";
import { getMyChildren, type ParentChild } from "@/src/lib/api/parentChildren";
import { formatNaira } from "@/src/lib/api/store";

/**
 * Parent workspace Overview (FE-001, Stage 3). The parent context is scoped to ONE school, so this
 * shows only the children enrolled HERE — pulled from the identity-level child list and filtered by
 * the workspace's organization. Per-child modules hang off each card.
 */
export default function ParentWorkspaceHome() {
  const ws = useWorkspace();
  const schoolName = ws.name ?? "this school";
  const [children, setChildren] = useState<ParentChild[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getMyChildren()
      .then((all) => {
        if (!cancelled) {
          setChildren(all.filter((c) => c.schoolId === ws.organizationId));
        }
      })
      .catch(() => {
        if (!cancelled) setChildren([]);
      });
    return () => {
      cancelled = true;
    };
  }, [ws.organizationId]);

  if (children === null) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[900px]">
      <div className="mb-[6px] flex items-center gap-[8px] text-[13px] font-medium text-brand-green">
        <GraduationCap size={16} />
        Parent workspace
      </div>
      <h1 className="text-[24px] font-semibold text-[#1b1b1b]">{schoolName}</h1>
      <p className="mt-[6px] text-[15px] text-[#666]">
        Your children at this school, and everything tied to them here.
      </p>

      {children.length === 0 ? (
        <div className="mt-[28px] rounded-[14px] border border-dashed border-[#d9d9d9] bg-white px-[24px] py-[40px] text-center">
          <p className="text-[15px] font-medium text-[#1b1b1b]">
            None of your children are enrolled at {schoolName} yet.
          </p>
          <p className="mt-[6px] text-[14px] text-[#666]">
            Once an application here is accepted, the child shows up in this
            workspace.
          </p>
          <Link
            href="/family/schools"
            className="mt-[18px] inline-flex items-center gap-[8px] rounded-[8px] bg-brand-green px-[18px] py-[10px] text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Explore schools
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="mt-[24px] grid gap-[16px] sm:grid-cols-2">
          {children.map((child) => (
            <div
              key={child.childProfileId}
              className="rounded-[14px] border border-[#ececec] bg-white p-[18px]"
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <p className="truncate text-[16px] font-semibold text-[#1b1b1b]">
                    {child.studentName}
                  </p>
                  <p className="text-[13px] text-[#666]">
                    {child.className ?? "Class pending"}
                    {child.admissionNumber ? ` · ${child.admissionNumber}` : ""}
                  </p>
                </div>
                {child.hasNewResult && (
                  <span className="shrink-0 rounded-full bg-[#e8f5ee] px-[10px] py-[3px] text-[11px] font-semibold text-brand-green">
                    New result
                  </span>
                )}
              </div>

              {child.outstandingFees > 0 && (
                <p className="mt-[10px] text-[13px] font-medium text-[#c0392b]">
                  {formatNaira(child.outstandingFees)} outstanding
                </p>
              )}

              <div className="mt-[16px] flex gap-[8px]">
                <Link
                  href="/family/report-card"
                  className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#e0e0e0] px-[12px] py-[8px] text-[13px] font-medium text-[#1b1b1b] transition-colors hover:bg-[#f7fdf9]"
                >
                  <FileText size={15} />
                  Report card
                </Link>
                <Link
                  href="/family/fees"
                  className="inline-flex items-center gap-[6px] rounded-[8px] border border-[#e0e0e0] px-[12px] py-[8px] text-[13px] font-medium text-[#1b1b1b] transition-colors hover:bg-[#f7fdf9]"
                >
                  <Receipt size={15} />
                  Fees
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
