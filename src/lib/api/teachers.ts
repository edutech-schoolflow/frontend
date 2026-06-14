import { mockResponse } from "./mockClient";
import { MOCK_STAFF, MOCK_CLASS_ARMS } from "./mock/schoolData";
import { MOCK_ARM_STUDENTS } from "./mock/attendanceData";
import { MOCK_EXAM_PAPERS } from "./mock/examData";
import type { TeacherDashboardStats } from "@/src/types/teacher";

export const getTeacherDashboardStats = async (
  userId?: string
): Promise<TeacherDashboardStats> => {
  const staff = userId
    ? MOCK_STAFF.find((s) => s.userId === userId && s.role === "teacher")
    : MOCK_STAFF.find((s) => s.role === "teacher");

  if (!staff) {
    return mockResponse({
      armsCount: 0,
      totalStudents: 0,
      examsSubmitted: 0,
      attendanceMarkedToday: false,
    });
  }

  const assignedArms = Object.values(MOCK_CLASS_ARMS)
    .flat()
    .filter((arm) => arm.classTeacher?.id === staff.id);

  const totalStudents = assignedArms.reduce(
    (sum, arm) =>
      sum + (MOCK_ARM_STUDENTS[arm.id]?.length ?? arm.studentsCount),
    0
  );

  const examsSubmitted = MOCK_EXAM_PAPERS.filter(
    (p) =>
      assignedArms.some((arm) => arm.id === p.armId) && p.status !== "draft"
  ).length;

  return mockResponse({
    armsCount: assignedArms.length,
    totalStudents,
    examsSubmitted,
    attendanceMarkedToday: false,
  });
};

// suppress unused import
void MOCK_ARM_STUDENTS;
