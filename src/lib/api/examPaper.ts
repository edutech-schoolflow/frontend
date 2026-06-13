import { mockResponse } from "./mockClient";
import { MOCK_EXAM_PAPERS } from "./mock/examData";
import { MOCK_CLASS_ARMS, MOCK_STAFF } from "./mock/schoolData";
import type { ExamPaper, ExamQuestion, ExamType } from "@/src/types/examPaper";
import type { GradeTerm } from "@/src/types/scoreEntry";

// Returns all exam papers for the teacher's assigned arms
export const getTeacherExamPapers = async (
  userId: string | undefined
): Promise<ExamPaper[]> => {
  const allArms = Object.values(MOCK_CLASS_ARMS).flat();

  const staff = userId
    ? MOCK_STAFF.find((s) => s.userId === userId)
    : MOCK_STAFF.find((s) => s.role === "teacher");

  if (!staff) return mockResponse([]);

  const teacherArmIds = allArms
    .filter((arm) => arm.classTeacher?.id === staff.id)
    .map((arm) => arm.id);

  return mockResponse(
    MOCK_EXAM_PAPERS.filter((p) => teacherArmIds.includes(p.armId))
  );
};

export const getExamPaper = async (
  paperId: string
): Promise<ExamPaper | null> => {
  const paper = MOCK_EXAM_PAPERS.find((p) => p.id === paperId);
  return mockResponse(paper ?? null);
};

export const createExamPaper = async (payload: {
  armId: string;
  armName: string;
  subject: string;
  term: GradeTerm;
  examType: ExamType;
  duration: number;
  instructions: string;
  teacherName: string;
}): Promise<ExamPaper> => {
  const now = new Date().toISOString();
  const paper: ExamPaper = {
    id: `exam-${Date.now()}`,
    ...payload,
    questions: [],
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
  MOCK_EXAM_PAPERS.push(paper);
  return mockResponse(paper);
};

export const saveExamPaper = async (
  paperId: string,
  updates: {
    duration?: number;
    instructions?: string;
    questions?: ExamQuestion[];
  }
): Promise<ExamPaper> => {
  const idx = MOCK_EXAM_PAPERS.findIndex((p) => p.id === paperId);
  if (idx < 0) throw new Error("Exam paper not found");
  MOCK_EXAM_PAPERS[idx] = {
    ...MOCK_EXAM_PAPERS[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  return mockResponse(MOCK_EXAM_PAPERS[idx]);
};

export const submitExamPaper = async (paperId: string): Promise<ExamPaper> => {
  const idx = MOCK_EXAM_PAPERS.findIndex((p) => p.id === paperId);
  if (idx < 0) throw new Error("Exam paper not found");
  const now = new Date().toISOString();
  MOCK_EXAM_PAPERS[idx] = {
    ...MOCK_EXAM_PAPERS[idx],
    status: "submitted",
    submittedAt: now,
    updatedAt: now,
  };
  return mockResponse(MOCK_EXAM_PAPERS[idx]);
};

export const deleteExamPaper = async (paperId: string): Promise<void> => {
  const idx = MOCK_EXAM_PAPERS.findIndex((p) => p.id === paperId);
  if (idx >= 0) MOCK_EXAM_PAPERS.splice(idx, 1);
  return mockResponse(undefined);
};

// ─── School admin functions ────────────────────────────────────────────────────

// All arm-level submissions (non-unified), regardless of status
export const getAllArmSubmissions = async (): Promise<ExamPaper[]> => {
  return mockResponse(MOCK_EXAM_PAPERS.filter((p) => !p.isUnified));
};

export const approveExamPaper = async (paperId: string): Promise<ExamPaper> => {
  const idx = MOCK_EXAM_PAPERS.findIndex((p) => p.id === paperId);
  if (idx < 0) throw new Error("Exam paper not found");
  MOCK_EXAM_PAPERS[idx] = {
    ...MOCK_EXAM_PAPERS[idx],
    status: "approved",
    reviewComment: undefined,
    updatedAt: new Date().toISOString(),
  };
  return mockResponse(MOCK_EXAM_PAPERS[idx]);
};

export const rejectExamPaper = async (
  paperId: string,
  comment: string
): Promise<ExamPaper> => {
  const idx = MOCK_EXAM_PAPERS.findIndex((p) => p.id === paperId);
  if (idx < 0) throw new Error("Exam paper not found");
  MOCK_EXAM_PAPERS[idx] = {
    ...MOCK_EXAM_PAPERS[idx],
    status: "rejected",
    reviewComment: comment,
    updatedAt: new Date().toISOString(),
  };
  return mockResponse(MOCK_EXAM_PAPERS[idx]);
};

export const createUnifiedPaper = async (payload: {
  className: string;
  subject: string;
  term: GradeTerm;
  examType: ExamType;
  duration: number;
  instructions: string;
  questions: ExamPaper["questions"];
  sourceArmIds: string[];
}): Promise<ExamPaper> => {
  const now = new Date().toISOString();
  const paper: ExamPaper = {
    id: `unified-${Date.now()}`,
    armId: "",
    armName: "",
    isUnified: true,
    ...payload,
    status: "draft",
    teacherName: "School Admin",
    createdAt: now,
    updatedAt: now,
  };
  MOCK_EXAM_PAPERS.push(paper);
  return mockResponse(paper);
};

export const getAllUnifiedPapers = async (): Promise<ExamPaper[]> => {
  return mockResponse(MOCK_EXAM_PAPERS.filter((p) => p.isUnified === true));
};

export const finalizeUnifiedPaper = async (
  paperId: string
): Promise<ExamPaper> => {
  const idx = MOCK_EXAM_PAPERS.findIndex((p) => p.id === paperId);
  if (idx < 0) throw new Error("Unified paper not found");
  MOCK_EXAM_PAPERS[idx] = {
    ...MOCK_EXAM_PAPERS[idx],
    status: "approved",
    updatedAt: new Date().toISOString(),
  };
  return mockResponse(MOCK_EXAM_PAPERS[idx]);
};
