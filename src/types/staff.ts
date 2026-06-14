import type { StaffFeatures } from "./staffFeatures";

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
  classIds?: string[];
  status: "active" | "inactive" | "pending";
  employmentType?: "full_time" | "part_time";
  createdAt: string;
  permissionTemplateId?: string;
  featureOverrides?: Partial<StaffFeatures>;
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
