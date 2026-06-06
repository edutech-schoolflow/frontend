import { mockResponse } from "./mockClient";
import { MOCK_PARENTS, MOCK_CHILDREN } from "./mock/schoolData";
import {
  MOCK_CHILD_PROFILES,
  MOCK_PARENT_CHILDREN,
  MOCK_PARENT_ATTENDANCE,
  MOCK_CHILD_MESSAGES,
} from "./mock/parentData";
import type {
  ChildProfile,
  ParentChild,
  AttendanceSummary,
  SchoolMessage,
} from "@/src/types/parent";

export const registerParent = async (data: {
  fullName: string;
  email: string;
  phone: string;
  password: string;
}) => mockResponse({ success: true, email: data.email });

export const loginParent = async (_data: { phone: string; password: string }) =>
  mockResponse({
    id: "parent-001",
    name: "John Okafor",
    phone: _data.phone,
    role: "parent" as const,
  });

export const verifyPhoneOtp = async (data: { phone: string; otp: string }) => {
  if (data.otp !== "123456") throw new Error("Invalid OTP");
  return mockResponse({ success: true });
};

export const resendPhoneOtp = async (_phone: string) =>
  mockResponse({ success: true });

export const getMyProfile = async () => mockResponse(MOCK_PARENTS[0]);

export const getMyChildren = async () => mockResponse(MOCK_CHILDREN);

export const getChildProfiles = async (): Promise<ChildProfile[]> =>
  mockResponse(MOCK_CHILD_PROFILES);

export const getParentChildren = async (): Promise<ParentChild[]> =>
  mockResponse(MOCK_PARENT_CHILDREN);

export const saveChildProfile = async (
  profile: Omit<ChildProfile, "id">
): Promise<ChildProfile> =>
  mockResponse({ ...profile, id: `cp-${Date.now()}` });

export const updateChildProfile = async (
  id: string,
  profile: Omit<ChildProfile, "id">
): Promise<ChildProfile> => mockResponse({ ...profile, id });

export const getSchoolParents = async (_params?: {
  status?: string;
  page?: number;
  limit?: number;
}) => mockResponse({ data: MOCK_PARENTS, total: MOCK_PARENTS.length });

export const searchParentByPhone = async (
  phone: string
): Promise<import("@/src/types/parent").Parent | null> => {
  const found = MOCK_PARENTS.find((p) => p.phone === phone.trim()) ?? null;
  return mockResponse(found);
};

export const inviteNewParent = async (_payload: {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
}) => mockResponse({ message: "Invitation sent via WhatsApp." });

export const forgotPassword = async (_phone: string) =>
  mockResponse({ success: true });

export const verifyForgotPasswordOtp = async (data: {
  phone: string;
  otp: string;
}) => {
  if (data.otp !== "123456") throw new Error("Invalid OTP");
  return mockResponse({ success: true });
};

export const resetPassword = async (_data: {
  token: string;
  password: string;
}) => mockResponse({ success: true });

export const getChildAttendance = async (
  studentId: string
): Promise<AttendanceSummary[]> =>
  mockResponse(MOCK_PARENT_ATTENDANCE[studentId] ?? []);

export const getChildMessages = async (
  studentId: string
): Promise<SchoolMessage[]> =>
  mockResponse(MOCK_CHILD_MESSAGES[studentId] ?? []);
