"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight } from "lucide-react";
import { getSchoolApplications } from "@/src/lib/api/applications";
import type { Application, ApplicationStatus } from "@/src/types/application";
import { useWorkspaceHref } from "@/src/hooks/useWorkspaceHref";

const STATUS_CFG: Record<
  ApplicationStatus,
  { label: string; bg: string; text: string }
> = {
  under_review: {
    label: "Under review",
    bg: "bg-[#eff6ff]",
    text: "text-[#2563eb]",
  },
  exam_scheduled: {
    label: "Exam scheduled",
    bg: "bg-[#fffbeb]",
    text: "text-[#b45309]",
  },
  admitted: { label: "Admitted", bg: "bg-[#f0fdf4]", text: "text-[#16a34a]" },
  not_admitted: {
    label: "Not admitted",
    bg: "bg-[#fef2f2]",
    text: "text-[#dc2626]",
  },
};

type Tab = "all" | ApplicationStatus;

const TABS: { key: Tab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "under_review", label: "Under Review" },
  { key: "exam_scheduled", label: "Exam Scheduled" },
  { key: "admitted", label: "Admitted" },
  { key: "not_admitted", label: "Not Admitted" },
];

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function StaffAdmissionsPage() {
  const wsHref = useWorkspaceHref();
  const router = useRouter();
  const [apps, setApps] = useState<Application[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("all");

  useEffect(() => {
    getSchoolApplications().then(({ data }) => {
      setApps(data);
      setLoaded(true);
    });
  }, []);

  const desiredClasses = useMemo(() => {
    const set = new Set(apps.map((a) => a.desiredClass));
    return Array.from(set).sort();
  }, [apps]);

  const counts = useMemo(
    () =>
      TABS.reduce(
        (acc, t) => {
          acc[t.key] =
            t.key === "all"
              ? apps.length
              : apps.filter((a) => a.status === t.key).length;
          return acc;
        },
        {} as Record<Tab, number>
      ),
    [apps]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return apps.filter((a) => {
      if (tab !== "all" && a.status !== tab) return false;
      if (classFilter !== "all" && a.desiredClass !== classFilter) return false;
      if (q) {
        const name = `${a.childFirstName} ${a.childLastName}`.toLowerCase();
        if (
          !name.includes(q) &&
          !a.parentName.toLowerCase().includes(q) &&
          !a.referenceNumber.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [apps, tab, classFilter, search]);

  const underReviewCount = counts["under_review"];

  return (
    <div className="p-[30px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Admissions
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          {apps.length} application{apps.length !== 1 ? "s" : ""}
          {underReviewCount > 0 && (
            <span className="ml-2 rounded-full bg-[#eff6ff] px-2 py-0.5 text-[11px] font-medium text-[#2563eb]">
              {underReviewCount} awaiting review
            </span>
          )}
        </p>
      </div>

      {/* Status tabs */}
      <div className="mb-5 flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-medium transition-colors ${
              tab === t.key
                ? "border-brand-green bg-brand-green text-white"
                : "border-[#e5e7eb] bg-white text-text-body hover:border-[#d1d5db]"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-px text-[10px] ${
                tab === t.key
                  ? "bg-white/20 text-white"
                  : "bg-[#f3f4f6] text-[#6b7280]"
              }`}
            >
              {counts[t.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Search + class filter */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] max-w-[320px] flex-1">
          <Search className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#9ca3af]" />
          <input
            placeholder="Search name, parent or reference…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[40px] w-full rounded-[10px] border border-[#e5e7eb] bg-white pl-8 pr-4 text-[13px] focus:border-brand-green focus:outline-none"
          />
        </div>

        {desiredClasses.length > 1 && (
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="h-[40px] appearance-none rounded-[10px] border border-[#e5e7eb] bg-white pl-3 pr-8 text-[13px] focus:border-brand-green focus:outline-none"
          >
            <option value="all">All classes</option>
            {desiredClasses.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* List */}
      {!loaded ? (
        <div className="flex justify-center py-[80px]">
          <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#e5e7eb] py-[60px] text-center">
          <p className="text-[15px] font-medium text-text-heading">
            No applications found
          </p>
          <p className="mt-1 text-[13px] text-text-body">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                {[
                  "Applicant",
                  "Desired Class",
                  "Parent",
                  "Applied",
                  "Status",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, idx) => {
                const cfg = STATUS_CFG[app.status];
                return (
                  <tr
                    key={app.id}
                    onClick={() =>
                      router.push(wsHref(`/staff/dashboard/admissions/${app.id}`))
                    }
                    className={`cursor-pointer transition-colors hover:bg-[#f9fafb] ${
                      idx < filtered.length - 1
                        ? "border-b border-[#f3f4f6]"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#e8f5e9] text-[12px] font-semibold text-brand-green">
                          {app.childFirstName[0]}
                          {app.childLastName[0]}
                        </div>
                        <div>
                          <p className="text-[13px] font-medium text-text-heading">
                            {app.childFirstName} {app.childLastName}
                          </p>
                          <p className="text-[11px] text-[#9ca3af]">
                            {app.admissionNumber ?? app.referenceNumber}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-text-body">
                      {app.desiredClass}
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-[13px] text-text-body">
                        {app.parentName}
                      </p>
                      <p className="text-[11px] text-[#9ca3af]">
                        {app.parentPhone}
                      </p>
                    </td>
                    <td className="px-4 py-3.5 text-[13px] text-text-body">
                      {fmt(app.submittedAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${cfg.bg} ${cfg.text}`}
                      >
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <ChevronRight className="h-[14px] w-[14px] text-[#d1d5db]" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
