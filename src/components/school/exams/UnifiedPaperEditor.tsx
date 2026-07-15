"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Eye,
  CheckCircle2,
  GripVertical,
  Printer,
} from "lucide-react";
import {
  getExamPaper,
  saveExamPaper,
  finalizeUnifiedPaper,
} from "@/src/lib/api/examPaper";
import type {
  ExamPaper,
  ExamQuestion,
  QuestionType,
  MCOption,
  MCOptionId,
} from "@/src/types/examPaper";
import {
  MC_OPTION_IDS,
  STATUS_LABELS,
  STATUS_COLORS,
  STATUS_BG,
  EXAM_TYPE_LABELS,
} from "@/src/types/examPaper";
import { TERM_LABELS } from "@/src/types/scoreEntry";
import ExamPaperPreview from "@/src/components/teacher/exams/ExamPaperPreview";
import { useWorkspaceHref } from "@/src/hooks/useWorkspaceHref";

const SCHOOL_NAME = "Greenfield Academy";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const blankOptions = (): MCOption[] =>
  MC_OPTION_IDS.map((id) => ({ id, text: "" }));

interface QuestionDraft {
  type: QuestionType;
  text: string;
  marks: number;
  options: MCOption[];
  answer: string;
}

const blankDraft = (): QuestionDraft => ({
  type: "multiple_choice",
  text: "",
  marks: 2,
  options: blankOptions(),
  answer: "",
});

// ─── Question form ─────────────────────────────────────────────────────────────

function QuestionForm({
  draft,
  onChange,
  onSave,
  onCancel,
  isEdit,
}: {
  draft: QuestionDraft;
  onChange: (d: QuestionDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  isEdit: boolean;
}) {
  const canSave =
    draft.text.trim() !== "" &&
    draft.marks > 0 &&
    (draft.type === "theory" ||
      (draft.options.every((o) => o.text.trim() !== "") &&
        draft.answer !== ""));

  return (
    <div className="rounded-[12px] border-2 border-brand-green/30 bg-[#f0fdf4] p-5">
      {/* Type tabs */}
      <div className="mb-4 flex gap-2">
        {(["multiple_choice", "theory"] as QuestionType[]).map((t) => (
          <button
            key={t}
            onClick={() =>
              onChange({
                ...draft,
                type: t,
                options: t === "multiple_choice" ? blankOptions() : [],
                answer: "",
              })
            }
            className={`rounded-[6px] px-3 py-1.5 text-[13px] font-medium transition-colors ${
              draft.type === t
                ? "bg-brand-green text-white"
                : "border border-[#e5e7eb] bg-white text-text-body hover:border-brand-green"
            }`}
          >
            {t === "multiple_choice" ? "Multiple Choice" : "Theory"}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-[13px] font-medium text-text-body">
          Question
        </label>
        <textarea
          value={draft.text}
          onChange={(e) => onChange({ ...draft, text: e.target.value })}
          rows={3}
          placeholder="Type the question here…"
          className="w-full resize-none rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2 text-[14px] text-text-heading focus:border-brand-green focus:outline-none"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block text-[13px] font-medium text-text-body">
          Marks
        </label>
        <input
          type="number"
          min={1}
          max={100}
          value={draft.marks}
          onChange={(e) =>
            onChange({ ...draft, marks: Number(e.target.value) })
          }
          className="h-[38px] w-[80px] rounded-[8px] border border-[#e5e7eb] bg-white px-3 text-[14px] text-text-heading focus:border-brand-green focus:outline-none"
        />
      </div>

      {draft.type === "multiple_choice" && (
        <div className="mb-4">
          <label className="mb-2 block text-[13px] font-medium text-text-body">
            Options{" "}
            <span className="font-normal text-[#9ca3af]">
              — click the radio to mark the correct answer
            </span>
          </label>
          <div className="space-y-2">
            {draft.options.map((opt) => (
              <div key={opt.id} className="flex items-center gap-3">
                <input
                  type="radio"
                  name={`answer-${draft.text.slice(0, 10)}`}
                  checked={draft.answer === opt.id}
                  onChange={() => onChange({ ...draft, answer: opt.id })}
                  className="h-[16px] w-[16px] accent-[#16a34a]"
                />
                <span className="w-[20px] shrink-0 text-[13px] font-bold text-text-body">
                  {opt.id}.
                </span>
                <input
                  type="text"
                  value={opt.text}
                  onChange={(e) =>
                    onChange({
                      ...draft,
                      options: draft.options.map((o) =>
                        o.id === opt.id ? { ...o, text: e.target.value } : o
                      ),
                    })
                  }
                  placeholder={`Option ${opt.id}`}
                  className="flex-1 rounded-[6px] border border-[#e5e7eb] bg-white px-3 py-1.5 text-[14px] text-text-heading focus:border-brand-green focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {draft.type === "theory" && (
        <div className="mb-4">
          <label className="mb-1 block text-[13px] font-medium text-text-body">
            Model answer{" "}
            <span className="font-normal text-[#9ca3af]">(optional)</span>
          </label>
          <textarea
            value={draft.answer}
            onChange={(e) => onChange({ ...draft, answer: e.target.value })}
            rows={2}
            placeholder="Expected answer or marking guide…"
            className="w-full resize-none rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
          />
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={onSave}
          disabled={!canSave}
          className="rounded-[8px] bg-brand-green px-4 py-2 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {isEdit ? "Update question" : "Add question"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-medium text-text-body hover:bg-[#f9fafb]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Question card ─────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  isEditable,
  onEdit,
  onDelete,
}: {
  question: ExamQuestion;
  index: number;
  isEditable: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="group flex items-start gap-3 rounded-[10px] border border-[#e5e7eb] bg-white p-4 transition-shadow hover:shadow-sm">
      {isEditable && (
        <GripVertical className="mt-0.5 h-[16px] w-[16px] shrink-0 text-[#d1d5db]" />
      )}
      <div className="flex-1 min-w-0">
        <div className="mb-1 flex items-center gap-2 flex-wrap">
          <span className="text-[13px] font-bold text-text-body">{index}.</span>
          <span
            className={`rounded-[4px] px-1.5 py-0.5 text-[11px] font-medium ${
              question.type === "multiple_choice"
                ? "bg-[#eff6ff] text-[#2563eb]"
                : "bg-[#fef3c7] text-[#d97706]"
            }`}
          >
            {question.type === "multiple_choice" ? "MC" : "Theory"}
          </span>
          <span className="text-[12px] text-[#9ca3af]">
            {question.marks} {question.marks === 1 ? "mark" : "marks"}
          </span>
          {question.sourceArm && (
            <span className="rounded-[4px] border border-[#e5e7eb] px-1.5 py-0.5 text-[10px] text-[#6b7280]">
              {question.sourceArm}
            </span>
          )}
        </div>
        <p className="text-[14px] text-text-heading leading-snug">
          {question.text}
        </p>
        {question.type === "multiple_choice" && question.options && (
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5">
            {question.options.map((opt) => (
              <span
                key={opt.id}
                className={`text-[12px] ${
                  opt.id === question.answer
                    ? "font-semibold text-[#16a34a]"
                    : "text-text-body"
                }`}
              >
                {opt.id}. {opt.text}
                {opt.id === question.answer && " ✓"}
              </span>
            ))}
          </div>
        )}
      </div>

      {isEditable && (
        <div className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {confirmDelete ? (
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-text-body">Delete?</span>
              <button
                onClick={onDelete}
                className="rounded bg-[#dc2626] px-2 py-0.5 text-[11px] text-white hover:opacity-90"
              >
                Yes
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="rounded border border-[#e5e7eb] px-2 py-0.5 text-[11px] text-text-body"
              >
                No
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={onEdit}
                className="rounded-[6px] p-1.5 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-text-heading"
              >
                <Pencil className="h-[14px] w-[14px]" />
              </button>
              <button
                onClick={() => setConfirmDelete(true)}
                className="rounded-[6px] p-1.5 text-[#9ca3af] hover:bg-[#f3f4f6] hover:text-[#dc2626]"
              >
                <Trash2 className="h-[14px] w-[14px]" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main editor ───────────────────────────────────────────────────────────────

export default function UnifiedPaperEditor({ paperId }: { paperId: string }) {
  const wsHref = useWorkspaceHref();
  const router = useRouter();

  const [paper, setPaper] = useState<ExamPaper | null>(null);
  const [paperLoaded, setPaperLoaded] = useState(false);

  const [duration, setDuration] = useState(60);
  const [instructions, setInstructions] = useState("");
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formDraft, setFormDraft] = useState<QuestionDraft>(blankDraft());

  const [saving, setSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [finalizeConfirm, setFinalizeConfirm] = useState(false);

  const loading = !paperLoaded;
  const isEditable = paper?.status === "draft";
  const isFinalized = paper?.status === "approved";
  const totalMarks = questions.reduce((s, q) => s + q.marks, 0);
  const mcCount = questions.filter((q) => q.type === "multiple_choice").length;
  const theoryCount = questions.filter((q) => q.type === "theory").length;

  useEffect(() => {
    let cancelled = false;
    getExamPaper(paperId).then((data) => {
      if (cancelled || !data) return;
      setPaper(data);
      setDuration(data.duration);
      setInstructions(data.instructions);
      setQuestions(data.questions);
      setPaperLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [paperId]);

  const openAddForm = () => {
    setEditingId(null);
    setFormDraft(blankDraft());
    setFormOpen(true);
  };

  const openEditForm = (q: ExamQuestion) => {
    setEditingId(q.id);
    setFormDraft({
      type: q.type,
      text: q.text,
      marks: q.marks,
      options:
        q.options ??
        MC_OPTION_IDS.map((id) => ({ id: id as MCOptionId, text: "" })),
      answer: q.answer ?? "",
    });
    setFormOpen(true);
  };

  const saveQuestion = () => {
    const newQ: ExamQuestion = {
      id: editingId ?? `q-${Date.now()}`,
      type: formDraft.type,
      text: formDraft.text,
      marks: formDraft.marks,
      ...(formDraft.type === "multiple_choice"
        ? { options: formDraft.options, answer: formDraft.answer }
        : formDraft.answer
          ? { answer: formDraft.answer }
          : {}),
    };
    if (editingId) {
      setQuestions((prev) => prev.map((q) => (q.id === editingId ? newQ : q)));
    } else {
      setQuestions((prev) => [...prev, newQ]);
    }
    setIsDirty(true);
    setFormOpen(false);
    setEditingId(null);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!paper) return;
    setSaving(true);
    const updated = await saveExamPaper(paper.id, {
      duration,
      instructions,
      questions,
    });
    setPaper(updated);
    setIsDirty(false);
    setSaving(false);
  };

  const handleFinalize = async () => {
    if (!paper) return;
    setSaving(true);
    await saveExamPaper(paper.id, { duration, instructions, questions });
    const finalized = await finalizeUnifiedPaper(paper.id);
    setPaper(finalized);
    setIsDirty(false);
    setFinalizeConfirm(false);
    setSaving(false);
  };

  const previewPaper: ExamPaper | null = paper
    ? { ...paper, duration, instructions, questions }
    : null;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  if (!paper || !paper.isUnified) {
    return (
      <div className="flex flex-col items-center gap-3 py-[80px]">
        <p className="text-[15px] font-medium text-text-heading">
          Unified paper not found
        </p>
        <button
          onClick={() => router.push(wsHref("/school/dashboard/exams"))}
          className="text-[13px] text-brand-green hover:underline"
        >
          Back to exam questions
        </button>
      </div>
    );
  }

  return (
    <div className="p-[30px]">
      {/* Top bar */}
      <div className="mb-6 flex items-center gap-3">
        <button
          onClick={() => router.push(wsHref("/school/dashboard/exams"))}
          className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-[#e5e7eb] text-text-body hover:bg-[#f3f4f6]"
        >
          <ArrowLeft className="h-[16px] w-[16px]" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[20px] font-semibold text-text-heading">
              {paper.subject}
            </h1>
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{
                color: STATUS_COLORS[paper.status],
                backgroundColor: STATUS_BG[paper.status],
              }}
            >
              {STATUS_LABELS[paper.status]}
            </span>
            {isDirty && (
              <span className="text-[12px] text-[#9ca3af]">
                · unsaved changes
              </span>
            )}
          </div>
          <p className="text-[13px] text-text-body">
            {paper.className} · {TERM_LABELS[paper.term]} ·{" "}
            {EXAM_TYPE_LABELS[paper.examType]} · Unified paper
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] font-medium text-text-body hover:bg-[#f3f4f6]"
          >
            <Eye className="h-[14px] w-[14px]" />
            Preview
          </button>

          {/* Print directly from toolbar when finalized */}
          {isFinalized && (
            <button
              onClick={() => setShowPreview(true)}
              className="flex items-center gap-1.5 rounded-[8px] bg-[#2563eb] px-4 py-2 text-[13px] font-medium text-white hover:opacity-90"
            >
              <Printer className="h-[14px] w-[14px]" />
              Preview &amp; Print
            </button>
          )}

          {isEditable && (
            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] font-medium text-text-body hover:bg-[#f3f4f6] disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save draft"}
            </button>
          )}

          {isEditable && !finalizeConfirm && (
            <button
              onClick={() => setFinalizeConfirm(true)}
              disabled={questions.length === 0}
              className="rounded-[8px] bg-brand-green px-4 py-2 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              Finalize paper
            </button>
          )}

          {isEditable && finalizeConfirm && (
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-text-body">
                Mark as ready to print?
              </span>
              <button
                onClick={handleFinalize}
                disabled={saving}
                className="rounded-[8px] bg-brand-green px-3 py-2 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Finalizing…" : "Confirm"}
              </button>
              <button
                onClick={() => setFinalizeConfirm(false)}
                className="rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] font-medium text-text-body hover:bg-[#f3f4f6]"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Finalized banner */}
      {isFinalized && (
        <div className="mb-5 flex items-center gap-2.5 rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
          <CheckCircle2 className="h-[16px] w-[16px] shrink-0 text-[#16a34a]" />
          <p className="text-[13px] text-[#15803d]">
            This paper has been finalized. Use the &ldquo;Preview &amp;
            Print&rdquo; button to print the exam for students.
          </p>
        </div>
      )}

      {/* Source arms info */}
      {paper.sourceArmIds && paper.sourceArmIds.length > 0 && (
        <div className="mb-5 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
          <p className="text-[13px] text-text-body">
            <span className="font-medium text-text-heading">
              Questions imported from:
            </span>{" "}
            questions are tagged with their source arm. Edit or delete freely —
            the printed paper will show only &ldquo;{paper.className}&rdquo;.
          </p>
        </div>
      )}

      {/* Paper details */}
      <div className="mb-6 rounded-[12px] border border-[#e5e7eb] bg-white p-5">
        <h2 className="mb-4 text-[14px] font-semibold text-text-heading">
          Paper details
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-[12px] font-medium text-text-body">
              Duration (minutes)
            </label>
            <input
              type="number"
              min={15}
              max={240}
              value={duration}
              disabled={!isEditable}
              onChange={(e) => {
                setDuration(Number(e.target.value));
                setIsDirty(true);
              }}
              className="h-[38px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[14px] text-text-heading focus:border-brand-green focus:outline-none disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-text-body">
              Total marks
            </label>
            <div className="flex h-[38px] items-center rounded-[8px] border border-[#e5e7eb] bg-[#f9fafb] px-3 text-[14px] font-semibold text-text-heading">
              {totalMarks}
            </div>
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-[12px] font-medium text-text-body">
              Instructions
            </label>
            <textarea
              value={instructions}
              disabled={!isEditable}
              onChange={(e) => {
                setInstructions(e.target.value);
                setIsDirty(true);
              }}
              rows={2}
              className="w-full resize-none rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[14px] text-text-heading focus:border-brand-green focus:outline-none disabled:bg-[#f9fafb] disabled:text-[#9ca3af]"
            />
          </div>
        </div>
      </div>

      {/* Questions section */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold text-text-heading">
            Questions
            {questions.length > 0 && (
              <span className="ml-2 text-[12px] font-normal text-[#9ca3af]">
                {questions.length} total · {mcCount} MC · {theoryCount} theory ·{" "}
                {totalMarks} marks
              </span>
            )}
          </h2>
          {isEditable && !formOpen && (
            <button
              onClick={openAddForm}
              className="flex items-center gap-1.5 rounded-[8px] border border-[#e5e7eb] px-3 py-1.5 text-[13px] font-medium text-text-body hover:bg-[#f3f4f6]"
            >
              <Plus className="h-[14px] w-[14px]" />
              Add question
            </button>
          )}
        </div>

        {questions.length === 0 && !formOpen && (
          <div className="flex flex-col items-center gap-2 rounded-[12px] border border-dashed border-[#e5e7eb] py-10 text-center">
            <p className="text-[14px] font-medium text-text-heading">
              No questions yet
            </p>
            {isEditable && (
              <button
                onClick={openAddForm}
                className="mt-1 flex items-center gap-1.5 rounded-[8px] bg-brand-green px-3 py-2 text-[13px] font-medium text-white hover:opacity-90"
              >
                <Plus className="h-[13px] w-[13px]" />
                Add first question
              </button>
            )}
          </div>
        )}

        <div className="space-y-2">
          {questions.map((q, i) => {
            if (isEditable && editingId === q.id && formOpen) {
              return (
                <QuestionForm
                  key={q.id}
                  draft={formDraft}
                  onChange={setFormDraft}
                  onSave={saveQuestion}
                  onCancel={() => {
                    setFormOpen(false);
                    setEditingId(null);
                  }}
                  isEdit={true}
                />
              );
            }
            return (
              <QuestionCard
                key={q.id}
                question={q}
                index={i + 1}
                isEditable={isEditable}
                onEdit={() => openEditForm(q)}
                onDelete={() => deleteQuestion(q.id)}
              />
            );
          })}

          {formOpen && !editingId && (
            <QuestionForm
              draft={formDraft}
              onChange={setFormDraft}
              onSave={saveQuestion}
              onCancel={() => setFormOpen(false)}
              isEdit={false}
            />
          )}
        </div>
      </div>

      {/* Preview modal */}
      {showPreview && previewPaper && (
        <ExamPaperPreview
          paper={previewPaper}
          schoolName={SCHOOL_NAME}
          onClose={() => setShowPreview(false)}
          canPrint={true}
          classLabel={paper.className}
        />
      )}
    </div>
  );
}
