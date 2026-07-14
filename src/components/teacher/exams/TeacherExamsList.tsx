"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  FileText,
  ChevronDown,
  Trash2,
  MessageSquare,
} from "lucide-react";
import {
  getTeacherExamPapers,
  createExamPaper,
  deleteExamPaper,
} from "@/src/lib/api/examPaper";
import { getTeacherGradeArms } from "@/src/lib/api/gradeEntry";
import { getSubjectsForLevel } from "@/src/lib/api/gradeEntry";
import type {
  ExamPaper,
  ExamType,
  ExamPaperStatus,
} from "@/src/types/examPaper";
import {
  EXAM_TYPE_LABELS,
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_BG,
} from "@/src/types/examPaper";
import type { GradeTerm } from "@/src/types/scoreEntry";
import { TERM_LABELS } from "@/src/types/scoreEntry";
import type { ArmSelectOption } from "@/src/lib/api/attendance";
import { useIdentity } from "@/src/lib/api/useIdentity";

// ─── Helpers ───────────────────────────────────────────────────────────────────

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
      className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
      style={{
        color: STATUS_COLORS[status],
        backgroundColor: STATUS_BG[status],
      }}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}

// ─── New paper modal ───────────────────────────────────────────────────────────

function NewPaperModal({
  arms,
  onClose,
  onCreate,
}: {
  arms: ArmSelectOption[];
  onClose: () => void;
  onCreate: (paper: ExamPaper) => void;
}) {
  const { data: user } = useIdentity();
  const [armId, setArmId] = useState(arms[0]?.armId ?? "");
  const [subject, setSubject] = useState("");
  const [term, setTerm] = useState<GradeTerm>("second_term");
  const [examType, setExamType] = useState<ExamType>("final");
  const [duration, setDuration] = useState(60);
  const [creating, setCreating] = useState(false);

  const selectedArm = arms.find((a) => a.armId === armId);
  const subjects = selectedArm ? getSubjectsForLevel(selectedArm.level) : [];

  const handleCreate = async () => {
    if (!armId || !subject) return;
    setCreating(true);
    const paper = await createExamPaper({
      armId,
      armName: selectedArm?.armName ?? "",
      subject,
      term,
      examType,
      duration,
      instructions: "Answer all questions.",
      teacherName: user?.fullName ?? "Teacher",
    });
    onCreate(paper);
  };

  const selectCls =
    "h-[40px] w-full appearance-none rounded-[8px] border border-[#e5e7eb] bg-white px-3 pr-8 text-[14px] text-text-heading focus:border-brand-green focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-[440px] rounded-[14px] bg-white p-6 shadow-xl">
        <h2 className="mb-5 text-[18px] font-semibold text-text-heading">
          New exam paper
        </h2>

        <div className="space-y-4">
          {/* Arm */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-text-body">
              Class arm
            </label>
            <div className="relative">
              <select
                value={armId}
                onChange={(e) => {
                  setArmId(e.target.value);
                  setSubject("");
                }}
                className={selectCls}
              >
                {arms.map((a) => (
                  <option key={a.armId} value={a.armId}>
                    {a.armName}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-[15px] w-[15px] -translate-y-1/2 text-[#6b7280]" />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-text-body">
              Subject
            </label>
            <div className="relative">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className={selectCls}
              >
                <option value="">Select subject</option>
                {subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-[15px] w-[15px] -translate-y-1/2 text-[#6b7280]" />
            </div>
          </div>

          {/* Term + Exam type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-text-body">
                Term
              </label>
              <div className="relative">
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value as GradeTerm)}
                  className={selectCls}
                >
                  {(Object.entries(TERM_LABELS) as [GradeTerm, string][]).map(
                    ([v, l]) => (
                      <option key={v} value={v}>
                        {l}
                      </option>
                    )
                  )}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-[15px] w-[15px] -translate-y-1/2 text-[#6b7280]" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-text-body">
                Exam type
              </label>
              <div className="relative">
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value as ExamType)}
                  className={selectCls}
                >
                  {(
                    Object.entries(EXAM_TYPE_LABELS) as [ExamType, string][]
                  ).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 h-[15px] w-[15px] -translate-y-1/2 text-[#6b7280]" />
              </div>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="mb-1 block text-[13px] font-medium text-text-body">
              Duration (minutes)
            </label>
            <input
              type="number"
              min={15}
              max={240}
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="h-[40px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[14px] text-text-heading focus:border-brand-green focus:outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-[8px] border border-[#e5e7eb] py-2.5 text-[14px] font-medium text-text-heading hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!armId || !subject || creating}
            className="flex-1 rounded-[8px] bg-brand-green py-2.5 text-[14px] font-medium text-white hover:opacity-90 disabled:opacity-50"
          >
            {creating ? "Creating…" : "Create & edit"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function StaffExamsList() {
  const router = useRouter();

  const [papers, setPapers] = useState<ExamPaper[]>([]);
  const [arms, setArms] = useState<ArmSelectOption[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getTeacherExamPapers(undefined),
      getTeacherGradeArms(undefined),
    ]).then(([paperList, armList]) => {
      if (cancelled) return;
      setPapers(paperList);
      setArms(armList);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (paperId: string) => {
    setDeletingId(paperId);
    await deleteExamPaper(paperId);
    setPapers((prev) => prev.filter((p) => p.id !== paperId));
    setDeletingId(null);
    setConfirmDeleteId(null);
  };

  const mcCount = (p: ExamPaper) =>
    p.questions.filter((q) => q.type === "multiple_choice").length;
  const theoryCount = (p: ExamPaper) =>
    p.questions.filter((q) => q.type === "theory").length;

  return (
    <div className="p-[30px]">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-semibold text-text-heading">
            Exam Questions
          </h1>
          <p className="mt-0.5 text-[14px] text-text-body">
            Set exam papers, save drafts, and submit to the school for approval.
          </p>
        </div>
        {loaded && arms.length > 0 && (
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 rounded-[8px] bg-brand-green px-4 py-2.5 text-[14px] font-medium text-white hover:opacity-90"
          >
            <Plus className="h-[16px] w-[16px]" />
            New exam paper
          </button>
        )}
      </div>

      {/* Loading */}
      {!loaded && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[90px] animate-pulse rounded-[12px] bg-[#f3f4f6]"
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {loaded && papers.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-[12px] border border-dashed border-[#e5e7eb] py-16 text-center">
          <FileText className="h-[40px] w-[40px] text-[#d1d5db]" />
          <p className="text-[15px] font-medium text-text-heading">
            No exam papers yet
          </p>
          <p className="max-w-[300px] text-[13px] text-text-body">
            Create your first exam paper. You can save it as a draft and come
            back to finish it.
          </p>
          {arms.length > 0 && (
            <button
              onClick={() => setShowNewModal(true)}
              className="mt-1 flex items-center gap-1.5 rounded-[8px] bg-brand-green px-4 py-2 text-[13px] font-medium text-white hover:opacity-90"
            >
              <Plus className="h-[14px] w-[14px]" />
              New exam paper
            </button>
          )}
          {arms.length === 0 && (
            <p className="text-[12px] text-[#9ca3af]">
              You need to be assigned as class teacher before you can create
              exam papers.
            </p>
          )}
        </div>
      )}

      {/* Papers list */}
      {loaded && papers.length > 0 && (
        <div className="space-y-3">
          {papers.map((paper) => (
            <div
              key={paper.id}
              className="flex cursor-pointer items-center justify-between rounded-[12px] border border-[#e5e7eb] bg-white px-5 py-4 transition-shadow hover:shadow-sm"
              onClick={() => router.push(`/staff/dashboard/exams/${paper.id}`)}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[10px] bg-[#f0fdf4]">
                  <FileText className="h-[20px] w-[20px] text-brand-green" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-semibold text-text-heading">
                      {paper.subject}
                    </span>
                    <StatusBadge status={paper.status} />
                  </div>
                  <p className="mt-0.5 text-[13px] text-text-body">
                    {paper.armName} · {TERM_LABELS[paper.term]} ·{" "}
                    {EXAM_TYPE_LABELS[paper.examType]} · {paper.duration} mins
                  </p>
                  <div className="mt-1.5 flex items-center gap-3 text-[12px] text-[#9ca3af]">
                    <span>{paper.questions.length} questions</span>
                    {paper.questions.length > 0 && (
                      <>
                        <span>·</span>
                        <span>{mcCount(paper)} MC</span>
                        <span>·</span>
                        <span>{theoryCount(paper)} theory</span>
                        <span>·</span>
                        <span>{totalMarks(paper)} marks total</span>
                      </>
                    )}
                    <span>·</span>
                    <span>Updated {formatDate(paper.updatedAt)}</span>
                  </div>
                  {paper.status === "rejected" && paper.reviewComment && (
                    <p className="mt-1.5 text-[12px] font-medium text-[#dc2626]">
                      Rejected: {paper.reviewComment}
                    </p>
                  )}
                  {(paper.adminFeedback ||
                    paper.questions.some((q) => q.reviewNote)) && (
                    <span className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium text-[#059669]">
                      <MessageSquare className="h-[12px] w-[12px]" />
                      Feedback from admin
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div
                className="flex shrink-0 items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {paper.status === "draft" && (
                  <>
                    {confirmDeleteId === paper.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-text-body">
                          Delete?
                        </span>
                        <button
                          onClick={() => handleDelete(paper.id)}
                          disabled={deletingId === paper.id}
                          className="rounded-[6px] bg-[#dc2626] px-2.5 py-1 text-[12px] text-white hover:opacity-90 disabled:opacity-50"
                        >
                          {deletingId === paper.id ? "…" : "Yes"}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="rounded-[6px] border border-[#e5e7eb] px-2.5 py-1 text-[12px] text-text-body hover:bg-[#f9fafb]"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(paper.id)}
                        className="rounded-[6px] p-1.5 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#dc2626]"
                        title="Delete draft"
                      >
                        <Trash2 className="h-[15px] w-[15px]" />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New paper modal */}
      {showNewModal && (
        <NewPaperModal
          arms={arms}
          onClose={() => setShowNewModal(false)}
          onCreate={(paper) => {
            setShowNewModal(false);
            router.push(`/staff/dashboard/exams/${paper.id}`);
          }}
        />
      )}
    </div>
  );
}
