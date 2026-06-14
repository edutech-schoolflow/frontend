import { mockResponse } from "./mockClient";
import { MOCK_STAFF, MOCK_INVITE_TOKENS, MOCK_SCHOOL } from "./mock/schoolData";
import { ROLE_LABELS } from "@/src/types/staff";

export interface InviteDetails {
  staffId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneMasked: string;
  role: string;
  position: string;
  schoolName: string;
}

function maskPhone(phone: string): string {
  const clean = phone.replace(/\s/g, "");
  if (clean.length <= 6) return phone;
  // Keep country prefix (first 7 chars) + last 4, mask the middle
  const prefix = clean.slice(0, 7);
  const suffix = clean.slice(-4);
  return `${prefix} ****${suffix}`;
}

// Validates a token from the invite link. Returns invite details or null if
// the token is invalid.
export const validateInviteToken = async (
  token: string
): Promise<InviteDetails | null> => {
  const record = MOCK_INVITE_TOKENS[token];
  if (!record) return mockResponse(null);

  const staff = MOCK_STAFF.find((s) => s.id === record.staffId);
  if (!staff || staff.status !== "pending") return mockResponse(null);

  return mockResponse({
    staffId: staff.id,
    firstName: staff.firstName,
    lastName: staff.lastName,
    email: staff.email,
    phoneMasked: maskPhone(staff.phone),
    role: ROLE_LABELS[staff.role] ?? staff.role,
    position: staff.position,
    schoolName: MOCK_SCHOOL.name,
  });
};

// In-memory OTP store — mock only. Always accepts "123456".
const OTP_STORE: Record<string, string> = {};
const MOCK_OTP = "123456";

export const sendOTP = async (staffId: string): Promise<void> => {
  OTP_STORE[staffId] = MOCK_OTP;
  return mockResponse(undefined);
};

export const verifyOTP = async (
  staffId: string,
  otp: string
): Promise<boolean> => {
  return mockResponse(otp === MOCK_OTP || OTP_STORE[staffId] === otp);
};

// Creates the user account, marks staff active, removes the token.
export const completeRegistration = async (
  token: string,
  _password: string
): Promise<{ userId: string }> => {
  const record = MOCK_INVITE_TOKENS[token];
  if (!record) throw new Error("Invalid token");

  const idx = MOCK_STAFF.findIndex((s) => s.id === record.staffId);
  if (idx < 0) throw new Error("Staff not found");

  const userId = `usr-${Date.now()}`;
  MOCK_STAFF[idx] = {
    ...MOCK_STAFF[idx],
    status: "active",
    userId,
    inviteToken: undefined,
  };

  delete MOCK_INVITE_TOKENS[token];
  return mockResponse({ userId });
};
