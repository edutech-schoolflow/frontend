"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Printer } from "lucide-react";
import type { ExamPaper } from "@/src/types/examPaper";
import { EXAM_TYPE_LABELS } from "@/src/types/examPaper";
import { TERM_LABELS } from "@/src/types/scoreEntry";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} Minutes`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} Hour${h > 1 ? "s" : ""}` : `${h}h ${m}min`;
}

function academicYear(): string {
  const now = new Date();
  const y = now.getFullYear();
  return now.getMonth() >= 8 ? `${y}/${y + 1}` : `${y - 1}/${y}`;
}

// ─── Print preview content ─────────────────────────────────────────────────────

function PrintContent({
  paper,
  schoolName,
  classLabel,
}: {
  paper: ExamPaper;
  schoolName: string;
  classLabel?: string; // admin passes className without arm; teacher sees armName
}) {
  const mcQuestions = paper.questions.filter(
    (q) => q.type === "multiple_choice"
  );
  const theoryQuestions = paper.questions.filter((q) => q.type === "theory");
  const totalMarks = paper.questions.reduce((s, q) => s + q.marks, 0);
  const mcMarks = mcQuestions.reduce((s, q) => s + q.marks, 0);
  const theoryMarks = theoryQuestions.reduce((s, q) => s + q.marks, 0);
  const hasBothSections = mcQuestions.length > 0 && theoryQuestions.length > 0;

  return (
    <div
      id="exam-print-content"
      className="mx-auto max-w-[750px] bg-white p-10 font-serif text-[15px] leading-relaxed text-[#111827]"
    >
      {/* School header */}
      <div className="mb-6 text-center">
        <h1 className="text-[22px] font-bold uppercase tracking-wide">
          {schoolName}
        </h1>
        <p className="mt-1 text-[15px] font-semibold uppercase">
          {TERM_LABELS[paper.term]} {EXAM_TYPE_LABELS[paper.examType]}{" "}
          {academicYear()}
        </p>
        <div className="mx-auto mt-3 h-[2px] w-full bg-[#111827]" />
        <div className="mx-auto h-[1px] w-full bg-[#111827] mt-0.5" />
      </div>

      {/* Paper meta */}
      <div className="mb-5 grid grid-cols-2 gap-x-8 text-[14px]">
        <div className="flex justify-between border-b border-[#e5e7eb] pb-1.5">
          <span className="font-semibold uppercase">Subject:</span>
          <span className="font-bold uppercase">{paper.subject}</span>
        </div>
        <div className="flex justify-between border-b border-[#e5e7eb] pb-1.5">
          <span className="font-semibold uppercase">Class:</span>
          <span className="font-bold uppercase">
            {classLabel ?? paper.armName}
          </span>
        </div>
        <div className="flex justify-between border-b border-[#e5e7eb] pb-1.5 pt-1.5">
          <span className="font-semibold uppercase">Duration:</span>
          <span className="font-bold">{durationLabel(paper.duration)}</span>
        </div>
        <div className="flex justify-between border-b border-[#e5e7eb] pb-1.5 pt-1.5">
          <span className="font-semibold uppercase">Total Marks:</span>
          <span className="font-bold">{totalMarks} marks</span>
        </div>
      </div>

      {/* Instructions */}
      {paper.instructions && (
        <div className="mb-6 rounded border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-[13px]">
          <span className="font-bold uppercase">Instructions: </span>
          {paper.instructions}
        </div>
      )}

      {/* Section A: Multiple Choice */}
      {mcQuestions.length > 0 && (
        <div className="mb-8">
          <div className="mb-3">
            <h2 className="text-[16px] font-bold uppercase">
              {hasBothSections ? "Section A: " : ""}Multiple Choice Questions
              {hasBothSections && (
                <span className="ml-2 font-normal normal-case text-[14px]">
                  ({mcMarks} marks)
                </span>
              )}
            </h2>
            <p className="mt-0.5 text-[13px] italic">
              Choose the most correct answer from the options A – D.
            </p>
          </div>

          <ol className="space-y-5 list-none">
            {mcQuestions.map((q, i) => (
              <li key={q.id}>
                <div className="flex gap-2">
                  <span className="shrink-0 font-bold">{i + 1}.</span>
                  <div className="flex-1">
                    <span>{q.text}</span>
                    <span className="ml-2 text-[12px] text-[#6b7280]">
                      ({q.marks} {q.marks === 1 ? "mark" : "marks"})
                    </span>
                    {q.options && (
                      <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 pl-1">
                        {q.options.map((opt) => (
                          <span key={opt.id} className="text-[14px]">
                            <span className="font-semibold">{opt.id}.</span>{" "}
                            {opt.text}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Section B: Theory */}
      {theoryQuestions.length > 0 && (
        <div className="mb-8">
          <div className="mb-3">
            <h2 className="text-[16px] font-bold uppercase">
              {hasBothSections ? "Section B: " : ""}Theory Questions
              {hasBothSections && (
                <span className="ml-2 font-normal normal-case text-[14px]">
                  ({theoryMarks} marks)
                </span>
              )}
            </h2>
            <p className="mt-0.5 text-[13px] italic">
              Answer all questions. Show all workings where applicable.
            </p>
          </div>

          <ol className="space-y-7 list-none">
            {theoryQuestions.map((q, i) => (
              <li key={q.id}>
                <div className="flex gap-2">
                  <span className="shrink-0 font-bold">{i + 1}.</span>
                  <div className="flex-1">
                    <span>{q.text}</span>
                    <span className="ml-2 text-[12px] text-[#6b7280]">
                      ({q.marks} {q.marks === 1 ? "mark" : "marks"})
                    </span>
                    {/* Answer lines */}
                    <div className="mt-3 space-y-2">
                      {Array.from({
                        length: Math.max(3, Math.ceil(q.marks / 3)),
                      }).map((_, li) => (
                        <div
                          key={li}
                          className="h-[1px] w-full border-b border-dotted border-[#9ca3af]"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Footer */}
      <div className="mt-10 border-t border-[#111827] pt-3 text-center text-[12px] text-[#6b7280]">
        <p>
          {schoolName} · {TERM_LABELS[paper.term]}{" "}
          {EXAM_TYPE_LABELS[paper.examType]} · {paper.subject} ·{" "}
          {classLabel ?? paper.armName}
        </p>
      </div>
    </div>
  );
}

// ─── Preview modal (via portal) ────────────────────────────────────────────────

export default function ExamPaperPreview({
  paper,
  schoolName,
  onClose,
  canPrint = false,
  classLabel,
}: {
  paper: ExamPaper;
  schoolName: string;
  onClose: () => void;
  canPrint?: boolean;
  classLabel?: string; // admin passes class name without arm (e.g. "Primary 1"); teacher sees arm
}) {
  useEffect(() => {
    // Inject print styles: hide everything except this portal on print
    const style = document.createElement("style");
    style.id = "exam-print-styles";
    style.textContent = `
      @media print {
        body > *:not([data-exam-preview]) { display: none !important; }
        [data-exam-preview] {
          position: static !important;
          overflow: visible !important;
          background: white !important;
          inset: 0 !important;
        }
        .no-print { display: none !important; }
        #exam-print-content {
          max-width: 100% !important;
          padding: 12mm !important;
          box-shadow: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Prevent body scroll while open
    document.body.style.overflow = "hidden";

    return () => {
      document.getElementById("exam-print-styles")?.remove();
      document.body.style.overflow = "";
    };
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      data-exam-preview
      className="fixed inset-0 z-[100] overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      {/* Toolbar — hidden on print */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between bg-[#1f2937] px-6 py-3">
        <div className="flex items-center gap-3">
          <span className="text-[14px] font-medium text-white">
            Preview — {paper.subject} · {paper.armName}
          </span>
          <span className="text-[12px] text-[#9ca3af]">Press Esc to close</span>
        </div>
        <div className="flex items-center gap-2">
          {canPrint ? (
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-[8px] bg-brand-green px-4 py-2 text-[13px] font-medium text-white hover:opacity-90"
            >
              <Printer className="h-[14px] w-[14px]" />
              Print
            </button>
          ) : (
            <span className="text-[12px] text-[#6b7280]">
              Preview only — school admin prints the final paper
            </span>
          )}
          <button
            onClick={onClose}
            className="flex h-[34px] w-[34px] items-center justify-center rounded-[8px] text-[#9ca3af] hover:bg-white/10 hover:text-white"
          >
            <X className="h-[16px] w-[16px]" />
          </button>
        </div>
      </div>

      {/* Paper */}
      <div className="mx-auto my-8 max-w-[800px] px-4 pb-16">
        <div className="rounded-[4px] shadow-2xl">
          <PrintContent
            paper={paper}
            schoolName={schoolName}
            classLabel={classLabel}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
