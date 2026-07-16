"use client";

import Link from "next/link";
import {
  Plus,
  UserRound,
  AlertCircle,
  BookOpen,
  Search,
  FileText,
  School as SchoolIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useMyChildren } from "@/src/lib/api/useParentChildren";
import { getMyApplications } from "@/src/lib/api/parentApplications";
import { getIdentityMe } from "@/src/lib/api/identityAuth";
import type { ParentChild } from "@/src/lib/api/parentChildren";

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatFees(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

// ─── child card ───────────────────────────────────────────────────────────────

function ChildCard({ child }: { child: ParentChild }) {
  const hasBadge = child.outstandingFees > 0 || child.hasNewResult;

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
            </div>
          )}
        </div>

        {/* Child info */}
        <div className="flex flex-col gap-[3px]">
          <p className="text-[16px] font-semibold text-[#1b1b1b]">
            {child.studentName}
          </p>
          <p className="text-[13px] text-[#666]">
            {child.schoolName ?? "Not enrolled yet"}
          </p>
          {child.className && (
            <p className="text-[13px] text-[#888]">{child.className}</p>
          )}
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
          href={`/family/children/${child.childProfileId}`}
          className="flex flex-1 items-center justify-center py-[12px] text-[13px] text-[#555] transition-colors hover:bg-[#fafafa] hover:text-[#1ca95c]"
        >
          View details
        </Link>
        <div className="w-px bg-[#f0f0f0]" />
        <Link
          href={`/family/report-card?childId=${child.childProfileId}`}
          className="flex flex-1 items-center justify-center py-[12px] text-[13px] text-[#555] transition-colors hover:bg-[#fafafa] hover:text-[#1ca95c]"
        >
          Report card
        </Link>
        <div className="w-px bg-[#f0f0f0]" />
        <Link
          href={`/family/ca-scores?childId=${child.childProfileId}`}
          className="flex flex-1 items-center justify-center py-[12px] text-[13px] text-[#555] transition-colors hover:bg-[#fafafa] hover:text-[#1ca95c]"
        >
          CA scores
        </Link>
      </div>
    </div>
  );
}

// ─── stat tile ────────────────────────────────────────────────────────────────

function StatTile({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-[10px] rounded-[12px] border border-[#e5e7eb] bg-white px-[20px] py-[18px]">
      <div className="flex items-center gap-[10px]">
        <span className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] bg-[#e8f5ee]">
          {icon}
        </span>
        <span className="text-[13px] font-medium text-[#666]">{label}</span>
      </div>
      <p className="text-[28px] font-semibold leading-none text-[#1b1b1b]">
        {value}
      </p>
      <p className="text-[12px] text-[#9ca3af]">{hint}</p>
    </div>
  );
}

// ─── first-run prompt (no children yet) ─────────────────────────────────────────

function GetStarted() {
  return (
    <div className="flex flex-col items-center gap-[20px] rounded-[14px] border border-dashed border-[#d1d5db] bg-white py-[56px] text-center">
      <div className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-[#e8f5ee]">
        <SchoolIcon className="h-[30px] w-[30px] text-brand-green" />
      </div>
      <div className="flex flex-col items-center gap-[6px]">
        <p className="text-[17px] font-medium text-[#1b1b1b]">
          Let&apos;s find a school
        </p>
        <p className="max-w-[360px] text-[14px] text-[#888]">
          Browse schools near you, apply for admission, and track it — all from
          here.
        </p>
      </div>
      <div className="flex items-center gap-[10px]">
        <Link
          href="/family/schools"
          className="flex h-[44px] items-center gap-[8px] rounded-[8px] bg-brand-green px-[22px] text-[14px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <Search className="h-[16px] w-[16px]" />
          Find a school
        </Link>
        <Link
          href="/family/enrol/child-info"
          className="flex h-[44px] items-center gap-[8px] rounded-[8px] border border-[#d1d5db] px-[22px] text-[14px] font-medium text-[#1b1b1b] transition-colors hover:border-brand-green"
        >
          <Plus className="h-[16px] w-[16px]" />
          Add a child
        </Link>
      </div>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function ParentDashboardHome() {
  const { data: children, isPending } = useMyChildren();
  const { data: me } = useQuery({
    queryKey: ["identity-me"],
    queryFn: getIdentityMe,
  });
  const { data: applications } = useQuery({
    queryKey: ["my-applications"],
    queryFn: getMyApplications,
  });

  if (isPending || !children) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#1ca95c] border-t-transparent" />
      </div>
    );
  }

  const firstName = me?.fullName.split(" ")[0] ?? "there";
  const schoolCount = new Set(
    children.filter((c) => c.schoolId).map((c) => c.schoolId)
  ).size;

  return (
    <div className="px-[48px] py-[31px] pb-[60px] lg:px-[88px]">
      {/* Greeting */}
      <div className="mb-[24px]">
        <h1 className="text-[26px] font-semibold text-[#1b1b1b]">
          {greeting()}, {firstName} 👋
        </h1>
        <p className="mt-[4px] text-[15px] text-[#666]">
          {children.length === 0
            ? "Your SchoolFlow account is ready — let's get your child into a school."
            : "Here's everything across your children and schools."}
        </p>
      </div>

      {/* Stat tiles */}
      <div className="mb-[28px] grid grid-cols-1 gap-[16px] sm:grid-cols-3">
        <StatTile
          icon={<UserRound className="h-[18px] w-[18px] text-brand-green" />}
          label="Children"
          value={children.length}
          hint={
            children.length === 0
              ? "No children added yet"
              : "Linked to your account"
          }
        />
        <StatTile
          icon={<FileText className="h-[18px] w-[18px] text-brand-green" />}
          label="Applications"
          value={applications?.length ?? 0}
          hint={
            (applications?.length ?? 0) === 0
              ? "You haven't applied yet"
              : "Across schools"
          }
        />
        <StatTile
          icon={<SchoolIcon className="h-[18px] w-[18px] text-brand-green" />}
          label="Schools"
          value={schoolCount}
          hint={
            schoolCount === 0
              ? "Not connected to any school"
              : "Where your children are enrolled"
          }
        />
      </div>

      {/* Children, or the get-started prompt */}
      <div className="mb-[16px] flex items-center justify-between">
        <h2 className="text-[18px] font-medium text-[#1b1b1b]">My children</h2>
        {children.length > 0 && (
          <Link
            href="/family/enrol/child-info"
            className="flex h-[38px] items-center gap-[7px] rounded-[8px] bg-brand-green px-[16px] text-[13px] text-white transition-opacity hover:opacity-90"
          >
            <Plus className="h-[14px] w-[14px]" />
            Add a child
          </Link>
        )}
      </div>

      {children.length === 0 ? (
        <GetStarted />
      ) : (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:grid-cols-3">
          {children.map((child) => (
            <ChildCard key={child.childProfileId} child={child} />
          ))}
        </div>
      )}
    </div>
  );
}
