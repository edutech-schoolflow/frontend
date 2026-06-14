import { mockResponse } from "./mockClient";
import { MOCK_STAFF, MOCK_SCHOOLS, MOCK_CLASS_ARMS } from "./mock/schoolData";

export interface StaffPortalProfile {
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

export const getStaffPortalProfile = async (
  userId: string | undefined,
  activeSchoolId?: string | null
): Promise<StaffPortalProfile | null> => {
  if (!userId) return mockResponse(null);

  const records = MOCK_STAFF.filter(
    (s) => s.userId === userId && s.status === "active"
  );
  if (!records.length) return mockResponse(null);

  const staff =
    (activeSchoolId && records.find((s) => s.schoolId === activeSchoolId)) ||
    records[0];

  const school = MOCK_SCHOOLS.find((sc) => sc.id === staff.schoolId);

  const assignedArms = Object.values(MOCK_CLASS_ARMS)
    .flat()
    .filter((arm) => arm.classTeacher?.id === staff.id)
    .map((arm) => arm.fullName);

  return mockResponse({
    staffId: staff.id,
    userId: staff.userId ?? "",
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    phone: staff.phone,
    position: staff.position,
    status: staff.status,
    schoolId: staff.schoolId,
    schoolName: school?.name ?? "Unknown School",
    joinedAt: staff.createdAt,
    assignedArms,
  });
};

export const updateStaffPortalProfile = async (
  userId: string | undefined,
  updates: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  },
  activeSchoolId?: string | null
): Promise<StaffPortalProfile> => {
  if (!userId) throw new Error("Staff not found");

  const records = MOCK_STAFF.filter(
    (s) => s.userId === userId && s.status === "active"
  );
  if (!records.length) throw new Error("Staff not found");

  const target =
    (activeSchoolId && records.find((s) => s.schoolId === activeSchoolId)) ||
    records[0];

  const staffIdx = MOCK_STAFF.indexOf(target);
  if (staffIdx < 0) throw new Error("Staff not found");

  MOCK_STAFF[staffIdx] = { ...MOCK_STAFF[staffIdx], ...updates };

  const updated = await getStaffPortalProfile(userId, activeSchoolId);
  return updated!;
};
