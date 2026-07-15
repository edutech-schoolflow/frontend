import { apiGet, apiPost } from "./client";
import type { ClassLevel } from "@/src/types/school";

export type AttendanceStatus = "present" | "absent" | "late";

// A register unit: a named arm (armId set) or a whole arm-less class (armId null).
export interface MarkableUnit {
  classId: string;
  armId: string | null;
  armName: string; // "JSS 1A" or just "JSS 1"
  className: string;
  level: ClassLevel;
}

export interface UnitAttendanceStat {
  classId: string;
  armId: string | null;
  armName: string;
  submitted: boolean;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  totalCount: number;
  presentPct: number;
}

export interface AttendanceOverview {
  date: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalStudents: number;
  overallPresentPct: number;
  arms: UnitAttendanceStat[];
  absentStudents: { studentName: string; armName: string }[];
}

export interface RosterStudent {
  studentId: string;
  studentName: string;
  admissionNumber?: string | null;
  status: AttendanceStatus | null;
}

export interface AttendanceRoster {
  classId: string;
  armId: string | null;
  armName: string;
  date: string;
  submitted: boolean;
  students: RosterStudent[];
}

// A stable key for a unit (arm id, or the class id for a whole-class unit).
export function unitKey(u: { classId: string; armId: string | null }): string {
  return u.armId ?? u.classId;
}

export async function getAttendanceOverview(
  date?: string
): Promise<AttendanceOverview> {
  const qs = date ? `?date=${date}` : "";
  const { data } = await apiGet<AttendanceOverview>(
    `/attendance/overview${qs}`
  );
  return data;
}

export async function getMarkableUnits(): Promise<MarkableUnit[]> {
  const { data } = await apiGet<MarkableUnit[]>("/attendance/arms");
  return data;
}

export async function getAttendanceRoster(
  classId: string,
  armId: string | null,
  date?: string
): Promise<AttendanceRoster> {
  const qs = new URLSearchParams({ classId });
  if (armId) qs.set("armId", armId);
  if (date) qs.set("date", date);
  const { data } = await apiGet<AttendanceRoster>(
    `/attendance/roster?${qs.toString()}`
  );
  return data;
}

export interface SubmitAttendanceInput {
  classId: string;
  armId: string | null;
  date: string;
  marks: { studentId: string; status: AttendanceStatus }[];
}

export async function submitAttendance(
  input: SubmitAttendanceInput
): Promise<void> {
  await apiPost("/attendance", {
    classId: input.classId,
    armId: input.armId,
    date: input.date,
    marks: input.marks,
  });
}
