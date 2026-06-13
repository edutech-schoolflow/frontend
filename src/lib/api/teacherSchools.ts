import { mockResponse } from "./mockClient";
import { MOCK_STAFF, MOCK_SCHOOL, MOCK_CLASS_ARMS } from "./mock/schoolData";

export interface TeacherSchoolAffiliation {
  schoolId: string;
  schoolName: string;
  position: string;
  address?: string;
  phone?: string;
  email?: string;
  assignedArms: string[];
  status: "active" | "invited" | "resigned";
  complianceVerified: boolean;
  joinedAt?: string;
}

export const getTeacherSchools = async (
  userId: string | undefined
): Promise<TeacherSchoolAffiliation[]> => {
  const id = userId ?? "demo-user";

  const staff = MOCK_STAFF.find((s) => s.userId === id && s.role === "teacher");
  if (!staff) return mockResponse([]);

  const assignedArms = Object.values(MOCK_CLASS_ARMS)
    .flat()
    .filter((arm) => arm.classTeacher?.id === staff.id)
    .map((arm) => arm.fullName);

  const affiliation: TeacherSchoolAffiliation = {
    schoolId: staff.schoolId,
    schoolName: MOCK_SCHOOL.name,
    position: staff.position ?? "Teacher",
    address: `${MOCK_SCHOOL.address}, ${MOCK_SCHOOL.city}, ${MOCK_SCHOOL.state}`,
    phone: MOCK_SCHOOL.phone,
    email: MOCK_SCHOOL.email,
    assignedArms,
    status: staff.status === "active" ? "active" : "resigned",
    complianceVerified: true,
    joinedAt: staff.createdAt,
  };

  return mockResponse([affiliation]);
};
