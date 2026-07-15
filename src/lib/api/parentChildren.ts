import { apiGet, apiPostForm } from "./client";

// ── backend shapes (api/v1/family/children) ────────────────────────────────────
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
  // Identity space (EDD-002): my children across schools, from the identity session — not a parent token.
  const { data } = await apiGet<ParentChild[]>("/identity/children");
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
  birthCertUrl?: string | null;
  medicalDocUrl?: string | null;
}

/** Full profile for one of my children — used to prefill the edit/enrol form. */
export async function getChildProfile(
  childProfileId: string
): Promise<ChildProfileDetail> {
  const { data } = await apiGet<ChildProfileDetail>(
    `/family/children/${childProfileId}`
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
  previousSchool?: string;
  medicalInfo?: string;
  relationship?: string; // mother | father | guardian (on first create)
  /** Required on create; on update a new file replaces the stored one. */
  photo?: File | null;
  /** Required on create; on update a new file replaces the stored one. */
  birthCert?: File | null;
  /** Always optional. */
  medicalDoc?: File | null;
}

/** Multipart body — the child endpoints bind [FromForm] so documents ride the same request. */
function childForm(input: UpsertChildInput): FormData {
  const form = new FormData();
  if (input.id) form.append("id", input.id);
  form.append("firstName", input.firstName);
  if (input.middleName) form.append("middleName", input.middleName);
  form.append("lastName", input.lastName);
  form.append("dateOfBirth", input.dateOfBirth);
  if (input.gender) form.append("gender", input.gender);
  if (input.previousSchool) form.append("previousSchool", input.previousSchool);
  if (input.medicalInfo) form.append("medicalInfo", input.medicalInfo);
  if (input.relationship) form.append("relationship", input.relationship);
  if (input.photo) form.append("photo", input.photo);
  if (input.birthCert) form.append("birthCert", input.birthCert);
  if (input.medicalDoc) form.append("medicalDoc", input.medicalDoc);
  return form;
}

/**
 * Save a child to my account from the identity space (EDD-002): no school needed, and my parent
 * profile is created on the first child. Returns the child_profile id. Mirrors upsertChild's body.
 */
export async function saveMyChild(
  input: UpsertChildInput
): Promise<{ childProfileId: string; message: string }> {
  const { data, message } = await apiPostForm<{ childProfileId: string }>(
    "/identity/children",
    childForm(input)
  );
  return { childProfileId: data.childProfileId, message };
}

/** Create a child profile (or update one I own). Returns the child_profile id. */
export async function upsertChild(
  input: UpsertChildInput
): Promise<{ childProfileId: string; message: string }> {
  const { data, message } = await apiPostForm<{ childProfileId: string }>(
    "/family/children",
    childForm(input)
  );
  return { childProfileId: data.childProfileId, message };
}

/** A child's PUBLISHED report cards. */
export async function getChildReportCards(
  childProfileId: string
): Promise<ChildReportCard[]> {
  const { data } = await apiGet<ChildReportCard[]>(
    `/family/children/${childProfileId}/report-cards`
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
    `/family/children/${childProfileId}/ca-scores${qs}`
  );
  return data ?? [];
}

/** A child's attendance summary per term. */
export async function getChildAttendanceSummary(
  childProfileId: string
): Promise<ChildAttendanceSummary[]> {
  const { data } = await apiGet<ChildAttendanceSummary[]>(
    `/family/children/${childProfileId}/attendance`
  );
  return data ?? [];
}
