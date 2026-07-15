import { apiGet, apiPost } from "./client";
import type { Application, ApplicationStatus } from "@/src/types/application";

// ── backend shape (ApplicationResponse, camelCase, enums as snake_case) ─────────

interface ApplicationResponse {
  id: string;
  referenceNumber: string;
  childProfileId: string;
  childFirstName: string;
  childMiddleName?: string | null;
  childLastName: string;
  childDateOfBirth: string;
  childGender?: "male" | "female" | null;
  previousSchool?: string | null;
  medicalNotes?: string | null;
  schoolId: string;
  schoolName?: string | null;
  parentId: string;
  parentName?: string | null;
  parentPhone?: string | null;
  desiredClass?: string | null;
  termId?: string | null;
  applicationFee: number;
  applicationFeePaid: boolean;
  paymentReference?: string | null;
  status: "under_review" | "exam_scheduled" | "admitted" | "rejected";
  examDate?: string | null;
  examTime?: string | null;
  examVenue?: string | null;
  examInstructions?: string | null;
  assessmentRating?: "excellent" | "good" | "fair" | "poor" | null;
  assessmentNotes?: string | null;
  rejectionReason?: string | null;
  admissionNumber?: string | null;
  createdAt: string;
  updatedAt: string;
}

// The frontend calls the rejected state "not_admitted".
function toStatus(s: ApplicationResponse["status"]): ApplicationStatus {
  return s === "rejected" ? "not_admitted" : s;
}

function toApplication(a: ApplicationResponse): Application {
  return {
    id: a.id,
    referenceNumber: a.referenceNumber,
    schoolId: a.schoolId,
    schoolName: a.schoolName ?? "",
    parentId: a.parentId,
    parentName: a.parentName ?? "",
    parentPhone: a.parentPhone ?? "",
    childFirstName: a.childFirstName,
    childLastName: a.childLastName,
    childMiddleName: a.childMiddleName ?? undefined,
    childDateOfBirth: a.childDateOfBirth,
    childGender: a.childGender ?? "male",
    desiredClass: a.desiredClass ?? "—",
    previousSchool: a.previousSchool ?? undefined,
    medicalNotes: a.medicalNotes ?? undefined,
    // The school-side application response doesn't carry documents/extra guardians.
    additionalGuardians: [],
    status: toStatus(a.status),
    applicationFeePaid: a.applicationFeePaid,
    applicationFeeAmount: a.applicationFee,
    paymentReceiptId: a.paymentReference ?? undefined,
    examDate: a.examDate ?? undefined,
    examTime: a.examTime ?? undefined,
    examVenue: a.examVenue ?? undefined,
    examInstructions: a.examInstructions ?? undefined,
    assessmentRating: a.assessmentRating ?? undefined,
    assessmentNotes: a.assessmentNotes ?? undefined,
    rejectionReason: a.rejectionReason ?? undefined,
    admissionNumber: a.admissionNumber ?? undefined,
    submittedAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
}

// ── reads ───────────────────────────────────────────────────────────────────

/** All applications for the school, optionally filtered by status (backend wire value). */
export async function getSchoolApplications(
  status?: ApplicationStatus
): Promise<Application[]> {
  // Map the frontend's "not_admitted" back to the backend's "rejected".
  const wire = status === "not_admitted" ? "rejected" : status;
  const qs = wire ? `?status=${wire}` : "";
  const { data } = await apiGet<ApplicationResponse[]>(
    `/school/applications${qs}`
  );
  return data.map(toApplication);
}

export async function getSchoolApplication(id: string): Promise<Application> {
  const { data } = await apiGet<ApplicationResponse>(
    `/school/applications/${id}`
  );
  return toApplication(data);
}

// ── actions (each returns the updated application) ────────────────────────────

export interface ScheduleExamInput {
  type: "Written" | "Interview" | "Both";
  date: string; // yyyy-MM-dd
  time: string; // HH:mm
  venue: string;
  instructions?: string;
}

export async function scheduleExam(
  applicationId: string,
  input: ScheduleExamInput
): Promise<Application> {
  // The backend has no "type" column — fold it into the instructions so it's not lost.
  const examInstructions = [
    `Assessment type: ${input.type}`,
    input.instructions?.trim(),
  ]
    .filter(Boolean)
    .join(" — ");

  const { data } = await apiPost<ApplicationResponse>(
    `/school/applications/${applicationId}/exam`,
    {
      examDate: input.date,
      examTime: input.time,
      examVenue: input.venue,
      examInstructions,
    }
  );
  return toApplication(data);
}

export interface RecordAssessmentInput {
  attended: boolean;
  impression: "excellent" | "good" | "fair" | "poor";
  notes?: string;
}

export async function recordAssessment(
  applicationId: string,
  input: RecordAssessmentInput
): Promise<Application> {
  // A no-show has no rating; capture it in the notes instead.
  const notes = input.attended
    ? input.notes?.trim() || null
    : ["Did not attend the assessment.", input.notes?.trim()]
        .filter(Boolean)
        .join(" ");

  const { data } = await apiPost<ApplicationResponse>(
    `/school/applications/${applicationId}/assessment`,
    {
      rating: input.attended ? input.impression : null,
      notes,
    }
  );
  return toApplication(data);
}

export async function admitApplication(
  applicationId: string,
  input: { classId: string; classArmId?: string | null }
): Promise<Application> {
  const { data } = await apiPost<ApplicationResponse>(
    `/school/applications/${applicationId}/admit`,
    { classId: input.classId, classArmId: input.classArmId ?? null }
  );
  return toApplication(data);
}

export async function rejectApplication(
  applicationId: string,
  reason?: string
): Promise<Application> {
  const { data } = await apiPost<ApplicationResponse>(
    `/school/applications/${applicationId}/reject`,
    { reason: reason?.trim() || null }
  );
  return toApplication(data);
}
