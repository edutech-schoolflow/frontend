import { apiGet, apiPost } from "./client";

// ── backend shapes (api/v1/parent/children) ────────────────────────────────────
// A parent only ever sees children linked to them via parent_children — i.e. the
// students a school enrolled against this parent's phone (see school add-student).

export interface ParentChild {
  childProfileId: string;
  studentName: string;
  studentId: string | null; // active enrollment (null if not yet enrolled anywhere)
  schoolId: string | null;
  schoolName: string | null;
  schoolLogoUrl: string | null;
  className: string | null;
  admissionNumber: string | null;
  enrollmentStatus: string | null;
  outstandingFees: number;
  hasNewResult: boolean;
}

export interface ChildReportCard {
  id: string;
  term: string | null;
  academicYear: string | null;
  schoolName: string | null;
  status: string; // always 'published' for parents
  publishedAt: string | null;
}

export type CaAssessmentType = "first_ca" | "second_ca" | "exam";

export interface ChildCaScore {
  subjectName: string;
  assessmentType: CaAssessmentType;
  score: number | null;
  maxScore: number;
  termId: string;
}

export interface ChildAttendanceSummary {
  term: string | null;
  presentDays: number;
  absentDays: number;
  lateDays: number;
  totalDays: number;
}

// ── requests ────────────────────────────────────────────────────────────────────

/** My children + their active enrollment (school, class, fees, new-result flag). */
export async function getMyChildren(): Promise<ParentChild[]> {
  const { data } = await apiGet<ParentChild[]>("/parent/children");
  return data ?? [];
}

export interface ChildProfileDetail {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth: string; // yyyy-MM-dd
  gender?: "male" | "female" | null;
  photoUrl?: string | null;
  previousSchool?: string | null;
  medicalInfo?: string | null;
}

/** Full profile for one of my children — used to prefill the edit/enrol form. */
export async function getChildProfile(
  childProfileId: string
): Promise<ChildProfileDetail> {
  const { data } = await apiGet<ChildProfileDetail>(
    `/parent/children/${childProfileId}`
  );
  return data;
}

export interface UpsertChildInput {
  id?: string; // present → update an owned profile
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string; // yyyy-MM-dd
  gender?: "male" | "female";
  photoUrl?: string;
  previousSchool?: string;
  medicalInfo?: string;
  relationship?: string; // mother | father | guardian (on first create)
}

/** Create a child profile (or update one I own). Returns the child_profile id. */
export async function upsertChild(
  input: UpsertChildInput
): Promise<{ childProfileId: string; message: string }> {
  const { data, message } = await apiPost<{ childProfileId: string }>(
    "/parent/children",
    {
      id: input.id ?? null,
      firstName: input.firstName,
      middleName: input.middleName ?? null,
      lastName: input.lastName,
      dateOfBirth: input.dateOfBirth,
      gender: input.gender ?? null,
      photoUrl: input.photoUrl ?? null,
      previousSchool: input.previousSchool ?? null,
      medicalInfo: input.medicalInfo ?? null,
      relationship: input.relationship ?? null,
    }
  );
  return { childProfileId: data.childProfileId, message };
}

/** A child's PUBLISHED report cards. */
export async function getChildReportCards(
  childProfileId: string
): Promise<ChildReportCard[]> {
  const { data } = await apiGet<ChildReportCard[]>(
    `/parent/children/${childProfileId}/report-cards`
  );
  return data ?? [];
}

/** A child's PUBLISHED CA / exam scores, optionally scoped to one term. */
export async function getChildCaScores(
  childProfileId: string,
  termId?: string
): Promise<ChildCaScore[]> {
  const qs = termId ? `?termId=${encodeURIComponent(termId)}` : "";
  const { data } = await apiGet<ChildCaScore[]>(
    `/parent/children/${childProfileId}/ca-scores${qs}`
  );
  return data ?? [];
}

/** A child's attendance summary per term. */
export async function getChildAttendanceSummary(
  childProfileId: string
): Promise<ChildAttendanceSummary[]> {
  const { data } = await apiGet<ChildAttendanceSummary[]>(
    `/parent/children/${childProfileId}/attendance`
  );
  return data ?? [];
}
