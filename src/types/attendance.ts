export type AttendanceStatus = "present" | "absent" | "late";

export interface ArmAttendanceStat {
  armId: string;
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
  arms: ArmAttendanceStat[];
  absentStudents: { studentName: string; armName: string }[];
}

export interface AttendanceStudentRow {
  studentId: string;
  studentName: string;
  admissionNumber: string;
}

export interface AttendanceMark {
  studentId: string;
  status: AttendanceStatus;
}

export interface AttendanceRecord {
  id: string;
  armId: string;
  armName: string;
  date: string; // YYYY-MM-DD
  marks: (AttendanceMark & { studentName: string })[];
  submittedBy: string;
  submittedAt: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  totalCount: number;
}
