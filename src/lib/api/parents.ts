import { mockResponse } from "./mockClient";
import { MOCK_PARENTS, MOCK_CHILDREN } from "./mock/data";

export const registerParent = async (data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) => mockResponse({ success: true, email: data.email });

export const loginParent = async (_data: { email: string; password: string }) =>
  mockResponse({
    id: "parent-001",
    name: "Ojo Williams",
    email: _data.email,
    role: "parent" as const,
  });

export const verifyEmailOtp = async (_data: { email: string; otp: string }) =>
  mockResponse({ success: true });

export const resendVerificationEmail = async (_email: string) =>
  mockResponse({ success: true });

export const getMyProfile = async () => mockResponse(MOCK_PARENTS[0]);

export const getMyChildren = async () => mockResponse(MOCK_CHILDREN);

export const getSchoolParents = async (_params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => mockResponse({ data: MOCK_PARENTS, total: MOCK_PARENTS.length });
