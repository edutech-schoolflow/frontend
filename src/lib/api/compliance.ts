import { mockResponse } from "./mockClient";
import { MOCK_COMPLIANCE } from "./mock/complianceData";
import type {
  ActorType,
  ComplianceRecord,
  StepStatus,
} from "@/src/types/compliance";
import { stepDefsFor, computeOverallStatus } from "@/src/types/compliance";

function defaultRecord(
  actorType: ActorType,
  actorId: string
): ComplianceRecord {
  return {
    actorType,
    actorId,
    steps: stepDefsFor(actorType).map((def) => ({
      ...def,
      status: "not_started" as StepStatus,
    })),
    overallStatus: "incomplete",
    updatedAt: new Date().toISOString(),
  };
}

export const getComplianceRecord = async (
  actorType: ActorType,
  actorId: string | undefined
): Promise<ComplianceRecord> => {
  const id = actorId ?? "demo-user";
  const record = MOCK_COMPLIANCE.find(
    (r) => r.actorType === actorType && r.actorId === id
  );
  if (record) return mockResponse(record);
  const blank = defaultRecord(actorType, id);
  MOCK_COMPLIANCE.push(blank);
  return mockResponse(blank);
};

export const updateComplianceStep = async (
  actorType: ActorType,
  actorId: string | undefined,
  stepId: string,
  status: StepStatus,
  data?: Record<string, string>
): Promise<ComplianceRecord> => {
  const id = actorId ?? "demo-user";
  let idx = MOCK_COMPLIANCE.findIndex(
    (r) => r.actorType === actorType && r.actorId === id
  );
  if (idx < 0) {
    MOCK_COMPLIANCE.push(defaultRecord(actorType, id));
    idx = MOCK_COMPLIANCE.length - 1;
  }
  const record = MOCK_COMPLIANCE[idx];
  const stepIdx = record.steps.findIndex((s) => s.id === stepId);
  if (stepIdx >= 0) {
    record.steps[stepIdx] = {
      ...record.steps[stepIdx],
      status,
      ...(data ? { data } : {}),
    };
  }
  record.overallStatus = computeOverallStatus(record.steps);
  record.updatedAt = new Date().toISOString();
  return mockResponse({ ...record });
};

// Convenience wrapper for the NIN step used by teachers and parents
export const submitNIN = async (
  actorType: "teacher" | "parent",
  actorId: string | undefined,
  nin: string
): Promise<ComplianceRecord> => {
  return updateComplianceStep(actorType, actorId, "nin", "pending", {
    nin,
    submittedAt: new Date().toISOString(),
  });
};
