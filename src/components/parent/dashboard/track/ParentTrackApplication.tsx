"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { getMyApplications } from "@/src/lib/api/applications";
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

      <div className="h-[48px] w-[48px] overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
        {app.photoUrl ? (
          <img
            src={app.photoUrl}
            alt={childName}
            className="h-full w-full object-cover"
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

      <button
        type="button"
        className="mt-auto text-left text-[14px] text-[#ff8d28] hover:underline"
      >
        View details
      </button>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function ParentTrackApplication() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    getMyApplications().then(setApplications);
  }, []);

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <h1 className="mb-[24px] text-[24px] font-medium text-[#1b1b1b]">
        Track application
      </h1>

      {applications.length === 0 ? (
        <p className="text-[14px] text-[#888]">No applications yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-[20px]">
          {applications.map((app) => (
            <ApplicationCard key={app.id} app={app} />
          ))}
        </div>
      )}
    </div>
  );
}
