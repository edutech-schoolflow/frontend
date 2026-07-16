"use client";

import Link from "next/link";
import { UserRound, School, AlertCircle } from "lucide-react";
import { useMyChildren } from "@/src/lib/api/useParentChildren";
import type { ParentChild } from "@/src/lib/api/parentChildren";

// ─── child card ───────────────────────────────────────────────────────────────

function ChildCard({ child }: { child: ParentChild }) {
  return (
    <Link
      href={`/family/children/${child.childProfileId}`}
      className="flex flex-col gap-[12px] rounded-[10px] border border-[#ccc] p-[20px] transition-shadow hover:shadow-[0_2px_10px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between">
        <div className="h-[64px] w-[64px] overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
          {child.schoolLogoUrl ? (
            <img
              src={child.schoolLogoUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserRound className="h-[32px] w-[32px] text-[#ccc]" />
            </div>
          )}
        </div>
        {child.hasNewResult && (
          <span className="rounded-full bg-[#e8f8ef] px-[10px] py-[3px] text-[11px] font-medium text-[#1ca95c]">
            New result
          </span>
        )}
      </div>

      <div className="flex flex-col gap-[3px]">
        <p className="text-[16px] font-medium text-[#1b1b1b]">
          {child.studentName}
        </p>
        {child.schoolName ? (
          <p className="flex items-center gap-[6px] text-[14px] text-[#666]">
            <School className="h-[14px] w-[14px] text-[#999]" />
            {child.schoolName}
          </p>
        ) : (
          <p className="text-[14px] text-[#888]">Not enrolled yet</p>
        )}
        {child.className && (
          <p className="text-[13px] text-[#888]">
            {child.className}
            {child.admissionNumber ? ` · ${child.admissionNumber}` : ""}
          </p>
        )}
      </div>

      {child.outstandingFees > 0 && (
        <p className="mt-auto flex items-center gap-[6px] text-[13px] font-medium text-[#e53e3e]">
          <AlertCircle className="h-[14px] w-[14px]" />₦
          {child.outstandingFees.toLocaleString()} outstanding
        </p>
      )}
    </Link>
  );
}

// ─── states ─────────────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-[16px] py-[80px]">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#f5f5f5]">
        <UserRound className="h-[36px] w-[36px] text-[#ccc]" />
      </div>
      <div className="flex max-w-[420px] flex-col items-center gap-[6px] text-center">
        <p className="text-[16px] font-medium text-[#1b1b1b]">
          No children linked yet
        </p>
        <p className="text-[14px] text-[#888]">
          When a school enrols your child using your phone number, they&apos;ll
          appear here automatically. You can then track their fees, results, and
          attendance.
        </p>
      </div>
      <Link
        href="/family/enrol/child-info"
        className="flex h-[44px] items-center justify-center rounded-[8px] bg-[#1ca95c] px-[24px] text-[14px] font-medium text-white hover:opacity-90"
      >
        Add a child
      </Link>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center py-[80px]">
      <div className="h-[32px] w-[32px] animate-spin rounded-full border-2 border-[#eee] border-t-[#1ca95c]" />
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function ParentMyChildren() {
  const { data: children, isPending, isError, error } = useMyChildren();

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <div className="flex items-center justify-between">
        <h1 className="text-[24px] font-medium text-[#1b1b1b]">My children</h1>
        <Link
          href="/family/enrol/child-info"
          className="flex h-[40px] items-center justify-center rounded-[8px] bg-[#1ca95c] px-[20px] text-[14px] font-medium text-white hover:opacity-90"
        >
          Add a child
        </Link>
      </div>

      {isPending && <Spinner />}

      {isError && (
        <p className="mt-[24px] text-[14px] text-[#e53e3e]">
          {error instanceof Error
            ? error.message
            : "Could not load your children."}
        </p>
      )}

      {children && children.length === 0 && <EmptyState />}

      {children && children.length > 0 && (
        <div className="mt-[24px] grid grid-cols-3 gap-[24px]">
          {children.map((child) => (
            <ChildCard key={child.childProfileId} child={child} />
          ))}
        </div>
      )}
    </div>
  );
}
