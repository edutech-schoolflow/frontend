"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, Clock, Zap } from "lucide-react";
import SubjectMatrix from "./SubjectMatrix";
import StudentScoresModal from "./StudentScoresModal";
import type { ArmGroup } from "./grades.utils";
import type { GradeTerm, AssessmentType } from "@/src/types/scoreEntry";

interface ViewingCell {
  subject: string;
  type: AssessmentType;
}

interface Props {
  arm: ArmGroup;
  term: GradeTerm;
  onPublish: (recordId: string) => void;
  onPublishArm: (armId: string) => void;
  publishingId: string | null;
  publishingArm: string | null;
}

export default function ArmSection({
  arm,
  term,
  onPublish,
  onPublishArm,
  publishingId,
  publishingArm,
}: Props) {
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState<ViewingCell | null>(null);
  const isPublishingThisArm = publishingArm === arm.armId;

  return (
    <>
      <div className="border-t border-[#f3f4f6] first:border-t-0">
        {/* Arm header */}
        <div
          className="flex cursor-pointer items-center gap-3 px-5 py-3 hover:bg-[#f9fafb] transition-colors"
          onClick={() => setOpen((v) => !v)}
        >
          <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-[#e8f5ee] text-[13px] font-bold text-brand-green">
            {arm.armName.slice(-1)}
          </div>

          <span className="text-[14px] font-semibold text-text-heading">
            {arm.armName}
          </span>

          <div className="flex items-center gap-2 ml-1">
            {arm.publishedCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-[#f0fdf4] px-2 py-0.5 text-[11px] font-medium text-[#16a34a]">
                <CheckCircle2 className="h-[10px] w-[10px]" />
                {arm.publishedCount} published
              </span>
            )}
            {arm.pendingCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-[#fffbeb] px-2 py-0.5 text-[11px] font-medium text-[#b45309]">
                <Clock className="h-[10px] w-[10px]" />
                {arm.pendingCount} pending
              </span>
            )}
            {arm.pendingCount === 0 && arm.totalSubmitted > 0 && (
              <span className="text-[11px] text-[#9ca3af]">All published</span>
            )}
          </div>

          {arm.pendingCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPublishArm(arm.armId);
              }}
              disabled={isPublishingThisArm}
              className="ml-auto flex items-center gap-1.5 rounded-[6px] bg-brand-green px-3 py-1.5 text-[11px] font-medium text-white hover:opacity-90 disabled:opacity-60 transition-opacity shrink-0"
            >
              <Zap className="h-[11px] w-[11px]" />
              {isPublishingThisArm
                ? "Publishing…"
                : `Publish all (${arm.pendingCount})`}
            </button>
          )}

          <div
            className={`${arm.pendingCount > 0 ? "" : "ml-auto"} shrink-0 text-[#9ca3af]`}
          >
            {open ? (
              <ChevronUp className="h-[15px] w-[15px]" />
            ) : (
              <ChevronDown className="h-[15px] w-[15px]" />
            )}
          </div>
        </div>

        {/* Subject matrix */}
        {open && (
          <div className="bg-white pb-3">
            {arm.subjects.length === 0 ? (
              <p className="px-5 py-3 text-[13px] text-text-body">
                No records submitted yet.
              </p>
            ) : (
              <SubjectMatrix
                subjects={arm.subjects}
                onPublish={onPublish}
                onViewCell={(subject, type) => setViewing({ subject, type })}
                publishingId={publishingId}
              />
            )}
          </div>
        )}
      </div>

      {viewing && (
        <StudentScoresModal
          armId={arm.armId}
          armName={arm.armName}
          subject={viewing.subject}
          term={term}
          assessmentType={viewing.type}
          onClose={() => setViewing(null)}
        />
      )}
    </>
  );
}
