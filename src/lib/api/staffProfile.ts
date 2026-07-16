import { apiGet } from "./client";
import type { Staff } from "@/src/types/staff";
import type { School } from "@/src/types/school";
import type { StaffFeatures } from "@/src/types/staffFeatures";

// LIVE — the staff member's own profile ("me, in this school") with EFFECTIVE features resolved
// server-side exactly like login (role → template → overrides). Owners hold every feature.

export interface MyStaffProfile {
  staff: Staff;
  features: StaffFeatures;
  isSchoolAdmin: boolean;
}

export interface StaffWithPermissions {
  staff: Staff;
  features: StaffFeatures;
}

export interface StaffSchoolEntry {
  staff: Staff;
  school: School;
}

interface DirectoryItemDto {
  id: string;
  staffUserId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  role: Staff["role"];
  position?: string | null;
  employmentType: "full_time" | "part_time";
  status: "invited" | "active" | "inactive";
  createdAt: string;
}

const toStaff = (d: DirectoryItemDto, schoolId = ""): Staff => ({
  id: d.id,
  schoolId,
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
});

export const getMyStaffProfile = async (
  _userId?: string | undefined,
  _activeSchoolId?: string | null
): Promise<MyStaffProfile | null> => {
  const { data } = await apiGet<{
    staff: DirectoryItemDto | null;
    features: StaffFeatures;
    isSchoolAdmin: boolean;
  }>("/staff/profile/me");
  if (!data.staff && !data.isSchoolAdmin) return null;
  return {
    // An owner session has no directory entry — callers only read features/isSchoolAdmin then.
    staff: data.staff ? toStaff(data.staff) : ({} as Staff),
    features: data.features,
    isSchoolAdmin: data.isSchoolAdmin,
  };
};

// LIVE — GET /api/v1/staff/schools: every school this staff member belongs to.
export const getMySchools = async (
  _userId?: string | undefined
): Promise<StaffSchoolEntry[]> => {
  const { data } = await apiGet<
    {
      schoolId: string;
      schoolName?: string | null;
      role: Staff["role"];
      position?: string | null;
      employmentType: "full_time" | "part_time";
    }[]
  >("/staff/schools");
  return data.map((d) => ({
    staff: {
      id: d.schoolId, // per-school entry key; the page only keys on ids
      schoolId: d.schoolId,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      role: d.role,
      position: d.position ?? "",
      status: "active",
      employmentType: d.employmentType,
      createdAt: "",
    },
    school: {
      id: d.schoolId,
      name: d.schoolName ?? "School",
    } as School,
  }));
};

// LIVE — GET /api/v1/school/staff/permissions: the permissions matrix.
export const getStaffWithPermissions = async (): Promise<
  StaffWithPermissions[]
> => {
  const { data } = await apiGet<
    { staff: DirectoryItemDto; features: StaffFeatures }[]
  >("/school/staff/permissions");
  return data.map((d) => ({ staff: toStaff(d.staff), features: d.features }));
};
