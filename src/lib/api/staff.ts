import { apiGet } from "./client";
import { mockResponse } from "./mockClient";
import {
  MOCK_STAFF,
  MOCK_CLASS_ARMS,
  MOCK_INVITE_TOKENS,
} from "./mock/schoolData";
import type { Staff, StaffInvitation } from "@/src/types/staff";

export interface InviteStaffResult {
  staff: Staff;
  inviteLink: string;
}

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

// LIVE — GET /api/v1/school/staff (Workforce directory). Item ids are AFFILIATION ids — the same
// key the staff-attendance board uses. armsByStaff (class-teacher arms) has no endpoint yet.
interface StaffDirectoryItemDto {
  id: string;
  staffUserId: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phone: string;
  email?: string | null;
  role: Staff["role"];
  position?: string | null;
  employmentType: "full_time" | "part_time";
  status: "invited" | "active" | "inactive";
  createdAt: string;
}

export const getSchoolStaff = async (): Promise<{
  staff: Staff[];
  armsByStaff: Record<string, string[]>;
}> => {
  const { data } = await apiGet<StaffDirectoryItemDto[]>("/school/staff");
  return {
    staff: data.map((d) => ({
      id: d.id,
      schoolId: "",
      userId: d.staffUserId,
      firstName: d.firstName,
      lastName: d.lastName,
      email: d.email ?? "",
      phone: d.phone,
      role: d.role,
      position: d.position ?? "",
      status: d.status === "invited" ? "pending" : d.status,
      employmentType: d.employmentType,
      createdAt: d.createdAt,
    })),
    armsByStaff: {},
  };
};

export const getStaffMember = async (id: string): Promise<Staff | null> =>
  mockResponse(MOCK_STAFF.find((s) => s.id === id) ?? null);

export const inviteStaff = async (
  payload: StaffInvitation
): Promise<InviteStaffResult> => {
  const id = `stf-${Date.now()}`;
  const token = `invite-${id}`;
  const newStaff: Staff = {
    id,
    schoolId: "sch-001",
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    phone: payload.phone,
    role: payload.role,
    position: payload.position,
    status: "pending",
    inviteToken: token,
    createdAt: new Date().toISOString(),
  };
  MOCK_STAFF.push(newStaff);
  MOCK_INVITE_TOKENS[token] = { staffId: id };

  // Persist so the token survives a page reload when the link is opened
  if (typeof window !== "undefined") {
    const stored = JSON.parse(
      localStorage.getItem("mock_pending_invites") ?? "{}"
    );
    stored[token] = { staffId: id, staff: newStaff };
    localStorage.setItem("mock_pending_invites", JSON.stringify(stored));
  }

  const origin =
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";
  return mockResponse({
    staff: newStaff,
    inviteLink: `${origin}/staff/register?token=${token}`,
  });
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
