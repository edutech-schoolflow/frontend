import { apiGet, apiPatch, apiPost } from "./client";
import type { Staff, StaffRole } from "@/src/types/staff";

/** Backend StaffDirectoryItemResponse. */
interface StaffDirectoryItem {
  id: string; // affiliation id
  staffUserId: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  phone: string;
  email?: string | null;
  role: string;
  position?: string | null;
  employmentType: string;
  status: string; // invited | active | inactive
  joinedAt?: string | null;
  createdAt: string;
}

/** Map the backend directory row to the frontend Staff shape the UI already uses. */
function toStaff(d: StaffDirectoryItem): Staff {
  return {
    id: d.id,
    schoolId: "",
    userId: d.staffUserId,
    firstName: d.firstName,
    lastName: d.lastName,
    email: d.email ?? "",
    phone: d.phone,
    role: d.role as StaffRole,
    position: d.position ?? "",
    status:
      d.status === "invited" ? "pending" : (d.status as "active" | "inactive"),
    employmentType: d.employmentType as "full_time" | "part_time",
    createdAt: d.createdAt,
  };
}

export async function getSchoolStaffList(): Promise<Staff[]> {
  const { data } = await apiGet<StaffDirectoryItem[]>("/school/staff");
  return data.map(toStaff);
}

export async function updateStaffRole(
  affiliationId: string,
  body: { role: StaffRole; position: string }
): Promise<Staff> {
  const { data } = await apiPatch<StaffDirectoryItem>(
    `/school/staff/${affiliationId}`,
    body
  );
  return toStaff(data);
}

export async function deactivateStaff(affiliationId: string): Promise<Staff> {
  const { data } = await apiPost<StaffDirectoryItem>(
    `/school/staff/${affiliationId}/deactivate`
  );
  return toStaff(data);
}

export async function reactivateStaff(affiliationId: string): Promise<Staff> {
  const { data } = await apiPost<StaffDirectoryItem>(
    `/school/staff/${affiliationId}/reactivate`
  );
  return toStaff(data);
}

export async function resendStaffInvite(affiliationId: string): Promise<void> {
  await apiPost<{ inviteLink: string; expiresAt: string }>(
    `/school/staff/${affiliationId}/resend-invite`
  );
}
