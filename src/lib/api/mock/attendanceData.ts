import type {
  AttendanceStudentRow,
  AttendanceRecord,
} from "@/src/types/attendance";

export const MOCK_ARM_STUDENTS: Record<string, AttendanceStudentRow[]> = {
  "arm-001": [
    {
      studentId: "std-001",
      studentName: "David Okafor",
      admissionNumber: "GFA/2025/001",
    },
    {
      studentId: "std-003",
      studentName: "Emeka Nwachukwu",
      admissionNumber: "GFA/2025/003",
    },
    {
      studentId: "std-010",
      studentName: "Yusuf Abdullahi",
      admissionNumber: "GFA/2025/010",
    },
  ],
  "arm-002": [
    {
      studentId: "std-002",
      studentName: "Grace Adaeze",
      admissionNumber: "GFA/2025/002",
    },
    {
      studentId: "std-004",
      studentName: "Joseph Olabode",
      admissionNumber: "GFA/2025/004",
    },
    {
      studentId: "std-005",
      studentName: "Amina Bello",
      admissionNumber: "GFA/2025/005",
    },
  ],
  "arm-003": [
    {
      studentId: "std-006",
      studentName: "Chukwudi Eze",
      admissionNumber: "GFA/2025/006",
    },
    {
      studentId: "std-007",
      studentName: "Fatima Aliyu",
      admissionNumber: "GFA/2025/007",
    },
  ],
  "arm-004": [
    {
      studentId: "std-008",
      studentName: "Tunde Akindele",
      admissionNumber: "GFA/2025/008",
    },
    {
      studentId: "std-009",
      studentName: "Ngozi Obi",
      admissionNumber: "GFA/2025/009",
    },
  ],
};

// Mutable in-memory store — submitAttendance writes here during the session
export const MOCK_ATTENDANCE_RECORDS: AttendanceRecord[] = [];
