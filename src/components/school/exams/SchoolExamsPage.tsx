"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  CheckCircle2,
  XCircle,
  Eye,
  Layers,
  Printer,
  Clock,
} from "lucide-react";
import {
  getAllArmSubmissions,
  getAllUnifiedPapers,
  approveExamPaper,
  rejectExamPaper,
  createUnifiedPaper,
} from "@/src/lib/api/examPaper";
import type {
  ExamPaper,
  ExamPaperStatus,
  ExamType,
} from "@/src/types/examPaper";
import {
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_BG,
  EXAM_TYPE_LABELS,
} from "@/src/types/examPaper";
import type { GradeTerm } from "@/src/types/scoreEntry";
import { TERM_LABELS } from "@/src/types/scoreEntry";
import ExamPaperPreview from "@/src/components/teacher/exams/ExamPaperPreview";

const SCHOOL_NAME = "Greenfield Academy";
const TERMS: GradeTerm[] = ["first_term", "second_term", "third_term"];
type StatusFilter = "all" | "pending" | "ready";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface SubmissionGroup {
  key: string;
  className: string;
  subject: string;
  term: GradeTerm;
  examType: ExamType;
  papers: ExamPaper[];
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function groupSubmissions(papers: ExamPaper[]): SubmissionGroup[] {
  const map = new Map<string, SubmissionGroup>();
  for (const paper of papers) {
    const cn = paper.className ?? paper.armName.replace(/\s[A-Z]$/, "");
    const key = `${cn}::${paper.subject}::${paper.term}::${paper.examType}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        className: cn,
        subject: paper.subject,
        term: paper.term,
        examType: paper.examType,
        papers: [],
      });
    }
    map.get(key)!.papers.push(paper);
  }
  return Array.from(map.values()).sort((a, b) => {
    const cn = a.className.localeCompare(b.className);
    return cn !== 0 ? cn : a.subject.localeCompare(b.subject);
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function totalMarks(paper: ExamPaper) {
  return paper.questions.reduce((s, q) => s + q.marks, 0);
}

// ─── Status badge ──────────────────────────────────────────────────────────────

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

// ─── Inline question review ─────────────────────────────────────────────────────

function QuestionReview({ paper }: { paper: ExamPaper }) {
  return (
    <div className="mt-3 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-4">
      <p className="mb-3 text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
        Questions ({paper.questions.length} · {totalMarks(paper)} marks total)
      </p>
      <div className="space-y-3">
        {paper.questions.map((q, i) => (
          <div
            key={q.id}
            className="rounded-[8px] border border-[#e5e7eb] bg-white p-3"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[12px] font-bold text-text-body">
                {i + 1}.
              </span>
              <span
                className={`rounded-[4px] px-1.5 py-0.5 text-[10px] font-medium ${
                  q.type === "multiple_choice"
                    ? "bg-[#eff6ff] text-[#2563eb]"
                    : "bg-[#fef3c7] text-[#d97706]"
                }`}
              >
                {q.type === "multiple_choice" ? "MC" : "Theory"}
              </span>
              <span className="text-[11px] text-[#9ca3af]">
                {q.marks} {q.marks === 1 ? "mark" : "marks"}
              </span>
            </div>
            <p className="text-[13px] text-text-heading">{q.text}</p>
            {q.type === "multiple_choice" && q.options && (
              <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5">
                {q.options.map((opt) => (
                  <span
                    key={opt.id}
                    className={`text-[12px] ${
                      opt.id === q.answer
                        ? "font-semibold text-[#16a34a]"
                        : "text-text-body"
                    }`}
                  >
                    {opt.id}. {opt.text}
                    {opt.id === q.answer && " ✓"}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Submission group card ──────────────────────────────────────────────────────

function SubmissionGroupCard({
  group,
  existingUnified,
  onApprove,
  onReject,
  onBuildUnified,
  onPreview,
  approvingId,
}: {
  group: SubmissionGroup;
  existingUnified: ExamPaper | undefined;
  onApprove: (paperId: string) => void;
  onReject: (paperId: string, comment: string) => void;
  onBuildUnified: (group: SubmissionGroup) => void;
  onPreview: (paper: ExamPaper) => void;
  approvingId: string | null;
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  // Exclude pure drafts — admin can't action them
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
        className="flex cursor-pointer items-center gap-3 px-5 py-4 hover:bg-[#f9fafb] transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? (
          <ChevronDown className="h-[16px] w-[16px] shrink-0 text-[#6b7280]" />
        ) : (
          <ChevronRight className="h-[16px] w-[16px] shrink-0 text-[#6b7280]" />
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
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

        {/* Unified paper status badge — visible even when collapsed */}
        {existingUnified && (
          <div
            className={`shrink-0 flex items-center gap-1.5 rounded-[8px] px-2.5 py-1 text-[11px] font-medium ${
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
          <div className="shrink-0 flex items-center gap-1.5 rounded-[8px] bg-[#f0fdf4] px-2.5 py-1 text-[11px] font-medium text-brand-green">
            <Layers className="h-[12px] w-[12px]" />
            Can build unified
          </div>
        )}
      </div>

      {expanded && (
        <>
          {/* Arm rows */}
          <div className="border-t border-[#e5e7eb] px-5 py-4 space-y-4">
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
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
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

                  {reviewingId === paper.id && <QuestionReview paper={paper} />}

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

          {/* Unified paper footer — always visible once expanded */}
          {(canBuild || existingUnified) && (
            <div className="flex items-center gap-3 border-t border-[#e5e7eb] bg-[#f9fafb] px-5 py-3">
              <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-[8px] bg-[#e8f5ee]">
                <Layers className="h-[15px] w-[15px] text-brand-green" />
              </div>

              {existingUnified ? (
                <>
                  <div className="flex-1 min-w-0">
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
                  <div className="flex-1 min-w-0">
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

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function SchoolExamsPage() {
  const router = useRouter();

  const [term, setTerm] = useState<GradeTerm>("second_term");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [armPapers, setArmPapers] = useState<ExamPaper[]>([]);
  const [unifiedPapers, setUnifiedPapers] = useState<ExamPaper[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [buildingGroupKey, setBuildingGroupKey] = useState<string | null>(null);
  const [previewPaper, setPreviewPaper] = useState<ExamPaper | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAllArmSubmissions(), getAllUnifiedPapers()]).then(
      ([arm, unified]) => {
        if (cancelled) return;
        setArmPapers(arm);
        setUnifiedPapers(unified);
        setLoaded(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const termPapers = useMemo(
    () => armPapers.filter((p) => p.term === term),
    [armPapers, term]
  );
  const allGroups = useMemo(() => groupSubmissions(termPapers), [termPapers]);

  const getExistingUnified = useCallback(
    (group: SubmissionGroup) =>
      unifiedPapers.find(
        (up) =>
          up.className === group.className &&
          up.subject === group.subject &&
          up.term === group.term &&
          up.examType === group.examType
      ),
    [unifiedPapers]
  );

  const visibleGroups = useMemo(() => {
    if (statusFilter === "pending")
      return allGroups.filter((g) =>
        g.papers.some((p) => p.status === "submitted")
      );
    if (statusFilter === "ready")
      return allGroups.filter(
        (g) => getExistingUnified(g)?.status === "approved"
      );
    return allGroups;
  }, [allGroups, statusFilter, getExistingUnified]);

  const pendingCount = termPapers.filter(
    (p) => p.status === "submitted"
  ).length;
  const approvedCount = termPapers.filter(
    (p) => p.status === "approved"
  ).length;
  const finalizedCount = unifiedPapers.filter(
    (p) => p.term === term && p.status === "approved"
  ).length;

  const handleApprove = async (paperId: string) => {
    setApprovingId(paperId);
    const updated = await approveExamPaper(paperId);
    setArmPapers((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
    setApprovingId(null);
  };

  const handleReject = async (paperId: string, comment: string) => {
    const updated = await rejectExamPaper(paperId, comment);
    setArmPapers((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleBuildUnified = async (group: SubmissionGroup) => {
    setBuildingGroupKey(group.key);
    const approved = group.papers.filter((p) => p.status === "approved");
    const mergedQuestions = approved.flatMap((p) =>
      p.questions.map((q) => ({
        ...q,
        id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        sourceArm: p.armName,
      }))
    );
    const paper = await createUnifiedPaper({
      className: group.className,
      subject: group.subject,
      term: group.term,
      examType: group.examType,
      duration: approved[0].duration,
      instructions: approved[0].instructions,
      questions: mergedQuestions,
      sourceArmIds: approved.map((p) => p.armId),
    });
    router.push(`/school/dashboard/exams/unified/${paper.id}`);
  };

  return (
    <div className="p-[30px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Exam Questions
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          Review arm submissions, approve papers, and build unified exam papers
          for printing.
        </p>
      </div>

      {/* Stats */}
      {loaded && (
        <div className="mb-6 grid grid-cols-4 gap-4">
          {[
            {
              label: "Total submissions",
              value: termPapers.length,
              color: "text-text-heading",
              bg: "bg-[#f9fafb]",
            },
            {
              label: "Pending review",
              value: pendingCount,
              color: "text-[#d97706]",
              bg: "bg-[#fffbeb]",
            },
            {
              label: "Approved",
              value: approvedCount,
              color: "text-[#16a34a]",
              bg: "bg-[#f0fdf4]",
            },
            {
              label: "Ready to print",
              value: finalizedCount,
              color: "text-[#2563eb]",
              bg: "bg-[#eff6ff]",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`rounded-[12px] ${stat.bg} px-5 py-4`}
            >
              <p className={`text-[28px] font-bold ${stat.color}`}>
                {stat.value}
              </p>
              <p className="mt-0.5 text-[13px] text-text-body">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filter bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          value={term}
          onChange={(e) => {
            setTerm(e.target.value as GradeTerm);
            setStatusFilter("all");
          }}
          className="h-[36px] rounded-[8px] border border-[#e5e7eb] bg-white px-3 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
        >
          {TERMS.map((t) => (
            <option key={t} value={t}>
              {TERM_LABELS[t]}
            </option>
          ))}
        </select>

        <div className="flex gap-1 rounded-[10px] border border-[#e5e7eb] bg-[#f3f4f6] p-1">
          {[
            { id: "all" as StatusFilter, label: "All" },
            {
              id: "pending" as StatusFilter,
              label: "Needs review",
              count: pendingCount,
              dot: "bg-[#d97706]",
            },
            {
              id: "ready" as StatusFilter,
              label: "Ready to print",
              count: finalizedCount,
              dot: "bg-[#2563eb]",
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`rounded-[8px] px-4 py-1.5 text-[13px] font-medium transition-colors ${
                statusFilter === tab.id
                  ? "bg-white text-text-heading shadow-sm"
                  : "text-text-body hover:text-text-heading"
              }`}
            >
              {tab.label}
              {tab.count != null && tab.count > 0 && (
                <span
                  className={`ml-1.5 rounded-full ${tab.dot} px-1.5 py-0.5 text-[10px] font-semibold text-white`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Loading skeleton */}
      {!loaded && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[76px] animate-pulse rounded-[12px] bg-[#f3f4f6]"
            />
          ))}
        </div>
      )}

      {/* Group list */}
      {loaded &&
        (visibleGroups.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[12px] border border-dashed border-[#e5e7eb] py-16 text-center">
            <FileText className="h-[40px] w-[40px] text-[#d1d5db]" />
            <p className="text-[15px] font-medium text-text-heading">
              {statusFilter === "pending"
                ? "No papers pending review"
                : statusFilter === "ready"
                  ? "No papers ready to print yet"
                  : "No submissions yet"}
            </p>
            <p className="text-[13px] text-text-body">
              {statusFilter === "all"
                ? "Teachers haven&apos;t submitted any exam papers for review."
                : `Switch to "All" to see everything for this term.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visibleGroups.map((group) => (
              <SubmissionGroupCard
                key={group.key}
                group={group}
                existingUnified={getExistingUnified(group)}
                onApprove={handleApprove}
                onReject={handleReject}
                onBuildUnified={handleBuildUnified}
                onPreview={setPreviewPaper}
                approvingId={approvingId}
              />
            ))}
          </div>
        ))}

      {/* Build spinner overlay */}
      {buildingGroupKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="flex items-center gap-3 rounded-[12px] bg-white px-6 py-5 shadow-xl">
            <div className="h-[24px] w-[24px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
            <span className="text-[14px] font-medium text-text-heading">
              Building unified paper…
            </span>
          </div>
        </div>
      )}

      {/* Preview / print modal */}
      {previewPaper && (
        <ExamPaperPreview
          paper={previewPaper}
          schoolName={SCHOOL_NAME}
          onClose={() => setPreviewPaper(null)}
          canPrint={true}
          classLabel={previewPaper.className}
        />
      )}
    </div>
  );
}
