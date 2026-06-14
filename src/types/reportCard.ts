export interface Subject {
  id: string;
  classId: string;
  name: string;
  maxCaScore: number;
  maxExamScore: number;
}

export interface GradeBoundary {
  minScore: number;
  maxScore: number;
  grade: string;
  remark: string;
}

export interface Grade {
  id: string;
  enrollmentId: string;
  subjectId: string;
  subjectName: string;
  ca1?: number;
  ca2?: number;
  examScore?: number;
  totalScore?: number;
  grade?: string;
  position?: number;
}

export type BehavioralTrait =
  | "punctuality"
  | "attentiveness"
  | "cooperation"
  | "neatness"
  | "politeness"
  | "leadership";

export interface BehavioralRating {
  trait: BehavioralTrait;
  score: number;
}

export interface Report {
  id: string;
  enrollmentId: string;
  studentName: string;
  className: string;
  termName: string;
  academicYear: string;
  grades: Grade[];
  overallAverage?: number;
  overallPosition?: number;
  totalStudentsInClass?: number;
  teacherComment?: string;
  principalComment?: string;
  behavioralRatings: BehavioralRating[];
  attendanceDays?: number;
  presentDays?: number;
  absentDays?: number;
  lateDays?: number;
  nextTermResumption?: string;
  nextTermFees?: number;
  status: "draft" | "published";
  publishedAt?: string;
}
