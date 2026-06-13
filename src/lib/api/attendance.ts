import { mockResponse } from "./mockClient";
import {
  MOCK_ARM_STUDENTS,
  MOCK_ATTENDANCE_RECORDS,
} from "./mock/attendanceData";
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
} from "@/src/types/attendance";
import type { ClassLevel } from "@/src/types/school";

export interface ArmSelectOption {
  armId: string;
  armName: string;
  classId: string;
  className: string;
  level: ClassLevel;
}

// Returns only the arms where the logged-in teacher is the class teacher.
// Falls back to the first teacher's arms when userId is undefined (mock/dev only).
export const getTeacherArms = async (
  userId: string | undefined
): Promise<ArmSelectOption[]> => {
  const classMap = Object.fromEntries(
    MOCK_SCHOOL_CLASSES.map((c) => [c.id, c])
  );

  const staff = userId
    ? MOCK_STAFF.find((s) => s.userId === userId)
    : MOCK_STAFF.find((s) => s.role === "teacher"); // dev fallback

  if (!staff) return mockResponse([]);

  const options: ArmSelectOption[] = Object.values(MOCK_CLASS_ARMS)
    .flat()
    .filter((arm) => arm.classTeacher?.id === staff.id)
    .map((arm) => ({
      armId: arm.id,
      armName: arm.fullName,
      classId: arm.classId,
      className: arm.className,
      level: classMap[arm.classId]?.level ?? "primary",
    }));

  return mockResponse(options);
};

export const getAllArms = async (): Promise<ArmSelectOption[]> => {
  const classMap = Object.fromEntries(
    MOCK_SCHOOL_CLASSES.map((c) => [c.id, c])
  );
  const options: ArmSelectOption[] = Object.values(MOCK_CLASS_ARMS)
    .flat()
    .map((arm) => ({
      armId: arm.id,
      armName: arm.fullName,
      classId: arm.classId,
      className: arm.className,
      level: classMap[arm.classId]?.level ?? "primary",
    }));
  return mockResponse(options);
};

export const getStudentsForArm = async (
  armId: string
): Promise<AttendanceStudentRow[]> =>
  mockResponse(MOCK_ARM_STUDENTS[armId] ?? []);

export const getAttendanceRecord = async (
  armId: string,
  date: string
): Promise<AttendanceRecord | null> => {
  const record = MOCK_ATTENDANCE_RECORDS.find(
    (r) => r.armId === armId && r.date === date
  );
  return mockResponse(record ?? null);
};

export const getAttendanceOverview = async (
  date: string
): Promise<AttendanceOverview> => {
  const allArms = Object.values(MOCK_CLASS_ARMS).flat();
  const classMap = Object.fromEntries(
    MOCK_SCHOOL_CLASSES.map((c) => [c.id, c])
  );

  const armStats: ArmAttendanceStat[] = allArms.map((arm) => {
    const record = MOCK_ATTENDANCE_RECORDS.find(
      (r) => r.armId === arm.id && r.date === date
    );
    const totalCount = (MOCK_ARM_STUDENTS[arm.id] ?? []).length;

    if (!record) {
      return {
        armId: arm.id,
        armName: arm.fullName,
        submitted: false,
        presentCount: 0,
        absentCount: 0,
        lateCount: 0,
        totalCount,
        presentPct: 0,
      };
    }
    return {
      armId: arm.id,
      armName: arm.fullName,
      submitted: true,
      presentCount: record.presentCount,
      absentCount: record.absentCount,
      lateCount: record.lateCount,
      totalCount: record.totalCount,
      presentPct:
        record.totalCount > 0
          ? Math.round((record.presentCount / record.totalCount) * 100)
          : 0,
    };
  });

  const submitted = armStats.filter((a) => a.submitted);
  const totalPresent = submitted.reduce((s, a) => s + a.presentCount, 0);
  const totalAbsent = submitted.reduce((s, a) => s + a.absentCount, 0);
  const totalLate = submitted.reduce((s, a) => s + a.lateCount, 0);
  const totalStudents = submitted.reduce((s, a) => s + a.totalCount, 0);

  const absentStudents = MOCK_ATTENDANCE_RECORDS.filter(
    (r) => r.date === date
  ).flatMap((r) =>
    r.marks
      .filter((m) => m.status === "absent")
      .map((m) => ({ studentName: m.studentName, armName: r.armName }))
  );

  // suppress unused-import warning
  void classMap;

  return mockResponse({
    date,
    totalPresent,
    totalAbsent,
    totalLate,
    totalStudents,
    overallPresentPct:
      totalStudents > 0 ? Math.round((totalPresent / totalStudents) * 100) : 0,
    arms: armStats,
    absentStudents,
  });
};

export const submitAttendance = async (payload: {
  armId: string;
  armName: string;
  date: string;
  marks: (AttendanceMark & { studentName: string })[];
}): Promise<AttendanceRecord> => {
  const presentCount = payload.marks.filter(
    (m) => m.status === "present"
  ).length;
  const absentCount = payload.marks.filter((m) => m.status === "absent").length;
  const lateCount = payload.marks.filter((m) => m.status === "late").length;

  const record: AttendanceRecord = {
    id: `att-${Date.now()}`,
    armId: payload.armId,
    armName: payload.armName,
    date: payload.date,
    marks: payload.marks,
    submittedBy: "School Admin",
    submittedAt: new Date().toISOString(),
    presentCount,
    absentCount,
    lateCount,
    totalCount: payload.marks.length,
  };

  const idx = MOCK_ATTENDANCE_RECORDS.findIndex(
    (r) => r.armId === payload.armId && r.date === payload.date
  );
  if (idx >= 0) {
    MOCK_ATTENDANCE_RECORDS[idx] = record;
  } else {
    MOCK_ATTENDANCE_RECORDS.push(record);
  }

  return mockResponse(record);
};
