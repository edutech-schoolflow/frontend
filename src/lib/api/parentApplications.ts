import { apiGet, apiPost } from "./client";
import type { Application, ApplicationStatus } from "@/src/types/application";

// ── backend shape (api/v1/parent/applications) ─────────────────────────────────

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

// The frontend uses `not_admitted`; the backend enum calls it `rejected`.
function toStatus(s: ApplicationResponse["status"]): ApplicationStatus {
  return s === "rejected" ? "not_admitted" : s;
}

function toApplication(r: ApplicationResponse): Application {
  return {
    id: r.id,
    referenceNumber: r.referenceNumber,
    schoolId: r.schoolId,
    schoolName: r.schoolName ?? "",
    parentId: r.parentId,
    parentName: r.parentName ?? "",
    parentPhone: r.parentPhone ?? "",
    childFirstName: r.childFirstName,
    childLastName: r.childLastName,
    childMiddleName: r.childMiddleName ?? undefined,
    childDateOfBirth: r.childDateOfBirth,
    childGender: r.childGender ?? "male",
    desiredClass: r.desiredClass ?? "",
    previousSchool: r.previousSchool ?? undefined,
    medicalNotes: r.medicalNotes ?? undefined,
    additionalGuardians: [],
    status: toStatus(r.status),
    applicationFeePaid: r.applicationFeePaid,
    applicationFeeAmount: r.applicationFee,
    paymentReceiptId: r.paymentReference ?? undefined,
    examDate: r.examDate ?? undefined,
    examTime: r.examTime ?? undefined,
    examVenue: r.examVenue ?? undefined,
    examInstructions: r.examInstructions ?? undefined,
    assessmentRating: r.assessmentRating ?? undefined,
    assessmentNotes: r.assessmentNotes ?? undefined,
    rejectionReason: r.rejectionReason ?? undefined,
    admissionNumber: r.admissionNumber ?? undefined,
    submittedAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

// ── requests ────────────────────────────────────────────────────────────────────

export async function getMyApplications(): Promise<Application[]> {
  // Identity space (EDD-002): my applications across schools, from the identity session.
  const { data } = await apiGet<ApplicationResponse[]>(
    "/identity/applications"
  );
  return (data ?? []).map(toApplication);
}

export async function getApplication(id: string): Promise<Application> {
  const { data } = await apiGet<ApplicationResponse>(
    `/parent/applications/${id}`
  );
  return toApplication(data);
}

export interface SubmitApplicationInput {
  childProfileId: string;
  schoolId: string;
  desiredClass?: string;
  termId?: string;
}

export async function submitApplication(
  input: SubmitApplicationInput
): Promise<{ application: Application; message: string }> {
  const { data, message } = await apiPost<ApplicationResponse>(
    "/parent/applications",
    {
      childProfileId: input.childProfileId,
      schoolId: input.schoolId,
      desiredClass: input.desiredClass ?? null,
      termId: input.termId ?? null,
    }
  );
  return { application: toApplication(data), message };
}

export async function payApplicationFee(
  applicationId: string
): Promise<{ application: Application; message: string }> {
  const { data, message } = await apiPost<ApplicationResponse>(
    `/parent/applications/${applicationId}/pay`,
    {}
  );
  return { application: toApplication(data), message };
}
