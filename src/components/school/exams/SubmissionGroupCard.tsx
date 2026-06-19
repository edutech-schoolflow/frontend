"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Eye,
  Layers,
  Printer,
  Clock,
  MessageSquare,
} from "lucide-react";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_BG,
  EXAM_TYPE_LABELS,
} from "@/src/types/examPaper";
import type { ExamPaper, ExamPaperStatus } from "@/src/types/examPaper";
import type { SubmissionGroup } from "@/src/hooks/useSchoolExams";
import QuestionReview from "./QuestionReview";

function totalMarks(paper: ExamPaper) {
  return paper.questions.reduce((s, q) => s + q.marks, 0);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: ExamPaperStatus }) {
  return (
    <span
      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
      style={{
        color: STATUS_COLORS[status],
        backgroundColor: STATUS_BG[status],
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

export default function SubmissionGroupCard({
  group,
  existingUnified,
  onApprove,
  onReject,
  onSaveFeedback,
  onBuildUnified,
  onPreview,
  approvingId,
}: {
  group: SubmissionGroup;
  existingUnified: ExamPaper | undefined;
  onApprove: (paperId: string) => void;
  onReject: (paperId: string, comment: string) => void;
  onSaveFeedback: (
    paperId: string,
    feedback: string,
    questionNotes: Record<string, string>
  ) => Promise<void>;
  onBuildUnified: (group: SubmissionGroup) => void;
  onPreview: (paper: ExamPaper) => void;
  approvingId: string | null;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  const actionablePapers = group.papers.filter((p) => p.status !== "draft");
  const draftCount = group.papers.length - actionablePapers.length;
  const approvedCount = actionablePapers.filter(
    (p) => p.status === "approved"
  ).length;
  const pendingCount = actionablePapers.filter(
    (p) => p.status === "submitted"
  ).length;
  const canBuild = approvedCount >= 1 && !existingUnified;

  const handleRejectConfirm = () => {
    if (!rejectingId || !rejectComment.trim()) return;
    onReject(rejectingId, rejectComment.trim());
    setRejectingId(null);
    setRejectComment("");
  };

  return (
    <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
      {/* Header */}
      <div
        className="flex cursor-pointer items-center gap-3 px-5 py-4 transition-colors hover:bg-[#f9fafb]"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? (
          <ChevronDown className="h-[16px] w-[16px] shrink-0 text-[#6b7280]" />
        ) : (
          <ChevronRight className="h-[16px] w-[16px] shrink-0 text-[#6b7280]" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[15px] font-semibold text-text-heading">
              {group.className} — {group.subject}
            </span>
            <span className="text-[12px] text-text-body">
              {EXAM_TYPE_LABELS[group.examType]}
            </span>
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-[12px]">
            {pendingCount > 0 && (
              <span className="flex items-center gap-1 font-medium text-[#d97706]">
                <Clock className="h-[11px] w-[11px]" />
                {pendingCount} pending review
              </span>
            )}
            {pendingCount > 0 && approvedCount > 0 && (
              <span className="text-[#d1d5db]">·</span>
            )}
            {approvedCount > 0 && (
              <span className="flex items-center gap-1 font-medium text-[#16a34a]">
                <CheckCircle2 className="h-[11px] w-[11px]" />
                {approvedCount} approved
              </span>
            )}
            {draftCount > 0 && (
              <span className="text-[#9ca3af]">
                {pendingCount > 0 || approvedCount > 0 ? "· " : ""}
                {draftCount} still drafting
              </span>
            )}
            {pendingCount === 0 && approvedCount === 0 && draftCount === 0 && (
              <span className="text-[#9ca3af]">No submissions</span>
            )}
          </div>
        </div>

        {existingUnified && (
          <div
            className={`flex shrink-0 items-center gap-1.5 rounded-[8px] px-2.5 py-1 text-[11px] font-medium ${
              existingUnified.status === "approved"
                ? "bg-[#eff6ff] text-[#2563eb]"
                : "bg-[#f3f4f6] text-[#6b7280]"
            }`}
          >
            <Layers className="h-[12px] w-[12px]" />
            {existingUnified.status === "approved"
              ? "Ready to print"
              : "Unified draft"}
          </div>
        )}
        {canBuild && (
          <div className="flex shrink-0 items-center gap-1.5 rounded-[8px] bg-[#f0fdf4] px-2.5 py-1 text-[11px] font-medium text-brand-green">
            <Layers className="h-[12px] w-[12px]" />
            Can build unified
          </div>
        )}
      </div>

      {expanded && (
        <>
          {/* Arm rows */}
          <div className="space-y-4 border-t border-[#e5e7eb] px-5 py-4">
            {actionablePapers.length === 0 ? (
              <p className="text-[13px] text-[#9ca3af]">
                No submissions yet —{" "}
                {draftCount > 0
                  ? `${draftCount} teacher${draftCount !== 1 ? "s are" : " is"} still drafting.`
                  : "teachers haven't started yet."}
              </p>
            ) : (
              actionablePapers.map((paper) => (
                <div key={paper.id}>
                  <div className="flex items-center gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[14px] font-medium text-text-heading">
                          {paper.armName}
                        </span>
                        <StatusBadge status={paper.status} />
                      </div>
                      <p className="mt-0.5 text-[12px] text-text-body">
                        {paper.teacherName} · {paper.questions.length} questions
                        · {totalMarks(paper)} marks
                        {paper.submittedAt && (
                          <> · Submitted {formatDate(paper.submittedAt)}</>
                        )}
                      </p>
                      {paper.status === "rejected" && paper.reviewComment && (
                        <p className="mt-1 text-[12px] text-[#dc2626]">
                          Reason: {paper.reviewComment}
                        </p>
                      )}
                      {(paper.adminFeedback ||
                        paper.questions.some((q) => q.reviewNote)) && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[11px] text-brand-green">
                          <MessageSquare className="h-[11px] w-[11px]" />
                          Feedback added
                        </span>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      {paper.questions.length > 0 && (
                        <button
                          onClick={() =>
                            setReviewingId((id) =>
                              id === paper.id ? null : paper.id
                            )
                          }
                          className={`flex items-center gap-1 rounded-[6px] border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
                            reviewingId === paper.id
                              ? "border-brand-green bg-[#f0fdf4] text-brand-green"
                              : "border-[#e5e7eb] text-text-body hover:bg-[#f3f4f6]"
                          }`}
                        >
                          <Eye className="h-[12px] w-[12px]" />
                          {reviewingId === paper.id ? "Hide" : "Review"}
                        </button>
                      )}

                      {paper.status === "submitted" &&
                        rejectingId !== paper.id && (
                          <>
                            <button
                              onClick={() => onApprove(paper.id)}
                              disabled={approvingId === paper.id}
                              className="flex items-center gap-1 rounded-[6px] bg-[#f0fdf4] px-2.5 py-1.5 text-[12px] font-medium text-[#16a34a] hover:bg-[#dcfce7] disabled:opacity-50"
                            >
                              <CheckCircle2 className="h-[12px] w-[12px]" />
                              {approvingId === paper.id ? "…" : "Approve"}
                            </button>
                            <button
                              onClick={() => {
                                setRejectingId(paper.id);
                                setRejectComment("");
                              }}
                              className="flex items-center gap-1 rounded-[6px] bg-[#fef2f2] px-2.5 py-1.5 text-[12px] font-medium text-[#dc2626] hover:bg-[#fee2e2]"
                            >
                              <XCircle className="h-[12px] w-[12px]" />
                              Reject
                            </button>
                          </>
                        )}
                    </div>
                  </div>

                  {reviewingId === paper.id && (
                    <QuestionReview
                      paper={paper}
                      onSaveFeedback={(feedback, questionNotes) =>
                        onSaveFeedback(paper.id, feedback, questionNotes)
                      }
                    />
                  )}

                  {rejectingId === paper.id && (
                    <div className="mt-3 rounded-[10px] border border-[#fecaca] bg-[#fef2f2] p-4">
                      <p className="mb-2 text-[13px] font-medium text-[#dc2626]">
                        Reason for rejection
                      </p>
                      <textarea
                        value={rejectComment}
                        onChange={(e) => setRejectComment(e.target.value)}
                        rows={2}
                        placeholder="Explain what needs to be corrected…"
                        className="w-full resize-none rounded-[8px] border border-[#fca5a5] bg-white px-3 py-2 text-[13px] text-text-heading focus:border-[#dc2626] focus:outline-none"
                        autoFocus
                      />
                      <div className="mt-3 flex gap-2">
                        <button
                          onClick={handleRejectConfirm}
                          disabled={!rejectComment.trim()}
                          className="rounded-[6px] bg-[#dc2626] px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-90 disabled:opacity-50"
                        >
                          Confirm reject
                        </button>
                        <button
                          onClick={() => {
                            setRejectingId(null);
                            setRejectComment("");
                          }}
                          className="rounded-[6px] border border-[#e5e7eb] px-3 py-1.5 text-[12px] font-medium text-text-body hover:bg-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Unified paper footer */}
          {(canBuild || existingUnified) && (
            <div className="flex items-center gap-3 border-t border-[#e5e7eb] bg-[#f9fafb] px-5 py-3">
              <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#e8f5ee]">
                <Layers className="h-[15px] w-[15px] text-brand-green" />
              </div>

              {existingUnified ? (
                <>
                  <div className="min-w-0 flex-1">
                    <span className="text-[13px] font-medium text-text-heading">
                      Unified paper
                    </span>
                    <span className="ml-2">
                      <StatusBadge status={existingUnified.status} />
                    </span>
                    <span className="ml-2 text-[12px] text-text-body">
                      {existingUnified.questions.length} questions ·{" "}
                      {totalMarks(existingUnified)} marks
                    </span>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    {existingUnified.status === "approved" && (
                      <button
                        onClick={() => onPreview(existingUnified)}
                        className="flex items-center gap-1.5 rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-1.5 text-[12px] font-medium text-text-body hover:bg-[#f3f4f6]"
                      >
                        <Printer className="h-[13px] w-[13px]" />
                        Print
                      </button>
                    )}
                    <button
                      onClick={() =>
                        router.push(
                          `/school/dashboard/exams/unified/${existingUnified.id}`
                        )
                      }
                      className="rounded-[8px] bg-brand-green px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-90"
                    >
                      {existingUnified.status === "approved"
                        ? "View paper"
                        : "Edit unified paper"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <span className="text-[13px] font-medium text-text-heading">
                      Ready to build unified paper
                    </span>
                    <span className="ml-2 text-[12px] text-text-body">
                      {approvedCount} arm{approvedCount !== 1 ? "s" : ""}{" "}
                      approved
                    </span>
                  </div>
                  <button
                    onClick={() => onBuildUnified(group)}
                    className="flex shrink-0 items-center gap-1.5 rounded-[8px] bg-brand-green px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-90"
                  >
                    <Layers className="h-[13px] w-[13px]" />
                    Build unified paper
                  </button>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
