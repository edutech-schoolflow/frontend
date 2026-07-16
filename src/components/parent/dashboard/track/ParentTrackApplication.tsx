"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { useMyApplications } from "@/src/lib/api/useParentApplications";
import type { Application, ApplicationStatus } from "@/src/types/application";

// ─── status config ────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  ApplicationStatus,
  { label: string; className: string }
> = {
  under_review: { label: "Under review", className: "bg-[#ff8d28] text-white" },
  exam_scheduled: {
    label: "Exam/Interview scheduled",
    className: "bg-[#ff8d28] text-white",
  },
  admitted: { label: "Admitted", className: "bg-[#1ca95c] text-white" },
  not_admitted: { label: "Not admitted", className: "bg-[#e84040] text-white" },
};

// ─── tabs ─────────────────────────────────────────────────────────────────────

const TABS: { id: ApplicationStatus; label: string }[] = [
  { id: "under_review", label: "Under Review" },
  { id: "exam_scheduled", label: "Exam / Interview Scheduled" },
  { id: "admitted", label: "Admitted" },
  { id: "not_admitted", label: "Not Admitted" },
];

// ─── application card ─────────────────────────────────────────────────────────

function ApplicationCard({ app }: { app: Application }) {
  const status = STATUS_CONFIG[app.status];
  const childName = [app.childFirstName, app.childMiddleName, app.childLastName]
    .filter(Boolean)
    .join(" ");
  const appliedOn = new Date(app.submittedAt).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const examDateTime =
    app.examDate && app.examTime
      ? `${app.examDate}; ${app.examTime}`
      : app.examDate;

  return (
    <div className="flex flex-col gap-[16px] rounded-[10px] border border-[#ccc] bg-white px-[20px] py-[18px]">
      <div className="flex items-center justify-between">
        <span
          className={`rounded-[5px] px-[10px] py-[4px] text-[12px] font-medium ${status.className}`}
        >
          {status.label}
        </span>
        <p className="text-[12px] text-[#888]">Applied on {appliedOn}</p>
      </div>

      <div className="relative h-[48px] w-[48px] overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
        {app.photoUrl ? (
          <Image
            src={app.photoUrl}
            alt={childName}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <UserRound className="h-[24px] w-[24px] text-[#ccc]" />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-[3px]">
        <p className="text-[16px] font-medium text-[#1b1b1b]">{childName}</p>
        <p className="text-[14px] text-[#666]">{app.schoolName}</p>
        <p className="text-[14px] text-[#666]">
          {app.desiredClass}
          {app.termName ? ` · ${app.termName}` : ""}
        </p>
      </div>

      {examDateTime && (
        <p className="text-[14px] font-medium text-[#1b1b1b]">
          Exam/Interview date: {examDateTime}
        </p>
      )}

      <Link
        href={`/family/track/${app.id}`}
        className="mt-auto text-left text-[14px] text-[#ff8d28] hover:underline"
      >
        View details →
      </Link>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function ParentTrackApplication() {
  const {
    data: applications = [],
    isPending,
    isError,
    error,
  } = useMyApplications();
  const [activeTab, setActiveTab] = useState<ApplicationStatus>("under_review");

  const counts = Object.fromEntries(
    TABS.map(({ id }) => [
      id,
      applications.filter((a) => a.status === id).length,
    ])
  ) as Record<ApplicationStatus, number>;

  const visible = applications.filter((a) => a.status === activeTab);

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <h1 className="mb-[24px] text-[24px] font-medium text-[#1b1b1b]">
        Track application
      </h1>

      {/* Tabs */}
      <div className="mb-[28px] flex flex-wrap gap-[8px] border-b border-[#eee] pb-[16px]">
        {TABS.map(({ id, label }) => {
          const isActive = activeTab === id;
          const count = counts[id];
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-[6px] rounded-[8px] px-[14px] py-[8px] text-[13px] font-medium transition-colors ${
                isActive
                  ? "bg-[#1b1b1b] text-white"
                  : "border border-[#e5e7eb] text-[#666] hover:border-[#ccc] hover:text-[#1b1b1b]"
              }`}
            >
              {label}
              <span
                className={`rounded-full px-[7px] py-[1px] text-[11px] font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[#f3f4f6] text-[#6b7280]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {isPending ? (
        <div className="flex justify-center py-[60px]">
          <div className="h-[32px] w-[32px] animate-spin rounded-full border-2 border-[#eee] border-t-[#1ca95c]" />
        </div>
      ) : isError ? (
        <p className="py-[60px] text-center text-[14px] text-[#e53e3e]">
          {error instanceof Error
            ? error.message
            : "Could not load your applications."}
        </p>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-[#e5e7eb] py-[60px]">
          <p className="text-[15px] font-medium text-[#1b1b1b]">
            No applications here
          </p>
          <p className="mt-[6px] text-[13px] text-[#888]">
            {activeTab === "under_review" &&
              "Applications being reviewed will appear here."}
            {activeTab === "exam_scheduled" &&
              "Children scheduled for an exam or interview will appear here."}
            {activeTab === "admitted" && "Admitted children will appear here."}
            {activeTab === "not_admitted" &&
              "Applications that were not successful will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-[20px]">
          {visible.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
