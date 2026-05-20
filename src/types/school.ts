export type KycStatus = "not_submitted" | "under_review" | "approved" | "rejected";
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
