import type { GradeSummaryRow, AssessmentType } from "@/src/types/scoreEntry";

export const ASSESSMENT_COLS: AssessmentType[] = [
  "first_ca",
  "second_ca",
  "exam",
];

export type CellStatus = "not_submitted" | "pending" | "published";

export interface MatrixCell {
  recordId: string | null;
  status: CellStatus;
  averageScore: number;
  maxScore: number;
  passCount: number;
  totalCount: number;
}

export interface SubjectMatrixRow {
  subject: string;
  cells: Record<AssessmentType, MatrixCell>;
}

export interface ArmGroup {
  armId: string;
  armName: string;
  className: string;
  subjects: SubjectMatrixRow[];
  pendingCount: number;
  publishedCount: number;
  totalSubmitted: number;
}

export interface ClassGroup {
  className: string;
  arms: ArmGroup[];
  pendingCount: number;
}

function emptyCell(): MatrixCell {
  return {
    recordId: null,
    status: "not_submitted",
    averageScore: 0,
    maxScore: 0,
    passCount: 0,
    totalCount: 0,
  };
}

function deriveClassName(armName: string): string {
  // "Primary 1A" → "Primary 1", "JSS 2B" → "JSS 2"
  return armName.slice(0, -1).trim();
}

export function buildGroups(rows: GradeSummaryRow[]): ClassGroup[] {
  // Bucket rows by armId
  const byArm = new Map<string, GradeSummaryRow[]>();
  for (const row of rows) {
    const bucket = byArm.get(row.armId) ?? [];
    bucket.push(row);
    byArm.set(row.armId, bucket);
  }

  // Build arm groups
  const armGroups: ArmGroup[] = [];
  for (const [armId, armRows] of byArm) {
    const armName = armRows[0].armName;
    const className = deriveClassName(armName);
    const subjects = [...new Set(armRows.map((r) => r.subject))].sort();

    const subjectRows: SubjectMatrixRow[] = subjects.map((subject) => {
      const cells = Object.fromEntries(
        ASSESSMENT_COLS.map((type) => {
          const row = armRows.find(
            (r) => r.subject === subject && r.assessmentType === type
          );
          if (!row) return [type, emptyCell()];
          return [
            type,
            {
              recordId: row.recordId,
              status: row.published ? "published" : "pending",
              averageScore: row.averageScore,
              maxScore: row.maxScore,
              passCount: row.passCount,
              totalCount: row.totalCount,
            } satisfies MatrixCell,
          ];
        })
      ) as Record<AssessmentType, MatrixCell>;
      return { subject, cells };
    });

    const allCells = subjectRows.flatMap((sr) => Object.values(sr.cells));
    const pendingCount = allCells.filter((c) => c.status === "pending").length;
    const publishedCount = allCells.filter(
      (c) => c.status === "published"
    ).length;
    const totalSubmitted = pendingCount + publishedCount;

    armGroups.push({
      armId,
      armName,
      className,
      subjects: subjectRows,
      pendingCount,
      publishedCount,
      totalSubmitted,
    });
  }

  // Group by className, preserving natural order
  const classMap = new Map<string, ArmGroup[]>();
  for (const arm of armGroups) {
    const bucket = classMap.get(arm.className) ?? [];
    bucket.push(arm);
    classMap.set(arm.className, bucket);
  }

  return [...classMap.entries()].map(([className, arms]) => ({
    className,
    arms: arms.sort((a, b) => a.armName.localeCompare(b.armName)),
    pendingCount: arms.reduce((s, a) => s + a.pendingCount, 0),
  }));
}

export type StatusFilter = "all" | "pending" | "published";

export function filterGroups(
  groups: ClassGroup[],
  filter: StatusFilter
): ClassGroup[] {
  if (filter === "all") return groups;
  return groups
    .map((cls) => ({
      ...cls,
      arms: cls.arms.filter((arm) =>
        filter === "pending"
          ? arm.pendingCount > 0
          : arm.pendingCount === 0 && arm.publishedCount > 0
      ),
    }))
    .filter((cls) => cls.arms.length > 0);
}

export function totalPending(groups: ClassGroup[]): number {
  return groups.reduce((s, cls) => s + cls.pendingCount, 0);
}
