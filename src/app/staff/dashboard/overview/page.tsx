"use client";

import { useEffect, useState } from "react";
import { getSchoolStaff } from "@/src/lib/api/staff";
import { getTodayStaffAttendance } from "@/src/lib/api/staffAttendance";
import { getBursarSummary } from "@/src/lib/api/fees";
import { getSchoolApplications } from "@/src/lib/api/applications";
import type { BursarSummary } from "@/src/types/fee";
import type { Application } from "@/src/types/application";

function formatNaira(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

export default function SchoolOverviewPage() {
  const [staffCount, setStaffCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [feeSummary, setFeeSummary] = useState<BursarSummary | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getSchoolStaff(),
      getTodayStaffAttendance(),
      getBursarSummary("term-001"),
      getSchoolApplications(),
    ]).then(([{ staff }, checkIns, fee, applications]) => {
      if (cancelled) return;
      const active = staff.filter((s) => s.status === "active");
      setStaffCount(active.length);
      setPresentCount(active.filter((s) => !!checkIns[s.id]).length);
      setFeeSummary(fee);
      setApps(applications.data);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const pendingApps = apps.filter((a) => a.status === "under_review").length;
  const admittedApps = apps.filter((a) => a.status === "admitted").length;

  const sections = [
    {
      title: "Staff today",
      stats: [
        { label: "Active staff", value: staffCount },
        { label: "Checked in", value: presentCount, color: "text-[#16a34a]" },
        {
          label: "Not yet in",
          value: Math.max(0, staffCount - presentCount),
          color: "text-[#b45309]",
        },
      ],
    },
    {
      title: "Fee collection",
      stats: feeSummary
        ? [
            {
              label: "Collected",
              value: formatNaira(feeSummary.totalCollected),
              color: "text-[#16a34a]",
            },
            {
              label: "Outstanding",
              value: formatNaira(feeSummary.totalOutstanding),
              color: "text-[#dc2626]",
            },
            {
              label: "Rate",
              value: `${Math.round((feeSummary.totalCollected / feeSummary.totalExpected) * 100)}%`,
            },
          ]
        : [],
    },
    {
      title: "Admissions",
      stats: [
        { label: "Total applications", value: apps.length },
        {
          label: "Pending review",
          value: pendingApps,
          color: "text-[#b45309]",
        },
        { label: "Admitted", value: admittedApps, color: "text-[#16a34a]" },
      ],
    },
  ];

  return (
    <div className="p-[30px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          School Overview
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          A snapshot of today&apos;s school activity.
        </p>
      </div>

      {!loaded && (
        <div className="flex items-center justify-center py-16">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      )}

      {loaded && (
        <div className="space-y-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-[12px] border border-[#e5e7eb] bg-white p-5"
            >
              <p className="mb-4 text-[14px] font-semibold text-text-heading">
                {section.title}
              </p>
              <div className="grid grid-cols-3 gap-4">
                {section.stats.map((s) => (
                  <div key={s.label}>
                    <p
                      className={`text-[24px] font-bold ${s.color ?? "text-text-heading"}`}
                    >
                      {s.value}
                    </p>
                    <p className="mt-0.5 text-[12px] text-text-body">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
