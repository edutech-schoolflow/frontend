import type { GradeTerm } from "@/src/types/scoreEntry";

export type { GradeTerm };

export type ExamType = "mid_term" | "final";
export type ExamPaperStatus = "draft" | "submitted" | "approved" | "rejected";
export type QuestionType = "multiple_choice" | "theory";
export type MCOptionId = "A" | "B" | "C" | "D";

export const MC_OPTION_IDS: MCOptionId[] = ["A", "B", "C", "D"];

export interface MCOption {
  id: MCOptionId;
  text: string;
}

export interface ExamQuestion {
  id: string;
  type: QuestionType;
  text: string;
  marks: number;
  options?: MCOption[]; // MC only — always 4
  answer?: string; // MC: correct option id; Theory: model answer (optional)
  sourceArm?: string; // set in unified papers to show which arm a question came from
}

export interface ExamPaper {
  id: string;
  armId: string;
  armName: string;
  subject: string;
  term: GradeTerm;
  examType: ExamType;
  duration: number; // minutes
  instructions: string;
  questions: ExamQuestion[];
  status: ExamPaperStatus;
  teacherName: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
  reviewComment?: string; // populated when rejected
  className?: string; // class without arm suffix (e.g. "Primary 1") — set for all papers
  isUnified?: boolean; // true for school-built unified papers
  sourceArmIds?: string[]; // arm IDs whose questions were imported into a unified paper
}

export const EXAM_TYPE_LABELS: Record<ExamType, string> = {
  mid_term: "Mid-Term Exam",
  final: "Final Exam",
};

export const STATUS_LABELS: Record<ExamPaperStatus, string> = {
  draft: "Draft",
  submitted: "Submitted",
  approved: "Approved",
  rejected: "Rejected",
};

export const STATUS_COLORS: Record<ExamPaperStatus, string> = {
  draft: "#6b7280",
  submitted: "#2563eb",
  approved: "#16a34a",
  rejected: "#dc2626",
};

export const STATUS_BG: Record<ExamPaperStatus, string> = {
  draft: "#f3f4f6",
  submitted: "#eff6ff",
  approved: "#f0fdf4",
  rejected: "#fef2f2",
};
