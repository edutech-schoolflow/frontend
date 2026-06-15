import { mockResponse } from "./mockClient";
import {
  MOCK_FEE_TYPES,
  MOCK_INVOICE,
  MOCK_INVOICES,
  MOCK_PAYMENTS,
  MOCK_BURSAR_SUMMARY,
} from "./mock/schoolData";
import {
  MOCK_PARENT_FEE_SUMMARIES,
  MOCK_PARENT_FEE_INVOICES,
} from "./mock/parentData";
import type { FeeType, ParentFeeSummary, Invoice } from "@/src/types/fee";

export const getParentFeeSummaries = async (): Promise<ParentFeeSummary[]> =>
  mockResponse(MOCK_PARENT_FEE_SUMMARIES);

export const getParentFeeInvoice = async (
  studentId: string
): Promise<Invoice | null> =>
  mockResponse(MOCK_PARENT_FEE_INVOICES[studentId] ?? null);

export const getFeeTypes = async (_params?: {
  termId?: string;
  classId?: string;
}) => mockResponse(MOCK_FEE_TYPES);

export const createFeeType = async (
  payload: Omit<FeeType, "id" | "schoolId" | "createdAt">
): Promise<FeeType> => {
  const item: FeeType = {
    ...payload,
    id: `ft-${Date.now()}`,
    schoolId: "sch-001",
    createdAt: new Date().toISOString(),
  };
  MOCK_FEE_TYPES.push(item);
  return mockResponse(item);
};

export const updateFeeType = async (
  id: string,
  payload: Partial<FeeType>
): Promise<FeeType> => {
  const idx = MOCK_FEE_TYPES.findIndex((f) => f.id === id);
  if (idx !== -1) Object.assign(MOCK_FEE_TYPES[idx], payload);
  return mockResponse(MOCK_FEE_TYPES[idx !== -1 ? idx : 0]);
};

export const deleteFeeType = async (id: string) => {
  const idx = MOCK_FEE_TYPES.findIndex((f) => f.id === id);
  if (idx !== -1) MOCK_FEE_TYPES.splice(idx, 1);
  return mockResponse({ message: "Fee type deleted." });
};

export const generateInvoices = async (_classId: string, _termId: string) =>
  mockResponse({ message: "Invoices generated for 35 students." });

export const getStudentInvoices = async (_studentId: string) =>
  mockResponse([MOCK_INVOICE]);

// Returns all invoices for a term, optionally filtered by class name.
export const getInvoiceList = async (
  _termId: string,
  className?: string
): Promise<Invoice[]> => {
  const results = className
    ? MOCK_INVOICES.filter((inv) => inv.className === className)
    : MOCK_INVOICES;
  return mockResponse(results);
};

export const getChildFees = async (_studentId: string, _termId: string) =>
  mockResponse(MOCK_INVOICE);

export const initiateFeesPayment = async (_payload: {
  invoiceId: string;
  feeTypeIds: string[];
}): Promise<string> =>
  mockResponse("https://checkout.opay.com/mock-fee-checkout");

export const getPaymentHistory = async (_params?: {
  studentId?: string;
  page?: number;
  limit?: number;
}) => mockResponse({ data: MOCK_PAYMENTS, total: MOCK_PAYMENTS.length });

export const getBursarSummary = async (_termId: string) =>
  mockResponse(MOCK_BURSAR_SUMMARY);

export const getDefaulters = async (_termId: string) =>
  mockResponse([
    {
      studentId: "std-001",
      studentName: "David Okafor",
      className: "Primary 1A",
      amountOwed: 75000,
      lastPaymentDate: null,
    },
    {
      studentId: "std-003",
      studentName: "Emeka Nwachukwu",
      className: "Primary 1A",
      amountOwed: 50000,
      lastPaymentDate: "2025-01-10",
    },
  ]);

export const snoozeReminder = async (_invoiceId: string) =>
  mockResponse({ message: "Reminder snoozed for 24 hours." });
