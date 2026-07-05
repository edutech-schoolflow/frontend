import { z } from "zod";
import { apiGet, apiPost } from "./client";
import type { ParentUser } from "@/src/lib/store/parentAuthSlice";

/** Backend ErrorCodes.PhoneNotVerified — login rejected because the phone isn't verified yet. */
export const ERR_PHONE_NOT_VERIFIED = 1104;

// ── validation (Zod) ──────────────────────────────────────────────────────────

const phone = z
  .string()
  .trim()
  .regex(/^(\+?234|0)\d{10}$/, "Enter a valid Nigerian phone number");

const otp = z.string().trim().regex(/^\d{6}$/, "Enter the 6-digit code");

export const parentLoginSchema = z.object({
  phone,
  password: z.string().min(1, "Password is required"),
});

export const parentRegisterSchema = z
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

export const parentVerifyPhoneSchema = z.object({ phone, code: otp });
export const parentForgotPasswordSchema = z.object({ phone });
export const parentResetPasswordSchema = z
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

export const paymentPinSchema = z
  .object({
    pin: z.string().regex(/^\d{6}$/, "Enter a 6-digit PIN"),
    confirmPin: z.string().min(1, "Confirm your PIN"),
  })
  .refine((d) => d.pin === d.confirmPin, {
    message: "PINs do not match",
    path: ["confirmPin"],
  });

export type ParentLoginInput = z.infer<typeof parentLoginSchema>;
export type ParentRegisterInput = z.infer<typeof parentRegisterSchema>;
export type ParentVerifyPhoneInput = z.infer<typeof parentVerifyPhoneSchema>;

// ── backend response shapes ─────────────────────────────────────────────────

interface LoginResponse {
  accessTokenExpiresAt: string;
}

interface ParentMeResponse {
  fullName: string;
  phone: string;
  email?: string | null;
  phoneVerified: boolean;
  hasPaymentPin: boolean;
}

// ── requests ──────────────────────────────────────────────────────────────────

// Each mutating call returns the backend's own message, so the UI always shows what the server said.

export async function registerParent(input: ParentRegisterInput): Promise<string> {
  const { message } = await apiPost<null>("/parent/auth/register", {
    firstName: input.firstName,
    middleName: input.middleName ? input.middleName : null,
    lastName: input.lastName,
    phone: input.phone,
    password: input.password,
    email: input.email ? input.email : null,
  });
  return message;
}

export async function verifyParentPhone(input: ParentVerifyPhoneInput): Promise<string> {
  const { message } = await apiPost<null>("/parent/auth/verify-phone", input);
  return message;
}

export async function loginParent(input: ParentLoginInput): Promise<string> {
  const { message } = await apiPost<LoginResponse>("/parent/auth/login", {
    phone: input.phone,
    password: input.password,
  });
  return message;
}

export async function resendParentOtp(phoneValue: string): Promise<string> {
  const { message } = await apiPost<null>("/parent/auth/resend-otp", { phone: phoneValue });
  return message;
}

export async function forgotParentPassword(phoneValue: string): Promise<string> {
  const { message } = await apiPost<null>("/parent/auth/forgot-password", { phone: phoneValue });
  return message;
}

export async function resetParentPassword(input: {
  phone: string;
  code: string;
  newPassword: string;
}): Promise<string> {
  const { message } = await apiPost<null>("/parent/auth/reset-password", input);
  return message;
}

export async function setPaymentPin(pin: string): Promise<string> {
  const { message } = await apiPost<null>("/parent/auth/payment-pin", { pin });
  return message;
}

export async function getParentMe(): Promise<ParentUser> {
  const { data } = await apiGet<ParentMeResponse>("/parent/auth/me");
  return data;
}

export async function logoutParent() {
  await apiPost<null>("/auth/logout");
}
