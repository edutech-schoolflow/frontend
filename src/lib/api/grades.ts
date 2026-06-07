import { mockResponse } from "./mockClient";
import {
  MOCK_SUBJECTS,
  MOCK_GRADES,
  MOCK_REPORT,
  MOCK_PARENT_REPORTS,
} from "./mock/schoolData";
import {
  MOCK_PARENT_CA_SCORES,
  MOCK_PARENT_PERFORMANCE_TREND,
} from "./mock/parentData";
import type { Grade, Report, Subject, GradeBoundary } from "@/src/types/grade";

const MOCK_GRADING: GradeBoundary[] = [
  { minScore: 70, maxScore: 100, grade: "A", remark: "Excellent" },
  { minScore: 60, maxScore: 69, grade: "B", remark: "Very Good" },
  { minScore: 50, maxScore: 59, grade: "C", remark: "Good" },
  { minScore: 40, maxScore: 49, grade: "D", remark: "Fair" },
  { minScore: 0, maxScore: 39, grade: "F", remark: "Fail" },
];

export const getSubjects = async (_classId: string): Promise<Subject[]> =>
  mockResponse(MOCK_SUBJECTS);

export const createSubject = async (
  payload: Omit<Subject, "id">
): Promise<Subject> => mockResponse({ ...payload, id: `sub-${Date.now()}` });

export const getGradingSystem = async (): Promise<GradeBoundary[]> =>
  mockResponse(MOCK_GRADING);

export const saveGradingSystem = async (boundaries: GradeBoundary[]) =>
  mockResponse(boundaries);

export const saveCaScores = async (
  _classId: string,
  _termId: string,
  _scores: unknown[]
) => mockResponse({ message: "CA scores saved." });

export const saveExamScores = async (
  _classId: string,
  _termId: string,
  _scores: unknown[]
) => mockResponse({ message: "Exam scores saved. Totals calculated." });

export const getClassGrades = async (
  _classId: string,
  _termId: string
): Promise<Grade[]> => mockResponse(MOCK_GRADES);

export const publishResults = async (_classId: string, _termId: string) =>
  mockResponse({ message: "Results published. Parents notified." });

export const getReport = async (_enrollmentId: string): Promise<Report> =>
  mockResponse(MOCK_REPORT);

export const getReportPdfUrl = (_enrollmentId: string) => "/mock-report.pdf";

// Parent-facing
export const getChildCaScores = async (
  studentId: string,
  termName: string
): Promise<Grade[]> =>
  mockResponse(MOCK_PARENT_CA_SCORES[studentId]?.[termName] ?? MOCK_GRADES);

export const getChildCaScoresByChild = async (
  studentId: string
): Promise<Record<string, Grade[]>> =>
  mockResponse(MOCK_PARENT_CA_SCORES[studentId] ?? {});

export const getChildResults = async (
  _studentId: string,
  _termId: string
): Promise<Report> => mockResponse(MOCK_REPORT);

export const getParentReportsByChild = async (
  studentId: string
): Promise<Report[]> => mockResponse(MOCK_PARENT_REPORTS[studentId] ?? []);

export const getChildPerformanceTrend = async (
  studentId: string
): Promise<{ term: string; average: number }[]> =>
  mockResponse(MOCK_PARENT_PERFORMANCE_TREND[studentId] ?? []);
