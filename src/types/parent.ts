export type PtaInviteStatus =
  | "not_invited"
  | "invite_sent"
  | "link_clicked"
  | "in_group"
  | "left_group";

export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  photoUrl?: string;
  status: "pending" | "active";
  createdAt: string;
}

export interface ParentChild {
  studentId: string;
  studentName: string;
  schoolId: string;
  schoolName: string;
  schoolLogoUrl?: string;
  className: string;
  outstandingFees: number;
  hasNewResult: boolean;
  hasNewMessage: boolean;
}

export interface ChildProfile {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  desiredClass: string;
  gender: "male" | "female";
  previousSchool?: string;
  medicalInfo?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelationship?: string;
  photoUrl: string | null;
}

export interface AttendanceSummary {
  term: string;
  totalDays: number;
  presentDays: number;
  absentDays: number;
  lateDays: number;
}

export interface SchoolMessage {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
}

export interface PtaInvite {
  parentId: string;
  parentName: string;
  parentPhone: string;
  status: PtaInviteStatus;
  invitedAt?: string;
  clickedAt?: string;
}

export interface PtaStats {
  total: number;
  notInvited: number;
  invited: number;
  clicked: number;
  inGroup: number;
  leftGroup: number;
}
