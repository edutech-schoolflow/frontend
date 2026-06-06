import { mockResponse } from "./mockClient";
import {
  MOCK_APPLICATIONS,
  MOCK_PARENT_APPLICATIONS,
  MOCK_APPLICATION_PAYMENT_DETAILS,
} from "./mock/data";
import type {
  Application,
  ApplicationPaymentDetails,
} from "@/src/types/application";

export const submitApplication = async (
  _payload: FormData
): Promise<Application> =>
  mockResponse({
    ...MOCK_APPLICATIONS[0],
    id: "app-new",
    referenceNumber: "GFA-2025-002",
    status: "under_review" as const,
  });

export const getMyApplications = async (): Promise<Application[]> =>
  mockResponse(MOCK_PARENT_APPLICATIONS);

export const getApplication = async (_id: string): Promise<Application> =>
  mockResponse(MOCK_APPLICATIONS[0]);

export const getApplicationPaymentDetails = async (
  _applicationId: string
): Promise<ApplicationPaymentDetails> =>
  mockResponse(MOCK_APPLICATION_PAYMENT_DETAILS);

export const initiateApplicationFeePayment = async (
  _applicationId: string
): Promise<string> =>
  mockResponse("https://checkout.opay.com/mock-checkout-url");

// School-side
export const getSchoolApplications = async (_params?: {
  status?: string;
  classId?: string;
  page?: number;
  limit?: number;
}) =>
  mockResponse({ data: MOCK_APPLICATIONS, total: MOCK_APPLICATIONS.length });

export const getSchoolApplication = async (_id: string): Promise<Application> =>
  mockResponse(MOCK_APPLICATIONS[0]);

export const scheduleExam = async (_id: string, _payload: unknown) =>
  mockResponse({ message: "Exam scheduled. Parent notified via WhatsApp." });

export const admitApplication = async (_id: string) =>
  mockResponse({ message: "Application admitted. Parent notified." });

export const rejectApplication = async (_id: string, _reason?: string) =>
  mockResponse({ message: "Application rejected. Parent notified." });

export const recordAssessment = async (_id: string, _payload: unknown) =>
  mockResponse({ message: "Assessment recorded." });
