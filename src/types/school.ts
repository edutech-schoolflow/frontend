export type KycStatus =
  | "not_submitted"
  | "under_review"
  | "approved"
  | "rejected";
export type SchoolStatus = "pending_kyc" | "active" | "suspended";
export type SchoolVisibility = "hidden" | "public";
export type SchoolType = "nursery" | "primary" | "secondary" | "combined";

export interface School {
  id: string;
  name: string;
  subdomain: string;
  type: SchoolType;
  address: string;
  city: string;
  state: string;
  phone: string;
  email: string;
  logoUrl?: string;
  location?: { lat: number; lng: number };
  status: SchoolStatus;
  kycStatus: KycStatus;
  visibility: SchoolVisibility;
  paymentsEnabled: boolean;
  plan: string;
  createdAt: string;
}

export type KycDocumentType =
  | "registration_cert"
  | "operating_licence"
  | "proof_of_address"
  | "proprietor_id_front"
  | "proprietor_id_back";

export type KycDocumentStatus = "pending" | "approved" | "rejected";

export interface KycDocument {
  id: string;
  type: KycDocumentType;
  url: string;
  status: KycDocumentStatus;
  notes?: string;
}

export interface KycSubmission {
  id: string;
  schoolId: string;
  status: KycStatus;
  submittedAt: string;
  reviewedAt?: string;
  adminNotes?: string;
  schoolMessage?: string;
  documents: KycDocument[];
  proprietorName: string;
  proprietorIdType: string;
  proprietorIdNumber: string;
  proprietorPhone: string;
  proprietorEmail: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  accountType: "current" | "savings";
}

export interface SchoolOnboarding {
  logoUploaded: boolean;
  classesConfigured: boolean;
  academicYearSet: boolean;
  proprietorInvited: boolean;
  completed: boolean;
}

export interface AdmissionsSettings {
  admissionsOpen: boolean;
  applicationFee: number;
  availableClassIds: string[];
}

export interface SchoolListing {
  id: string;
  name: string;
  location: string;
  type: string;
  applicationFee: number;
  rating: string;
  verified: boolean;
  isRecommended: boolean;
}

export interface DashboardStats {
  studentsEnrolled: number;
  attendanceTodayPct: number;
  absenteesToday: number;
  outstandingFees: number;
  feesCollectedThisTerm: number;
  feeTargetThisTerm: number;
  pendingApplications: number;
  complianceApproved: boolean;
}

export type ActivityType =
  | "payment"
  | "application"
  | "result"
  | "staff"
  | "announcement";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  description: string;
  timestamp: string;
}

export interface DashboardApplication {
  id: string;
  studentName: string;
  classApplied: string;
  appliedAt: string;
  status: "pending" | "approved" | "rejected";
}

// ─── Classes & Arms ────────────────────────────────────────────────────────────

export type ClassLevel =
  | "nursery"
  | "primary"
  | "junior_secondary"
  | "senior_secondary";

export interface SchoolClass {
  id: string;
  name: string; // "JSS 1", "Primary 3", "SS 2"
  level: ClassLevel;
  order: number; // for sorting within a level
  armsCount: number;
  studentsCount: number;
}

export interface SubjectTeacher {
  subject: string;
  teacherId: string;
  teacherName: string;
}

export interface ClassArm {
  id: string;
  classId: string;
  className: string; // "JSS 1"
  arm: string; // "A", "B", "C"
  fullName: string; // "JSS 1A"
  classTeacher: { id: string; name: string } | null;
  studentsCount: number;
  subjectTeachers: SubjectTeacher[];
}

export interface CreateClassPayload {
  name: string;
  level: ClassLevel;
  arms: string[]; // ["A", "B", "C"]
}
