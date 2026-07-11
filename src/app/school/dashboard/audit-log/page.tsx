"use client";

import { useState } from "react";
import PageHeader from "@/src/shared/PageHeader";
import { useAuditLog } from "@/src/lib/api/useAudit";
import type { AuditEntry } from "@/src/lib/api/audit";

const ENTITY_TABS: { key: string; label: string }[] = [
  { key: "all", label: "All" },
  { key: "application", label: "Admissions" },
  { key: "student", label: "Students" },
];

// Friendly label + chip colour for a dotted action, with a sensible fallback for unknown ones.
function actionMeta(action: string): { label: string; cls: string } {
  const map: Record<string, { label: string; cls: string }> = {
    "application.exam_scheduled": {
      label: "Exam scheduled",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    },
    "application.admitted": {
      label: "Admitted",
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    "application.rejected": {
      label: "Rejected",
      cls: "bg-red-50 text-red-700 border-red-200",
    },
    "student.withdrawn": {
      label: "Withdrawn",
      cls: "bg-red-50 text-red-700 border-red-200",
    },
    "student.readmitted": {
      label: "Re-admitted",
      cls: "bg-green-50 text-green-700 border-green-200",
    },
    "student.transferred": {
      label: "Transferred",
      cls: "bg-blue-50 text-blue-700 border-blue-200",
    },
    "student.reverted": {
      label: "Reverted",
      cls: "bg-amber-50 text-amber-700 border-amber-200",
    },
  };
  return (
    map[action] ?? {
      label: action.replace(/[._]/g, " "),
      cls: "bg-surface-muted text-grey-text border-border-default",
    }
  );
}

function actorLabel(actorType?: string | null): string {
  if (actorType === "school") return "Owner";
  if (actorType === "staff") return "Staff";
  if (!actorType) return "System";
  return actorType.charAt(0).toUpperCase() + actorType.slice(1);
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AuditLogPage() {
  const [tab, setTab] = useState("all");
  const [limit, setLimit] = useState(50);
  const {
    data: entries = [],
    isPending,
    isFetching,
  } = useAuditLog({
    entityType: tab,
    limit,
  });

  const canLoadMore = entries.length === limit;

  return (
    <div>
      <PageHeader
        title="Audit Log"
        subtitle="A record of every important action in your school — admissions decisions and student changes, with who and when."
      />

      {/* Entity filter */}
      <div className="mb-4 flex flex-wrap gap-2 px-[30px] pt-4">
        {ENTITY_TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => {
              setTab(t.key);
              setLimit(50);
            }}
            className={`rounded-full border px-[14px] py-[6px] text-[13px] font-medium transition-colors ${
              tab === t.key
                ? "border-brand-green bg-brand-green text-white"
                : "border-border-default bg-white text-grey-text hover:border-brand-green/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="px-[30px] pb-[60px]">
        <div className="overflow-hidden rounded-xl border border-border-default bg-white">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-border-default bg-surface-muted">
                <th className="px-[16px] py-[12px] font-medium text-grey-text">
                  When
                </th>
                <th className="px-[16px] py-[12px] font-medium text-grey-text">
                  By
                </th>
                <th className="px-[16px] py-[12px] font-medium text-grey-text">
                  Action
                </th>
                <th className="px-[16px] py-[12px] font-medium text-grey-text">
                  Details
                </th>
              </tr>
            </thead>
            <tbody>
              {isPending ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-[16px] py-[48px] text-center text-grey-text"
                  >
                    Loading…
                  </td>
                </tr>
              ) : entries.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-[16px] py-[48px] text-center text-grey-text"
                  >
                    No activity recorded yet.
                  </td>
                </tr>
              ) : (
                entries.map((e: AuditEntry, i) => {
                  const meta = actionMeta(e.action);
                  return (
                    <tr
                      key={e.id}
                      className={
                        i !== entries.length - 1
                          ? "border-b border-border-default"
                          : ""
                      }
                    >
                      <td className="whitespace-nowrap px-[16px] py-[13px] text-grey-text">
                        {fmt(e.createdAt)}
                      </td>
                      <td className="px-[16px] py-[13px] text-dark-blue">
                        {actorLabel(e.actorType)}
                      </td>
                      <td className="px-[16px] py-[13px]">
                        <span
                          className={`inline-flex items-center rounded-full border px-[10px] py-[3px] text-[12px] font-medium capitalize ${meta.cls}`}
                        >
                          {meta.label}
                        </span>
                      </td>
                      <td className="px-[16px] py-[13px] text-dark-blue">
                        {e.summary}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {canLoadMore && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setLimit((l) => l + 50)}
              disabled={isFetching}
              className="rounded-lg border border-border-default bg-white px-5 py-2.5 text-[13px] font-medium text-dark-blue hover:border-brand-green hover:text-brand-green disabled:opacity-50"
            >
              {isFetching ? "Loading…" : "Load more"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
