export type GradeTerm = "first_term" | "second_term" | "third_term";
export type AssessmentType = "first_ca" | "second_ca" | "exam";

export const TERM_LABELS: Record<GradeTerm, string> = {
  first_term: "First Term",
  second_term: "Second Term",
  third_term: "Third Term",
};

export const ASSESSMENT_LABELS: Record<AssessmentType, string> = {
  first_ca: "First CA",
  second_ca: "Second CA",
  exam: "Exam",
};

// Nigerian school standard: CA = 30 each, Exam = 40
export const ASSESSMENT_MAX: Record<AssessmentType, number> = {
  first_ca: 30,
  second_ca: 30,
  exam: 40,
};

export interface StudentGradeEntry {
  studentId: string;
  studentName: string;
  admissionNumber: string;
  score: number | null;
}

export interface GradeRecord {
  id: string;
  armId: string;
  armName: string;
  subject: string;
  term: GradeTerm;
  assessmentType: AssessmentType;
  maxScore: number;
  entries: StudentGradeEntry[];
  submittedBy: string;
  submittedAt: string;
  published: boolean;
}

export interface GradeSummaryRow {
  recordId: string;
  armId: string;
  armName: string;
  subject: string;
  term: GradeTerm;
  assessmentType: AssessmentType;
  maxScore: number;
  published: boolean;
  averageScore: number;
  passCount: number;
  failCount: number;
  totalCount: number;
  submittedAt: string;
}

export interface GradesOverview {
  term: GradeTerm;
  totalSubmitted: number;
  totalPublished: number;
  rows: GradeSummaryRow[];
}
