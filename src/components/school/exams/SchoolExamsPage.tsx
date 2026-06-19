"use client";

import { FileText } from "lucide-react";
import { TERM_LABELS } from "@/src/types/scoreEntry";
import ExamPaperPreview from "@/src/components/teacher/exams/ExamPaperPreview";
import { useSchoolExams } from "@/src/hooks/useSchoolExams";
import type { StatusFilter } from "@/src/hooks/useSchoolExams";
import ExamStatsBar from "./ExamStatsBar";
import SubmissionGroupCard from "./SubmissionGroupCard";

const SCHOOL_NAME = "Greenfield Academy";
const TERMS = ["first_term", "second_term", "third_term"] as const;

export default function SchoolExamsPage() {
  const exams = useSchoolExams();

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
      {exams.loaded && (
        <ExamStatsBar
          total={exams.termPapers.length}
          pending={exams.pendingCount}
          approved={exams.approvedCount}
          finalized={exams.finalizedCount}
        />
      )}

      {/* Filter bar */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <select
          value={exams.term}
          onChange={(e) => {
            exams.setTerm(e.target.value as typeof exams.term);
            exams.setStatusFilter("all");
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
          {(
            [
              { id: "all" as StatusFilter, label: "All" },
              {
                id: "pending" as StatusFilter,
                label: "Needs review",
                count: exams.pendingCount,
                dot: "bg-[#d97706]",
              },
              {
                id: "ready" as StatusFilter,
                label: "Ready to print",
                count: exams.finalizedCount,
                dot: "bg-[#2563eb]",
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => exams.setStatusFilter(tab.id)}
              className={`rounded-[8px] px-4 py-1.5 text-[13px] font-medium transition-colors ${
                exams.statusFilter === tab.id
                  ? "bg-white text-text-heading shadow-sm"
                  : "text-text-body hover:text-text-heading"
              }`}
            >
              {tab.label}
              {"count" in tab && tab.count > 0 && (
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
      {!exams.loaded && (
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
      {exams.loaded &&
        (exams.visibleGroups.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-[12px] border border-dashed border-[#e5e7eb] py-16 text-center">
            <FileText className="h-[40px] w-[40px] text-[#d1d5db]" />
            <p className="text-[15px] font-medium text-text-heading">
              {exams.statusFilter === "pending"
                ? "No papers pending review"
                : exams.statusFilter === "ready"
                  ? "No papers ready to print yet"
                  : "No submissions yet"}
            </p>
            <p className="text-[13px] text-text-body">
              {exams.statusFilter === "all"
                ? "Teachers haven't submitted any exam papers for review."
                : `Switch to "All" to see everything for this term.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {exams.visibleGroups.map((group) => (
              <SubmissionGroupCard
                key={group.key}
                group={group}
                existingUnified={exams.getExistingUnified(group)}
                onApprove={exams.handleApprove}
                onReject={exams.handleReject}
                onSaveFeedback={exams.handleSaveFeedback}
                onBuildUnified={exams.handleBuildUnified}
                onPreview={exams.setPreviewPaper}
                approvingId={exams.approvingId}
              />
            ))}
          </div>
        ))}

      {/* Build spinner overlay */}
      {exams.buildingGroupKey && (
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
      {exams.previewPaper && (
        <ExamPaperPreview
          paper={exams.previewPaper}
          schoolName={SCHOOL_NAME}
          onClose={() => exams.setPreviewPaper(null)}
          canPrint={true}
          classLabel={exams.previewPaper.className}
        />
      )}
    </div>
  );
}
