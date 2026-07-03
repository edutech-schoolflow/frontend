"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useApplications } from "@/src/lib/api/useSchoolApplications";
import type { ApplicationStatus } from "@/src/types/application";
import AppStatusChip from "./AppStatusChip";

type Tab = "all" | ApplicationStatus;

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "under_review", label: "Under Review" },
  { key: "exam_scheduled", label: "Exam Scheduled" },
  { key: "admitted", label: "Admitted" },
  { key: "not_admitted", label: "Not Admitted" },
];

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function SchoolApplications() {
  const router = useRouter();
  const { data: all = [], isPending: loading } = useApplications();
  const [tab, setTab] = useState<Tab>("all");
  const [classFilter, setClassFilter] = useState("all");
  const [search, setSearch] = useState("");

  const desiredClasses = useMemo(() => {
    const set = new Set(all.map((a) => a.desiredClass));
    return Array.from(set).sort();
  }, [all]);

  const counts = TABS.reduce(
    (acc, t) => {
      acc[t.key] =
        t.key === "all"
          ? all.length
          : all.filter((a) => a.status === t.key).length;
      return acc;
    },
    {} as Record<Tab, number>
  );

  const filtered = all.filter((a) => {
    const matchTab = tab === "all" || a.status === tab;
    const matchClass = classFilter === "all" || a.desiredClass === classFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      `${a.childFirstName} ${a.childLastName}`.toLowerCase().includes(q) ||
      a.parentName.toLowerCase().includes(q) ||
      a.referenceNumber.toLowerCase().includes(q) ||
      (a.admissionNumber ?? "").toLowerCase().includes(q);
    return matchTab && matchClass && matchSearch;
  });

  return (
    <div>
      {/* Status filter tabs */}
      <div className="mb-[20px] flex flex-wrap gap-[6px]">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-[6px] rounded-full border px-[14px] py-[6px] text-[13px] font-medium transition-colors ${
              tab === t.key
                ? "border-brand-green bg-brand-green text-white"
                : "border-border-default bg-white text-grey-text hover:border-brand-green/50"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-[7px] py-[1px] text-[11px] ${
                tab === t.key
                  ? "bg-white/20 text-white"
                  : "bg-surface-muted text-grey-text"
              }`}
            >
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search + class filter row */}
      <div className="mb-[16px] flex flex-wrap items-center gap-[10px]">
        <div className="relative flex-1 max-w-[340px]">
          <Search className="absolute left-[12px] top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-grey-text" />
          <input
            type="text"
            placeholder="Search by name or reference…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border-default bg-white py-[9px] pl-[36px] pr-[12px] text-[13px] text-dark-blue outline-none focus:border-brand-green"
          />
        </div>

        {desiredClasses.length > 1 && (
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="h-[38px] rounded-lg border border-border-default bg-white px-3 text-[13px] text-dark-blue outline-none focus:border-brand-green"
          >
            <option value="all">All classes</option>
            {desiredClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border-default bg-white">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border-default bg-surface-muted">
              <th className="px-[16px] py-[12px] font-medium text-grey-text">
                Applicant
              </th>
              <th className="px-[16px] py-[12px] font-medium text-grey-text">
                Desired Class
              </th>
              <th className="px-[16px] py-[12px] font-medium text-grey-text">
                Applied
              </th>
              <th className="px-[16px] py-[12px] font-medium text-grey-text">
                Status
              </th>
              <th className="px-[16px] py-[12px]" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-[16px] py-[40px] text-center text-[13px] text-grey-text"
                >
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-[16px] py-[40px] text-center text-[13px] text-grey-text"
                >
                  No applications found.
                </td>
              </tr>
            ) : (
              filtered.map((app, i) => (
                <tr
                  key={app.id}
                  className={`cursor-pointer transition-colors hover:bg-surface-muted ${
                    i !== filtered.length - 1
                      ? "border-b border-border-default"
                      : ""
                  }`}
                  onClick={() =>
                    router.push(`/school/dashboard/applications/${app.id}`)
                  }
                >
                  <td className="px-[16px] py-[14px]">
                    <p className="font-medium text-dark-blue">
                      {app.childFirstName} {app.childLastName}
                    </p>
                    <div className="mt-[3px] flex items-center gap-[6px]">
                      <span className="text-[12px] text-grey-text">
                        {app.parentName} ·{" "}
                        {app.admissionNumber
                          ? app.admissionNumber
                          : app.referenceNumber}
                      </span>
                      {!app.applicationFeePaid && (
                        <span className="rounded-full bg-amber-50 px-[7px] py-[1px] text-[10px] font-medium text-amber-700 border border-amber-200">
                          Fee unpaid
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-[16px] py-[14px] text-dark-blue">
                    {app.desiredClass}
                  </td>
                  <td className="px-[16px] py-[14px] text-grey-text">
                    {fmt(app.submittedAt)}
                  </td>
                  <td className="px-[16px] py-[14px]">
                    <AppStatusChip status={app.status} />
                  </td>
                  <td className="px-[16px] py-[14px] text-right">
                    <span className="text-[12px] font-medium text-brand-green">
                      View →
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
