import type { StaffFeatures } from "./staffFeatures";
import type { TeacherAssignment } from "./school";

export type StaffRole =
  | "super_admin"
  | "school_admin"
  | "principal"
  | "vice_principal"
  | "teacher"
  | "bursar"
  | "registrar";

export interface Staff {
  id: string;
  schoolId: string;
  userId?: string; // absent for pending invites
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  position: string;
  photoUrl?: string;
  assignments?: TeacherAssignment[]; // typed class/subject assignments (replaces flat classIds)
  status: "active" | "inactive" | "pending";
  employmentType?: "full_time" | "part_time";
  createdAt: string;
  permissionTemplateId?: string;
  featureOverrides?: Partial<StaffFeatures>;
  isOwner?: boolean; // true only for the account that registered the school
  inviteToken?: string; // set on pending staff; cleared after registration completes
}

export interface StaffInvitation {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  position: string;
}

export const ROLE_LABELS: Record<StaffRole, string> = {
  super_admin: "Super Admin",
  school_admin: "Admin",
  principal: "Principal",
  vice_principal: "Vice Principal",
  teacher: "Teacher",
  bursar: "Bursar",
  registrar: "Registrar",
};

export const INVITABLE_ROLES: StaffRole[] = [
  "teacher",
  "school_admin",
  "principal",
  "vice_principal",
  "bursar",
  "registrar",
];
