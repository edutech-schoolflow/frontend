import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAttendanceOverview,
  getMarkableUnits,
  getAttendanceRoster,
  submitAttendance,
  type SubmitAttendanceInput,
} from "./schoolAttendance";

export const attendanceOverviewKey = (date: string) =>
  ["school", "attendance", "overview", date] as const;
export const markableUnitsKey = ["school", "attendance", "units"] as const;
export const rosterKey = (
  classId: string,
  armId: string | null,
  date: string
) =>
  ["school", "attendance", "roster", classId, armId ?? "whole", date] as const;

export function useAttendanceOverview(date: string) {
  return useQuery({
    queryKey: attendanceOverviewKey(date),
    queryFn: () => getAttendanceOverview(date),
    enabled: !!date,
    staleTime: 15_000,
  });
}

export function useMarkableUnits() {
  return useQuery({
    queryKey: markableUnitsKey,
    queryFn: getMarkableUnits,
    staleTime: 60_000,
  });
}

export function useAttendanceRoster(
  classId: string | null,
  armId: string | null,
  date: string
) {
  return useQuery({
    queryKey: rosterKey(classId ?? "", armId, date),
    queryFn: () => getAttendanceRoster(classId as string, armId, date),
    enabled: !!classId && !!date,
  });
}

export function useSubmitAttendance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitAttendanceInput) => submitAttendance(input),
    onSuccess: () => {
      // Refresh the board and any roster for the affected date.
      qc.invalidateQueries({ queryKey: ["school", "attendance"] });
    },
  });
}
