import { mockResponse } from "./mockClient";
import { MOCK_STAFF, MOCK_CLASS_ARMS } from "./mock/schoolData";
import type { Staff, StaffInvitation } from "@/src/types/staff";

function getArmsByStaff(): Record<string, string[]> {
  const map: Record<string, string[]> = {};
  for (const arms of Object.values(MOCK_CLASS_ARMS)) {
    for (const arm of arms) {
      if (arm.classTeacher?.id) {
        if (!map[arm.classTeacher.id]) map[arm.classTeacher.id] = [];
        map[arm.classTeacher.id].push(arm.fullName);
      }
    }
  }
  return map;
}

export const getSchoolStaff = async (): Promise<{
  staff: Staff[];
  armsByStaff: Record<string, string[]>;
}> =>
  mockResponse({
    staff: [...MOCK_STAFF],
    armsByStaff: getArmsByStaff(),
  });

export const getStaffMember = async (id: string): Promise<Staff | null> =>
  mockResponse(MOCK_STAFF.find((s) => s.id === id) ?? null);

export const inviteStaff = async (payload: StaffInvitation): Promise<Staff> => {
  const newStaff: Staff = {
    id: `stf-${Date.now()}`,
    schoolId: "sch-001",
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    position: payload.position,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  MOCK_STAFF.push(newStaff);
  return mockResponse(newStaff);
};

export const updateStaffRole = async (
  id: string,
  updates: { role: Staff["role"]; position: string }
): Promise<Staff> => {
  const idx = MOCK_STAFF.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error("Staff member not found");
  MOCK_STAFF[idx] = { ...MOCK_STAFF[idx], ...updates };
  return mockResponse(MOCK_STAFF[idx]);
};

export const deactivateStaff = async (id: string): Promise<Staff> => {
  const idx = MOCK_STAFF.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error("Staff member not found");
  MOCK_STAFF[idx] = { ...MOCK_STAFF[idx], status: "inactive" };
  return mockResponse(MOCK_STAFF[idx]);
};

export const reactivateStaff = async (id: string): Promise<Staff> => {
  const idx = MOCK_STAFF.findIndex((s) => s.id === id);
  if (idx < 0) throw new Error("Staff member not found");
  MOCK_STAFF[idx] = { ...MOCK_STAFF[idx], status: "active" };
  return mockResponse(MOCK_STAFF[idx]);
};

export const resendInvite = async (_id: string): Promise<void> =>
  mockResponse(undefined);
