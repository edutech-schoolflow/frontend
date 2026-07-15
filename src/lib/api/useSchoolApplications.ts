import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getSchoolApplications,
  getSchoolApplication,
  scheduleExam,
  recordAssessment,
  admitApplication,
  rejectApplication,
  type ScheduleExamInput,
  type RecordAssessmentInput,
} from "./schoolApplications";
import type { ApplicationStatus } from "@/src/types/application";

export const applicationsKey = ["school", "applications"] as const;
export const applicationKey = (id: string) =>
  ["school", "applications", id] as const;

export function useApplications(status?: ApplicationStatus) {
  return useQuery({
    queryKey: [...applicationsKey, status ?? "all"],
    queryFn: () => getSchoolApplications(status),
    staleTime: 15_000,
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: applicationKey(id),
    queryFn: () => getSchoolApplication(id),
    enabled: !!id,
  });
}

// Every action returns the updated application — seed the detail cache and
// invalidate the lists so counts/status refresh.
function useApplicationAction<TVars>(
  fn: (id: string, vars: TVars) => Promise<unknown>,
  id: string
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: TVars) => fn(id, vars),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: applicationKey(id) });
      qc.invalidateQueries({ queryKey: applicationsKey });
    },
  });
}

export function useScheduleExam(id: string) {
  return useApplicationAction<ScheduleExamInput>(scheduleExam, id);
}

export function useRecordAssessment(id: string) {
  return useApplicationAction<RecordAssessmentInput>(recordAssessment, id);
}

export function useAdmitApplication(id: string) {
  return useApplicationAction<{ classId: string; classArmId?: string | null }>(
    admitApplication,
    id
  );
}

export function useRejectApplication(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (reason?: string) => rejectApplication(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: applicationKey(id) });
      qc.invalidateQueries({ queryKey: applicationsKey });
    },
  });
}
