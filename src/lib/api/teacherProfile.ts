import { mockResponse } from "./mockClient";
import { MOCK_STAFF, MOCK_SCHOOL, MOCK_CLASS_ARMS } from "./mock/schoolData";

export interface TeacherProfile {
  staffId: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  status: "active" | "inactive" | "pending";
  schoolId: string;
  schoolName: string;
  joinedAt: string;
  assignedArms: string[];
}

export const getTeacherProfile = async (
  userId: string | undefined
): Promise<TeacherProfile | null> => {
  const id = userId ?? "demo-user";
  const staff =
    MOCK_STAFF.find((s) => s.userId === id && s.role === "teacher") ??
    MOCK_STAFF.find((s) => s.role === "teacher");

  if (!staff) return mockResponse(null);

  const assignedArms = Object.values(MOCK_CLASS_ARMS)
    .flat()
    .filter((arm) => arm.classTeacher?.id === staff.id)
    .map((arm) => arm.fullName);

  return mockResponse({
    staffId: staff.id,
    userId: staff.userId,
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    phone: staff.phone,
    position: staff.position,
    status: staff.status,
    schoolId: staff.schoolId,
    schoolName: MOCK_SCHOOL.name,
    joinedAt: staff.createdAt,
    assignedArms,
  });
};

export const updateTeacherProfile = async (
  userId: string | undefined,
  updates: { firstName: string; lastName: string; email: string; phone: string }
): Promise<TeacherProfile> => {
  const id = userId ?? "demo-user";
  const staffIdx =
    MOCK_STAFF.findIndex((s) => s.userId === id && s.role === "teacher") >= 0
      ? MOCK_STAFF.findIndex((s) => s.userId === id && s.role === "teacher")
      : MOCK_STAFF.findIndex((s) => s.role === "teacher");

  if (staffIdx < 0) throw new Error("Staff not found");

  MOCK_STAFF[staffIdx] = { ...MOCK_STAFF[staffIdx], ...updates };

  const updated = await getTeacherProfile(userId);
  return updated!;
};
