import { z } from "zod";
import { apiGet, apiPost } from "./client";
import type { SchoolUser } from "@/src/lib/store/authSlice";

/** Backend ErrorCodes.PhoneNotVerified — login rejected because the phone isn't verified yet. */
export const ERR_PHONE_NOT_VERIFIED = 1104;

// ── validation (Zod) ──────────────────────────────────────────────────────────

// Nigerian phone: 11-digit local (0803…) or +234 / 234 international. The backend
// normalises to E.164; we just keep the entry sane.
const phone = z
  .string()
  .trim()
  .regex(/^(\+?234|0)\d{10}$/, "Enter a valid Nigerian phone number");

const otp = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter the 6-digit code");

export const schoolLoginSchema = z.object({
  phone,
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

export const schoolRegisterSchema = z
  .object({
    firstName: z.string().trim().min(2, "First name is required"),
    middleName: z.string().trim().optional(),
    lastName: z.string().trim().min(2, "Last name is required"),
    phone,
    email: z.union([z.email("Enter a valid email"), z.literal("")]).optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyPhoneSchema = z.object({ phone, code: otp });
export const forgotPasswordSchema = z.object({ phone });
export const resetPasswordSchema = z
  .object({
    phone,
    code: otp,
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SchoolLoginInput = z.infer<typeof schoolLoginSchema>;
export type SchoolRegisterInput = z.infer<typeof schoolRegisterSchema>;
export type VerifyPhoneInput = z.infer<typeof verifyPhoneSchema>;

// ── backend response shapes ─────────────────────────────────────────────────

interface LoginResponse {
  accessTokenExpiresAt: string;
}

interface SchoolOwnerMeResponse {
  fullName: string;
  phone: string;
  email?: string | null;
  phoneVerified: boolean;
  schoolId: string;
  schoolStatus: string;
  kycStatus: string;
  subdomain?: string | null;
}

function toSchoolUser(me: SchoolOwnerMeResponse): SchoolUser {
  return { ...me, isOwner: true };
}

// ── requests ──────────────────────────────────────────────────────────────────

export async function registerSchool(input: SchoolRegisterInput) {
  const { data } = await apiPost<null>("/school/auth/register", {
    firstName: input.firstName,
    middleName: input.middleName ? input.middleName : null,
    lastName: input.lastName,
    phone: input.phone,
    password: input.password,
    email: input.email ? input.email : null,
  });
  return data;
}

export async function verifyPhone(input: VerifyPhoneInput) {
  await apiPost<null>("/school/auth/verify-phone", input);
}

export async function loginSchool(input: SchoolLoginInput) {
  await apiPost<LoginResponse>("/school/auth/login", {
    phone: input.phone,
    password: input.password,
  });
}

export async function resendOtp(phoneValue: string) {
  await apiPost<null>("/school/auth/resend-otp", { phone: phoneValue });
}

export async function forgotPassword(phoneValue: string) {
  await apiPost<null>("/school/auth/forgot-password", { phone: phoneValue });
}

export async function resetPassword(input: {
  phone: string;
  code: string;
  newPassword: string;
}) {
  await apiPost<null>("/school/auth/reset-password", input);
}

export async function getSchoolMe(): Promise<SchoolUser> {
  const { data } = await apiGet<SchoolOwnerMeResponse>("/school/auth/me");
  return toSchoolUser(data);
}

export async function logout() {
  await apiPost<null>("/auth/logout");
}
