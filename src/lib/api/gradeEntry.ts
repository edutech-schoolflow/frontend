import { mockResponse } from "./mockClient";
import { MOCK_GRADE_RECORDS } from "./mock/gradesData";
import { MOCK_CLASS_ARMS, MOCK_STAFF } from "./mock/schoolData";
import type {
  GradeRecord,
  GradeTerm,
  AssessmentType,
  StudentGradeEntry,
  GradesOverview,
  GradeSummaryRow,
} from "@/src/types/scoreEntry";
import { ASSESSMENT_MAX } from "@/src/types/scoreEntry";
import type { ClassLevel } from "@/src/types/school";
import type { ArmSelectOption } from "./attendance";

// ─── Subjects per level ────────────────────────────────────────────────────────

const SUBJECTS: Record<ClassLevel, string[]> = {
  nursery: ["English Language", "Mathematics", "Phonics", "CRK/IRS", "French"],
  primary: [
    "English Language",
    "Mathematics",
    "Basic Science",
    "Social Studies",
    "CRK/IRS",
    "Computer Studies",
    "Physical Education",
    "Verbal Reasoning",
    "Quantitative Reasoning",
  ],
  junior_secondary: [
    "English Language",
    "Mathematics",
    "Basic Science",
    "Basic Technology",
    "Social Studies",
    "CRK/IRS",
    "Agricultural Science",
    "Computer Studies",
    "French",
    "Civic Education",
  ],
  senior_secondary: [
    "English Language",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Agricultural Science",
    "Geography",
    "Government",
    "Economics",
    "Accounting",
    "Literature in English",
    "Further Mathematics",
    "Civic Education",
  ],
};

export const getSubjectsForLevel = (level: ClassLevel): string[] =>
  SUBJECTS[level] ?? [];

// ─── Arms accessible to this teacher ──────────────────────────────────────────

export const getTeacherGradeArms = async (
  userId: string | undefined
): Promise<ArmSelectOption[]> => {
  const allArms = Object.values(MOCK_CLASS_ARMS).flat();

  const classLevelMap: Record<string, ClassLevel> = {};
  Object.entries(MOCK_CLASS_ARMS).forEach(([, arms]) => {
    arms.forEach((arm) => {
      // level is looked up per classId via MOCK_SCHOOL_CLASSES — we inline it
      classLevelMap[arm.id] = "primary"; // placeholder overridden below
    });
  });

  // Import MOCK_SCHOOL_CLASSES to resolve level correctly
  const { MOCK_SCHOOL_CLASSES } = await import("./mock/schoolData");
  const classLevels = Object.fromEntries(
    MOCK_SCHOOL_CLASSES.map((c) => [c.id, c.level])
  );

  const staff = userId
    ? MOCK_STAFF.find((s) => s.userId === userId)
    : MOCK_STAFF.find((s) => s.role === "teacher");

  if (!staff) return mockResponse([]);

  const options: ArmSelectOption[] = allArms
    .filter((arm) => arm.classTeacher?.id === staff.id)
    .map((arm) => ({
      armId: arm.id,
      armName: arm.fullName,
      classId: arm.classId,
      className: arm.className,
      level: classLevels[arm.classId] ?? "primary",
    }));

  return mockResponse(options);
};

// ─── Grade record CRUD ─────────────────────────────────────────────────────────

export const getGradeRecord = async (
  armId: string,
  subject: string,
  term: GradeTerm,
  assessmentType: AssessmentType
): Promise<GradeRecord | null> => {
  const record = MOCK_GRADE_RECORDS.find(
    (r) =>
      r.armId === armId &&
      r.subject === subject &&
      r.term === term &&
      r.assessmentType === assessmentType
  );
  return mockResponse(record ?? null);
};

export const submitGradeRecord = async (payload: {
  armId: string;
  armName: string;
  subject: string;
  term: GradeTerm;
  assessmentType: AssessmentType;
  entries: StudentGradeEntry[];
  submittedBy: string;
}): Promise<GradeRecord> => {
  const maxScore = ASSESSMENT_MAX[payload.assessmentType];

  const record: GradeRecord = {
    id: `grd-${Date.now()}`,
    armId: payload.armId,
    armName: payload.armName,
    subject: payload.subject,
    term: payload.term,
    assessmentType: payload.assessmentType,
    maxScore,
    entries: payload.entries,
    submittedBy: payload.submittedBy,
    submittedAt: new Date().toISOString(),
    published: false,
  };

  const idx = MOCK_GRADE_RECORDS.findIndex(
    (r) =>
      r.armId === payload.armId &&
      r.subject === payload.subject &&
      r.term === payload.term &&
      r.assessmentType === payload.assessmentType
  );

  if (idx >= 0) {
    MOCK_GRADE_RECORDS[idx] = record;
  } else {
    MOCK_GRADE_RECORDS.push(record);
  }

  return mockResponse(record);
};

export const publishGradeRecord = async (
  recordId: string
): Promise<GradeRecord> => {
  const idx = MOCK_GRADE_RECORDS.findIndex((r) => r.id === recordId);
  if (idx < 0) throw new Error("Record not found");
  MOCK_GRADE_RECORDS[idx] = { ...MOCK_GRADE_RECORDS[idx], published: true };
  return mockResponse(MOCK_GRADE_RECORDS[idx]);
};

// Publishes all submitted (unpublished) records for a given arm + term.
// Returns the IDs of records that were published.
export const publishAllForArm = async (
  armId: string,
  term: GradeTerm
): Promise<string[]> => {
  const publishedIds: string[] = [];
  MOCK_GRADE_RECORDS.forEach((r, idx) => {
    if (r.armId === armId && r.term === term && !r.published) {
      MOCK_GRADE_RECORDS[idx] = { ...r, published: true };
      publishedIds.push(r.id);
    }
  });
  return mockResponse(publishedIds);
};

// Publishes all submitted (unpublished) records across all arms for a term.
export const publishAllForTerm = async (term: GradeTerm): Promise<string[]> => {
  const publishedIds: string[] = [];
  MOCK_GRADE_RECORDS.forEach((r, idx) => {
    if (r.term === term && !r.published) {
      MOCK_GRADE_RECORDS[idx] = { ...r, published: true };
      publishedIds.push(r.id);
    }
  });
  return mockResponse(publishedIds);
};

// ─── School overview ───────────────────────────────────────────────────────────

export const getGradesOverview = async (
  term: GradeTerm
): Promise<GradesOverview> => {
  const rows: GradeSummaryRow[] = MOCK_GRADE_RECORDS.filter(
    (r) => r.term === term
  ).map((r) => {
    const passThreshold = r.maxScore * 0.4;
    const scored = r.entries.filter((e) => e.score !== null);
    const passCount = scored.filter(
      (e) => (e.score ?? 0) >= passThreshold
    ).length;
    const avg =
      scored.length > 0
        ? Math.round(
            scored.reduce((s, e) => s + (e.score ?? 0), 0) / scored.length
          )
        : 0;

    return {
      recordId: r.id,
      armId: r.armId,
      armName: r.armName,
      subject: r.subject,
      term: r.term,
      assessmentType: r.assessmentType,
      maxScore: r.maxScore,
      published: r.published,
      averageScore: avg,
      passCount,
      failCount: scored.length - passCount,
      totalCount: r.entries.length,
      submittedAt: r.submittedAt,
    };
  });

  return mockResponse({
    term,
    totalSubmitted: rows.length,
    totalPublished: rows.filter((r) => r.published).length,
    rows,
  });
};
