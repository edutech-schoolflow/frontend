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
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  position: string;
  photoUrl?: string;
  classIds?: string[];
  status: "active" | "inactive" | "pending";
  createdAt: string;
}

export interface StaffInvitation {
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
}
