import { mockResponse } from "./mockClient";
import {
  MOCK_FEE_TYPES,
  MOCK_INVOICE,
  MOCK_PAYMENTS,
  MOCK_BURSAR_SUMMARY,
  MOCK_PARENT_FEE_SUMMARIES,
  MOCK_PARENT_FEE_INVOICES,
} from "./mock/data";
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
): Promise<FeeType> =>
  mockResponse({
    ...payload,
    id: `ft-${Date.now()}`,
    schoolId: "sch-001",
    createdAt: new Date().toISOString(),
  });

export const updateFeeType = async (
  _id: string,
  payload: Partial<FeeType>
): Promise<FeeType> => mockResponse({ ...MOCK_FEE_TYPES[0], ...payload });

export const deleteFeeType = async (_id: string) =>
  mockResponse({ message: "Fee type deleted." });

export const generateInvoices = async (_classId: string, _termId: string) =>
  mockResponse({ message: "Invoices generated for 35 students." });

export const getStudentInvoices = async (_studentId: string) =>
  mockResponse([MOCK_INVOICE]);

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
