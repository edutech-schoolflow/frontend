export type ActorType = "school" | "teacher" | "parent";

// Unified step status across all actor types
export type StepStatus = "not_started" | "in_progress" | "pending" | "verified";

export type OverallStatus = "incomplete" | "pending" | "verified";

export interface ComplianceStep {
  id: string;
  label: string;
  status: StepStatus;
  required: boolean;
  data?: Record<string, string>; // step-specific payload (e.g. nin, submittedAt)
}

export interface ComplianceRecord {
  actorType: ActorType;
  actorId: string;
  steps: ComplianceStep[];
  overallStatus: OverallStatus;
  updatedAt: string;
}

// ─── Step definitions per actor type ──────────────────────────────────────────

export const SCHOOL_STEP_DEFS: Pick<
  ComplianceStep,
  "id" | "label" | "required"
>[] = [
  { id: "school_profile", label: "School Profile", required: true },
  { id: "contact_setup", label: "Contact Setup", required: true },
  { id: "proprietor", label: "Proprietor / Owner", required: true },
  {
    id: "business_registration",
    label: "Business Registration",
    required: true,
  },
  { id: "review", label: "Review & Submit", required: true },
];

export const TEACHER_STEP_DEFS: Pick<
  ComplianceStep,
  "id" | "label" | "required"
>[] = [{ id: "nin", label: "National ID (NIN)", required: true }];

export const PARENT_STEP_DEFS: Pick<
  ComplianceStep,
  "id" | "label" | "required"
>[] = [{ id: "nin", label: "National ID (NIN)", required: true }];

export function stepDefsFor(actorType: ActorType) {
  if (actorType === "school") return SCHOOL_STEP_DEFS;
  if (actorType === "teacher") return TEACHER_STEP_DEFS;
  return PARENT_STEP_DEFS;
}

export function computeOverallStatus(steps: ComplianceStep[]): OverallStatus {
  const required = steps.filter((s) => s.required);
  if (required.every((s) => s.status === "verified")) return "verified";
  if (
    required.some((s) => s.status === "pending" || s.status === "in_progress")
  )
    return "pending";
  return "incomplete";
}
