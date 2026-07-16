import { apiGet, apiPost } from "./client";
import { mockResponse } from "./mockClient";
import {
  MOCK_SCHOOL_CLASSES,
  MOCK_CLASS_ARMS,
  MOCK_STAFF,
} from "./mock/schoolData";
import type {
  AttendanceStudentRow,
  AttendanceRecord,
  AttendanceMark,
  AttendanceOverview,
  ArmAttendanceStat,
  AttendanceStatus,
} from "@/src/types/attendance";
import type { ClassLevel } from "@/src/types/school";

export interface ArmSelectOption {
  armId: string;
  armName: string;
  classId: string;
  className: string;
  level: ClassLevel;
}

// LIVE — GET /api/v1/attendance/arms: the arms this session may mark (class-teacher arms; every
// arm for the owner). The backend's unit can be arm-less (a whole class), so the frontend armId is
// a composite "classId|armId" key: call sites keep passing a single opaque string around.
const armKey = (classId: string, armId: string | null | undefined) =>
  `${classId}|${armId ?? ""}`;
const parseArmKey = (key: string): { classId: string; armId: string | null } => {
  const [classId, armId] = key.split("|");
  return { classId, armId: armId || null };
};

interface MarkableArmDto {
  armId?: string | null;
  armName: string;
  classId: string;
  className: string;
  level: ClassLevel;
}

export const getTeacherArms = async (
  _userId?: string | undefined
): Promise<ArmSelectOption[]> => {
  const { data } = await apiGet<MarkableArmDto[]>("/attendance/arms");
  return data.map((a) => ({
    armId: armKey(a.classId, a.armId),
    armName: a.armName,
    classId: a.classId,
    className: a.className,
    level: a.level,
  }));
};

// Returns the arms where this teacher is a subject teacher, grouped with
// which subjects they cover in each arm. Used by grade entry and exam paper
// submission to scope what subjects a subject teacher can act on.
export interface SubjectArmOption extends ArmSelectOption {
  subjects: string[]; // subject names this teacher covers in this arm
}

export const getTeacherSubjectArms = async (
  userId: string | undefined
): Promise<SubjectArmOption[]> => {
  const classMap = Object.fromEntries(
    MOCK_SCHOOL_CLASSES.map((c) => [c.id, c])
  );

  const staff = userId
    ? MOCK_STAFF.find((s) => s.userId === userId)
    : MOCK_STAFF.find((s) => s.role === "teacher");

  if (!staff?.assignments) return mockResponse([]);

  const options: SubjectArmOption[] = staff.assignments
    .filter((a) => a.type === "subject_teacher")
    .map((a) => ({
      armId: a.armId,
      armName: a.armName,
      classId: a.classId,
      className: a.className,
      level: classMap[a.classId]?.level ?? "junior_secondary",
      subjects: a.subjects,
    }));

  return mockResponse(options);
};

// Returns ALL arms this teacher has any assignment for (class teacher + subject
// teacher). Used by the "My Classes" overview page to show the full picture.
export const getTeacherAllArms = async (
  userId: string | undefined
): Promise<SubjectArmOption[]> => {
  const classMap = Object.fromEntries(
    MOCK_SCHOOL_CLASSES.map((c) => [c.id, c])
  );

  const staff = userId
    ? MOCK_STAFF.find((s) => s.userId === userId)
    : MOCK_STAFF.find((s) => s.role === "teacher");

  if (!staff?.assignments) return mockResponse([]);

  const options: SubjectArmOption[] = staff.assignments.map((a) => ({
    armId: a.armId,
    armName: a.armName,
    classId: a.classId,
    className: a.className,
    level: classMap[a.classId]?.level ?? "primary",
    subjects: a.subjects,
  }));

  return mockResponse(options);
};

// LIVE — same endpoint: for an owner session the backend returns every arm.
export const getAllArms = async (): Promise<ArmSelectOption[]> => getTeacherArms(undefined);

// LIVE — GET /api/v1/attendance/roster: the unit's active students (any date's marks ride along;
// this helper only needs the names).
interface RosterDto {
  classId: string;
  armId?: string | null;
  armName: string;
  date: string;
  submitted: boolean;
  students: {
    studentId: string;
    studentName: string;
    admissionNumber?: string | null;
    status?: AttendanceStatus | null;
  }[];
}

const fetchRoster = async (key: string, date?: string): Promise<RosterDto> => {
  const { classId, armId } = parseArmKey(key);
  const qs = new URLSearchParams({ classId });
  if (armId) qs.set("armId", armId);
  if (date) qs.set("date", date);
  const { data } = await apiGet<RosterDto>(`/attendance/roster?${qs}`);
  return data;
};

export const getStudentsForArm = async (
  armId: string
): Promise<AttendanceStudentRow[]> => {
  const roster = await fetchRoster(armId);
  return roster.students.map((st) => ({
    studentId: st.studentId,
    studentName: st.studentName,
    admissionNumber: st.admissionNumber ?? "",
  }));
};

export const getAttendanceRecord = async (
  armId: string,
  date: string
): Promise<AttendanceRecord | null> => {
  const roster = await fetchRoster(armId, date);
  if (!roster.submitted) return null;

  const marks = roster.students
    .filter((st) => st.status != null)
    .map((st) => ({
      studentId: st.studentId,
      studentName: st.studentName,
      status: st.status as AttendanceStatus,
    }));
  const count = (status: AttendanceStatus) =>
    marks.filter((m) => m.status === status).length;

  return {
    id: `${armId}:${roster.date}`,
    armId,
    armName: roster.armName,
    date: roster.date,
    marks,
    submittedBy: "",
    submittedAt: "",
    presentCount: count("present"),
    absentCount: count("absent"),
    lateCount: count("late"),
    totalCount: marks.length,
  };
};

// LIVE — GET /api/v1/attendance/overview: school-wide board for a date.
export const getAttendanceOverview = async (
  date: string
): Promise<AttendanceOverview> => {
  const { data } = await apiGet<{
    date: string;
    totalPresent: number;
    totalAbsent: number;
    totalLate: number;
    totalStudents: number;
    overallPresentPct: number;
    arms: (ArmAttendanceStat & { classId: string; armId?: string | null })[];
    absentStudents: { studentName: string; armName: string }[];
  }>(`/attendance/overview?date=${encodeURIComponent(date)}`);
  return {
    ...data,
    arms: data.arms.map((a) => ({ ...a, armId: armKey(a.classId, a.armId) })),
  };
};

// LIVE — POST /api/v1/attendance: submit (or replace) the day's register for the unit.
export const submitAttendance = async (payload: {
  armId: string;
  armName: string;
  date: string;
  marks: (AttendanceMark & { studentName: string })[];
}): Promise<AttendanceRecord> => {
  const { classId, armId } = parseArmKey(payload.armId);
  const { data } = await apiPost<{
    id: string;
    classId: string;
    armId?: string | null;
    armName: string;
    date: string;
    presentCount: number;
    absentCount: number;
    lateCount: number;
    totalCount: number;
    submittedAt: string;
  }>("/attendance", {
    classId,
    armId,
    date: payload.date,
    marks: payload.marks.map((m) => ({ studentId: m.studentId, status: m.status })),
  });

  return {
    id: data.id,
    armId: payload.armId,
    armName: data.armName,
    date: data.date,
    marks: payload.marks,
    submittedBy: "",
    submittedAt: data.submittedAt,
    presentCount: data.presentCount,
    absentCount: data.absentCount,
    lateCount: data.lateCount,
    totalCount: data.totalCount,
  };
};
