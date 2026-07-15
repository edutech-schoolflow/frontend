"use client";

import { useState } from "react";
import { CheckCircle2, MessageSquare } from "lucide-react";
import type { ExamPaper } from "@/src/types/examPaper";

function totalMarks(paper: ExamPaper) {
  return paper.questions.reduce((s, q) => s + q.marks, 0);
}

export default function QuestionReview({
  paper,
  onSaveFeedback,
}: {
  paper: ExamPaper;
  onSaveFeedback: (
    feedback: string,
    questionNotes: Record<string, string>
  ) => Promise<void>;
}) {
  const [generalFeedback, setGeneralFeedback] = useState(
    paper.adminFeedback ?? ""
  );
  const [questionNotes, setQuestionNotes] = useState<Record<string, string>>(
    () =>
      Object.fromEntries(
        paper.questions
          .filter((q) => q.reviewNote)
          .map((q) => [q.id, q.reviewNote!])
      )
  );
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasFeedback =
    generalFeedback.trim().length > 0 ||
    Object.values(questionNotes).some((n) => n.trim().length > 0);

  const handleSave = async () => {
    setSaving(true);
    await onSaveFeedback(generalFeedback.trim(), questionNotes);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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

            {/* Per-question note */}
            <div className="mt-2.5 border-t border-[#f3f4f6] pt-2">
              {expandedNoteId === q.id ? (
                <div>
                  <textarea
                    value={questionNotes[q.id] ?? ""}
                    onChange={(e) =>
                      setQuestionNotes((prev) => ({
                        ...prev,
                        [q.id]: e.target.value,
                      }))
                    }
                    rows={2}
                    placeholder="Add a note for this question…"
                    autoFocus
                    className="w-full resize-none rounded-[6px] border border-[#e5e7eb] px-2.5 py-2 text-[12px] text-text-heading focus:border-brand-green focus:outline-none"
                  />
                  <button
                    onClick={() => setExpandedNoteId(null)}
                    className="mt-1 text-[11px] text-[#9ca3af] hover:text-text-body"
                  >
                    Done
                  </button>
                </div>
              ) : questionNotes[q.id] ? (
                <div className="flex items-start gap-1.5">
                  <MessageSquare className="mt-0.5 h-[12px] w-[12px] shrink-0 text-brand-green" />
                  <span className="flex-1 text-[12px] text-text-body">
                    {questionNotes[q.id]}
                  </span>
                  <button
                    onClick={() => setExpandedNoteId(q.id)}
                    className="shrink-0 text-[11px] text-[#9ca3af] hover:text-brand-green"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setExpandedNoteId(q.id)}
                  className="flex items-center gap-1 text-[11px] text-[#9ca3af] hover:text-brand-green"
                >
                  <MessageSquare className="h-[11px] w-[11px]" />
                  Add note
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* General feedback */}
      <div className="mt-4 border-t border-[#e5e7eb] pt-4">
        <label className="mb-1.5 block text-[12px] font-semibold uppercase tracking-wide text-[#6b7280]">
          General feedback
        </label>
        <textarea
          value={generalFeedback}
          onChange={(e) => setGeneralFeedback(e.target.value)}
          rows={3}
          placeholder="Overall comments for the teacher…"
          className="w-full resize-none rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
        />
      </div>

      {hasFeedback && (
        <div className="mt-3 flex items-center justify-end gap-3">
          {saved && (
            <span className="flex items-center gap-1 text-[12px] text-[#16a34a]">
              <CheckCircle2 className="h-[13px] w-[13px]" />
              Saved
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 rounded-[8px] bg-brand-green px-4 py-2 text-[12px] font-medium text-white hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save feedback"}
          </button>
        </div>
      )}
    </div>
  );
}
