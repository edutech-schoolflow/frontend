"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  UserRound,
  AlertCircle,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { getParentChildren } from "@/src/lib/api/parents";
import type { ParentChild } from "@/src/types/parent";

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatFees(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

// ─── child card ───────────────────────────────────────────────────────────────

function ChildCard({ child }: { child: ParentChild }) {
  const hasBadge =
    child.outstandingFees > 0 || child.hasNewResult || child.hasNewMessage;

  return (
    <div className="flex flex-col rounded-[10px] border border-[#e0e0e0] bg-white overflow-hidden">
      {/* Card body */}
      <div className="flex flex-col gap-[16px] px-[24px] pt-[24px] pb-[20px]">
        {/* Avatar + badges row */}
        <div className="flex items-start justify-between">
          <div className="flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#e8f5ee] text-[18px] font-semibold text-[#1ca95c]">
            <UserRound className="h-[28px] w-[28px]" />
          </div>
          {hasBadge && (
            <div className="flex flex-col items-end gap-[6px]">
              {child.outstandingFees > 0 && (
                <span className="flex items-center gap-[4px] rounded-full bg-[#fff3e8] px-[10px] py-[4px] text-[11px] font-medium text-[#ff8d28]">
                  <AlertCircle className="h-[11px] w-[11px]" />
                  Fees due
                </span>
              )}
              {child.hasNewResult && (
                <span className="flex items-center gap-[4px] rounded-full bg-[#e8f5ee] px-[10px] py-[4px] text-[11px] font-medium text-[#1ca95c]">
                  <BookOpen className="h-[11px] w-[11px]" />
                  New result
                </span>
              )}
              {child.hasNewMessage && (
                <span className="flex items-center gap-[4px] rounded-full bg-[#e8f0ff] px-[10px] py-[4px] text-[11px] font-medium text-[#4a6cf7]">
                  <MessageCircle className="h-[11px] w-[11px]" />
                  New message
                </span>
              )}
            </div>
          )}
        </div>

        {/* Child info */}
        <div className="flex flex-col gap-[3px]">
          <p className="text-[16px] font-semibold text-[#1b1b1b]">
            {child.studentName}
          </p>
          <p className="text-[13px] text-[#666]">{child.schoolName}</p>
          <p className="text-[13px] text-[#888]">{child.className}</p>
        </div>

        {/* Fees outstanding */}
        {child.outstandingFees > 0 && (
          <div className="rounded-[8px] bg-[#fff8f3] px-[14px] py-[10px]">
            <p className="text-[11px] text-[#aaa]">Outstanding fees</p>
            <p className="text-[15px] font-semibold text-[#ff8d28]">
              {formatFees(child.outstandingFees)}
            </p>
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="flex border-t border-[#f0f0f0]">
        <Link
          href={`/parent/dashboard/children/${child.studentId}`}
          className="flex flex-1 items-center justify-center py-[12px] text-[13px] text-[#555] transition-colors hover:bg-[#fafafa] hover:text-[#1ca95c]"
        >
          View details
        </Link>
        <div className="w-px bg-[#f0f0f0]" />
        <Link
          href={`/parent/dashboard/report-card?childId=${child.studentId}`}
          className="flex flex-1 items-center justify-center py-[12px] text-[13px] text-[#555] transition-colors hover:bg-[#fafafa] hover:text-[#1ca95c]"
        >
          Report card
        </Link>
        <div className="w-px bg-[#f0f0f0]" />
        <Link
          href={`/parent/dashboard/ca-scores?childId=${child.studentId}`}
          className="flex flex-1 items-center justify-center py-[12px] text-[13px] text-[#555] transition-colors hover:bg-[#fafafa] hover:text-[#1ca95c]"
        >
          CA scores
        </Link>
      </div>
    </div>
  );
}

// ─── empty state ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-[20px] py-[80px]">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#f5f5f5]">
        <UserRound className="h-[36px] w-[36px] text-[#ccc]" />
      </div>
      <div className="flex flex-col items-center gap-[8px] text-center">
        <p className="text-[18px] font-medium text-[#1b1b1b]">
          No children enrolled yet
        </p>
        <p className="max-w-[340px] text-[14px] text-[#888]">
          Find a school and submit an application to get started.
        </p>
      </div>
      <Link
        href="/parent/dashboard/enrol"
        className="flex h-[46px] items-center gap-[8px] rounded-[8px] bg-[#1ca95c] px-[24px] text-[14px] text-white transition-opacity hover:opacity-90"
      >
        <Plus className="h-[16px] w-[16px]" />
        Enrol your child
      </Link>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function ParentDashboardHome() {
  const [children, setChildren] = useState<ParentChild[] | undefined>(
    undefined
  );

  useEffect(() => {
    getParentChildren().then(setChildren);
  }, []);

  if (children === undefined) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#1ca95c] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <div className="mb-[28px] flex items-center justify-between">
        <h1 className="text-[24px] font-medium text-[#1b1b1b]">My children</h1>
        {children.length > 0 && (
          <Link
            href="/parent/dashboard/enrol"
            className="flex h-[40px] items-center gap-[7px] rounded-[8px] bg-[#1ca95c] px-[18px] text-[13px] text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-[14px] w-[14px]" />
            Add a child to another school
          </Link>
        )}
      </div>

      {children.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-3 gap-[20px]">
          {children.map((child) => (
            <ChildCard key={child.studentId} child={child} />
          ))}
        </div>
      )}
    </div>
  );
}
