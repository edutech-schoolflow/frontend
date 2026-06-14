export type ApplicationStatus =
  | "under_review"
  | "exam_scheduled"
  | "admitted"
  | "not_admitted";

export interface ApplicationGuardian {
  name: string;
  phone: string;
  relationship: string;
}

export interface Application {
  id: string;
  referenceNumber: string;
  schoolId: string;
  schoolName: string;
  parentId: string;
  parentName: string;
  parentPhone: string;
  childFirstName: string;
  childLastName: string;
  childMiddleName?: string;
  childDateOfBirth: string;
  childGender: "male" | "female";
  desiredClass: string;
  termName?: string;
  previousSchool?: string;
  medicalNotes?: string;
  photoUrl?: string;
  birthCertUrl?: string;
  additionalGuardians: ApplicationGuardian[];
  status: ApplicationStatus;
  applicationFeePaid: boolean;
  applicationFeeAmount: number;
  paymentReceiptId?: string;
  examDate?: string;
  examTime?: string;
  examVenue?: string;
  examInstructions?: string;
  assessmentRating?: "excellent" | "good" | "fair" | "poor";
  assessmentNotes?: string;
  rejectionReason?: string;
  admissionNumber?: string; // assigned only upon admission, never before
  submittedAt: string;
  updatedAt: string;
}

export interface ApplicationPaymentDetails {
  bank: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  reference: string;
}
