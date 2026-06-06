export interface FeeType {
  id: string;
  schoolId: string;
  termId: string;
  name: string;
  amount: number;
  applicableClassIds: string[];
  createdAt: string;
}

export type InvoiceLineStatus = "unpaid" | "partial" | "paid";

export interface InvoiceLine {
  feeTypeId: string;
  feeTypeName: string;
  amount: number;
  paid: number;
  balance: number;
  status: InvoiceLineStatus;
}

export interface Invoice {
  id: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  termId: string;
  termName: string;
  lines: InvoiceLine[];
  totalAmount: number;
  totalPaid: number;
  balance: number;
  dueDate?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  parentId: string;
  studentId: string;
  studentName: string;
  schoolId: string;
  amount: number;
  opayReference: string;
  receiptUrl?: string;
  paidAt: string;
}

export interface ParentFeeSummary {
  studentId: string;
  studentName: string;
  schoolName: string;
  className: string;
  termName: string;
  outstandingFees: number;
  photoUrl?: string | null;
}

export interface PaymentHistoryRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentPhotoUrl: string | null;
  schoolName: string;
  className: string;
  termName: string;
  feeTypes: string[];
  amount: number;
  method: "card" | "bank_transfer" | "ussd" | "wallet";
  reference: string;
  status: "successful" | "failed" | "pending";
  paidAt: string;
}

export interface BursarSummary {
  totalExpected: number;
  totalCollected: number;
  totalOutstanding: number;
  fullPayers: number;
  partialPayers: number;
  zeroPayers: number;
}
