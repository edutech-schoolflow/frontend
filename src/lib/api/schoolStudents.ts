import { apiGet, apiPost } from "./client";
import type { Student } from "@/src/types/student";

// ── backend shapes ────────────────────────────────────────────────────────────

interface GuardianResponse {
  name: string;
  phone: string;
  relationship: string;
  email?: string | null;
}

interface StudentResponse {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth: string; // yyyy-MM-dd
  gender: "male" | "female";
  photoUrl?: string | null;
  previousSchool?: string | null;
  medicalNotes?: string | null;
  admissionNumber?: string | null;
  classArmId?: string | null;
  classId?: string | null;
  className?: string | null;
  arm?: string | null;
  status: "active" | "withdrawn";
  guardians: GuardianResponse[];
  createdAt: string;
}

function toStudent(s: StudentResponse): Student {
  return {
    id: s.id,
    schoolId: "",
    firstName: s.firstName,
    lastName: s.lastName,
    middleName: s.middleName ?? undefined,
    dateOfBirth: s.dateOfBirth,
    gender: s.gender,
    photoUrl: s.photoUrl ?? undefined,
    previousSchool: s.previousSchool ?? undefined,
    medicalNotes: s.medicalNotes ?? undefined,
    admissionNumber: s.admissionNumber ?? undefined,
    classId: s.classId ?? undefined, // the CLASS the arm belongs to — used for filter/display
    status: s.status,
    guardians: s.guardians.map((g) => ({
      name: g.name,
      phone: g.phone,
      relationship: g.relationship,
      email: g.email ?? undefined,
    })),
    createdAt: s.createdAt,
  };
}

// ── requests ──────────────────────────────────────────────────────────────────

export async function getStudents(params?: {
  classArmId?: string;
  status?: "active" | "withdrawn";
  page?: number;
  limit?: number;
}): Promise<{ data: Student[]; total: number }> {
  const qs = new URLSearchParams();
  if (params?.classArmId) qs.set("classArmId", params.classArmId);
  if (params?.status) qs.set("status", params.status);
  qs.set("page", String(params?.page ?? 1));
  qs.set("limit", String(params?.limit ?? 200));
  const { data } = await apiGet<{ data: StudentResponse[]; total: number }>(
    `/students?${qs.toString()}`
  );
  return { data: data.data.map(toStudent), total: data.total };
}

export interface CreateStudentInput {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string; // yyyy-MM-dd
  gender: "male" | "female";
  classId: string; // the class (required)
  classArmId?: string; // optional stream within the class
  previousSchool?: string;
  medicalNotes?: string;
  parent: {
    phone: string;
    firstName?: string;
    lastName?: string;
    relationship?: string;
  };
}

export async function createStudent(
  input: CreateStudentInput
): Promise<Student> {
  const { data } = await apiPost<StudentResponse>("/students", {
    firstName: input.firstName,
    middleName: input.middleName ?? null,
    lastName: input.lastName,
    dateOfBirth: input.dateOfBirth,
    gender: input.gender,
    previousSchool: input.previousSchool ?? null,
    medicalNotes: input.medicalNotes ?? null,
    classId: input.classId,
    classArmId: input.classArmId ?? null,
    // The backend links/creates the parent account by phone (existing → reuse, new → pending).
    parent: {
      phone: input.parent.phone,
      firstName: input.parent.firstName ?? null,
      lastName: input.parent.lastName ?? null,
      relationship: input.parent.relationship ?? null,
    },
    guardians: [],
  });
  return toStudent(data);
}

export interface ParentLookupResult {
  found: boolean;
  /** Full name of the existing guardian (only when found). */
  name?: string | null;
  /** "registered" (activated) or "pending" (school-seeded, not yet claimed). */
  status?: "registered" | "pending" | null;
  /** Backend-authored message describing what will happen. */
  message: string;
}

export async function lookupParentByPhone(
  phone: string
): Promise<ParentLookupResult> {
  const { data, message } = await apiGet<{
    found: boolean;
    name?: string | null;
    status?: "registered" | "pending" | null;
  }>(`/students/parent-lookup?phone=${encodeURIComponent(phone)}`);
  return { ...data, message };
}

// ── lifecycle actions ──────────────────────────────────────────────────────────

export async function withdrawStudent(id: string): Promise<void> {
  await apiPost<null>(`/students/${id}/withdraw`, {});
}

export async function reAdmitStudent(id: string): Promise<void> {
  await apiPost<null>(`/students/${id}/re-admit`, {});
}

export async function transferStudent(
  id: string,
  classArmId: string
): Promise<void> {
  await apiPost<null>(`/students/${id}/transfer`, { classArmId });
}

/** Reverse the student's most recent lifecycle action; returns the backend's summary message. */
export async function undoLastStudent(id: string): Promise<string> {
  const { message } = await apiPost<null>(`/students/${id}/undo-last`, {});
  return message;
}

// ── end-of-session promotion ───────────────────────────────────────────────────

export type PromotionAction = "promote" | "repeat" | "graduate";

export interface PromotionItemInput {
  studentId: string;
  action: PromotionAction;
  targetClassId?: string | null; // required for promote/repeat
  targetClassArmId?: string | null;
}

export interface PromoteStudentsInput {
  targetAcademicYearId: string;
  promotions: PromotionItemInput[];
}

export interface PromotionResult {
  promoted: number;
  repeated: number;
  graduated: number;
}

export async function promoteStudents(
  input: PromoteStudentsInput
): Promise<PromotionResult> {
  const { data } = await apiPost<PromotionResult>("/students/promote", {
    targetAcademicYearId: input.targetAcademicYearId,
    promotions: input.promotions.map((p) => ({
      studentId: p.studentId,
      action: p.action,
      targetClassId: p.targetClassId ?? null,
      targetClassArmId: p.targetClassArmId ?? null,
    })),
  });
  return data;
}
