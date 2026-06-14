import { mockResponse } from "./mockClient";
import { MOCK_APPLICATIONS } from "./mock/schoolData";
import {
  MOCK_PARENT_APPLICATIONS,
  MOCK_APPLICATION_PAYMENT_DETAILS,
} from "./mock/parentData";
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

export const getApplication = async (
  id: string
): Promise<Application | undefined> =>
  mockResponse(MOCK_PARENT_APPLICATIONS.find((a) => a.id === id));

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

export const admitApplication = async (id: string): Promise<Application> => {
  const idx = MOCK_APPLICATIONS.findIndex((a) => a.id === id);
  if (idx >= 0) {
    const admissionNumber = MOCK_APPLICATIONS[idx].referenceNumber.replace(
      /-/g,
      "/"
    );
    MOCK_APPLICATIONS[idx] = {
      ...MOCK_APPLICATIONS[idx],
      status: "admitted",
      admissionNumber,
      updatedAt: new Date().toISOString(),
    };
    return mockResponse(MOCK_APPLICATIONS[idx]);
  }
  return mockResponse({ ...MOCK_APPLICATIONS[0], status: "admitted" });
};

export const rejectApplication = async (_id: string, _reason?: string) =>
  mockResponse({ message: "Application rejected. Parent notified." });

export const recordAssessment = async (_id: string, _payload: unknown) =>
  mockResponse({ message: "Assessment recorded." });
