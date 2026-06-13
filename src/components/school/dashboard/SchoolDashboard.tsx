"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  CheckSquare,
  AlertCircle,
  FileText,
  TrendingUp,
  UserPlus,
  Megaphone,
  CreditCard,
  BarChart2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { getSchoolDashboard } from "@/src/lib/api/schools";
import type {
  DashboardStats,
  ActivityItem,
  DashboardApplication,
} from "@/src/types/school";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return `₦${n.toLocaleString()}`;
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  return `${Math.floor(diff / 1440)}d ago`;
}

const ACTIVITY_ICON: Record<string, React.ElementType> = {
  payment: CreditCard,
  application: FileText,
  result: BarChart2,
  staff: Users,
  announcement: Megaphone,
};

const STATUS_STYLE = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-500",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accent: string;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[12px] border border-[#e5e7eb] bg-white p-5">
      <div className="flex items-center justify-between">
        <p className="text-[13px] text-text-body">{label}</p>
        <div
          className={`flex h-[34px] w-[34px] items-center justify-center rounded-[8px] ${accent}`}
        >
          <Icon className="h-[16px] w-[16px]" />
        </div>
      </div>
      <div>
        <p className="text-[26px] font-semibold leading-none text-text-heading">
          {value}
        </p>
        {sub && <p className="mt-1.5 text-[12px] text-text-body">{sub}</p>}
      </div>
    </div>
  );
}

function FeeCollection({ stats }: { stats: DashboardStats }) {
  const pct =
    stats.feeTargetThisTerm > 0
      ? Math.min(
          100,
          Math.round(
            (stats.feesCollectedThisTerm / stats.feeTargetThisTerm) * 100
          )
        )
      : 0;

  return (
    <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-text-heading">
          Term Fee Collection
        </h2>
        <Link
          href="/school/dashboard/fees/invoices"
          className="text-[12px] font-medium text-brand-green hover:underline"
        >
          View invoices
        </Link>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="mb-1.5 flex items-center justify-between text-[12px] text-text-body">
          <span>{pct}% collected</span>
          <span>{fmt(stats.feeTargetThisTerm)} target</span>
        </div>
        <div className="h-[8px] w-full overflow-hidden rounded-full bg-[#f3f4f6]">
          <div
            className="h-full rounded-full bg-brand-green transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Two sub-stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-[8px] bg-[#f0faf4] px-4 py-3">
          <p className="text-[11px] text-text-body">Collected</p>
          <p className="mt-0.5 text-[16px] font-semibold text-brand-green">
            {fmt(stats.feesCollectedThisTerm)}
          </p>
        </div>
        <div className="rounded-[8px] bg-[#fff8f3] px-4 py-3">
          <p className="text-[11px] text-text-body">Outstanding</p>
          <p className="mt-0.5 text-[16px] font-semibold text-[#f47e14]">
            {fmt(stats.outstandingFees)}
          </p>
        </div>
      </div>
    </div>
  );
}

function RecentApplications({ items }: { items: DashboardApplication[] }) {
  return (
    <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-[15px] font-semibold text-text-heading">
          Recent Applications
        </h2>
        <Link
          href="/school/dashboard/applications"
          className="text-[12px] font-medium text-brand-green hover:underline"
        >
          View all
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <FileText className="h-[32px] w-[32px] text-[#d1d5db]" />
          <p className="text-[13px] text-text-body">No applications yet</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-[#f3f4f6]">
          {items.map((app) => {
            const initials = app.studentName
              .split(" ")
              .slice(0, 2)
              .map((n) => n[0])
              .join("")
              .toUpperCase();
            return (
              <Link
                key={app.id}
                href={`/school/dashboard/applications/${app.id}`}
                className="flex items-center gap-3 py-3 hover:opacity-80"
              >
                <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#e8f5ee] text-[12px] font-semibold text-brand-green">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-text-heading">
                    {app.studentName}
                  </p>
                  <p className="text-[12px] text-text-body">
                    {app.classApplied}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`rounded-full px-[8px] py-[2px] text-[11px] font-medium capitalize ${
                      STATUS_STYLE[app.status]
                    }`}
                  >
                    {app.status}
                  </span>
                  <span className="text-[11px] text-text-body">
                    {timeAgo(app.appliedAt)}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

const QUICK_ACTIONS = [
  {
    label: "Add Student",
    href: "/school/dashboard/students",
    icon: UserPlus,
    accent: "bg-[#e8f5ee] text-brand-green",
  },
  {
    label: "Send Announcement",
    href: "/school/dashboard/announcements",
    icon: Megaphone,
    accent: "bg-[#e8f0ff] text-[#4a6cf7]",
  },
  {
    label: "Record Payment",
    href: "/school/dashboard/fees/invoices",
    icon: CreditCard,
    accent: "bg-[#fff3e8] text-[#f47e14]",
  },
  {
    label: "View Results",
    href: "/school/dashboard/grades/results",
    icon: BarChart2,
    accent: "bg-[#fce8e8] text-[#e84040]",
  },
];

function QuickActions() {
  return (
    <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-6">
      <h2 className="mb-5 text-[15px] font-semibold text-text-heading">
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.label}
              href={a.href}
              className="flex items-center gap-3 rounded-[10px] border border-[#e5e7eb] px-4 py-3 transition-shadow hover:shadow-sm"
            >
              <div
                className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[8px] ${a.accent}`}
              >
                <Icon className="h-[16px] w-[16px]" />
              </div>
              <span className="text-[13px] font-medium text-text-heading">
                {a.label}
              </span>
              <ChevronRight className="ml-auto h-[14px] w-[14px] text-[#d1d5db]" />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-6">
      <h2 className="mb-5 text-[15px] font-semibold text-text-heading">
        Recent Activity
      </h2>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-8 text-center">
          <Clock className="h-[32px] w-[32px] text-[#d1d5db]" />
          <p className="text-[13px] text-text-body">
            Activity will appear here as your team uses the platform.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => {
            const Icon = ACTIVITY_ICON[item.type] ?? Clock;
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#f3f4f6]">
                  <Icon className="h-[14px] w-[14px] text-text-body" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-text-heading">
                    {item.description}
                  </p>
                  <p className="text-[11px] text-text-body">
                    {timeAgo(item.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function SchoolDashboard() {
  const [data, setData] = useState<{
    stats: DashboardStats;
    recentApplications: DashboardApplication[];
    recentActivity: ActivityItem[];
  } | null>(null);

  useEffect(() => {
    getSchoolDashboard().then(setData);
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  const { stats, recentApplications, recentActivity } = data;

  return (
    <div className="px-[32px] py-[28px] pb-[60px]">
      {/* Compliance banner */}
      {!stats.complianceApproved && (
        <Link
          href="/school/dashboard/compliance"
          className="mb-6 flex items-center justify-between rounded-[10px] border border-amber-200 bg-amber-50 px-5 py-3.5 transition-opacity hover:opacity-90"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-[18px] w-[18px] shrink-0 text-amber-600" />
            <p className="text-[13px] font-medium text-amber-800">
              Complete your compliance profile to unlock fee collection and full
              platform access.
            </p>
          </div>
          <span className="shrink-0 text-[12px] font-semibold text-amber-700">
            Go to Compliance →
          </span>
        </Link>
      )}

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Students Enrolled"
          value={stats.studentsEnrolled}
          icon={Users}
          accent="bg-[#e8f5ee] text-brand-green"
        />
        <StatCard
          label="Attendance Today"
          value={`${stats.attendanceTodayPct}%`}
          sub={`${stats.absenteesToday} absent`}
          icon={CheckSquare}
          accent="bg-[#e8f0ff] text-[#4a6cf7]"
        />
        <StatCard
          label="Outstanding Fees"
          value={fmt(stats.outstandingFees)}
          icon={TrendingUp}
          accent="bg-[#fff3e8] text-[#f47e14]"
        />
        <StatCard
          label="Pending Applications"
          value={stats.pendingApplications}
          icon={FileText}
          accent="bg-[#fce8e8] text-[#e84040]"
        />
      </div>

      {/* Row 2 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <FeeCollection stats={stats} />
        <RecentApplications items={recentApplications} />
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QuickActions />
        <RecentActivity items={recentActivity} />
      </div>
    </div>
  );
}
