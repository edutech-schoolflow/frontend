import { z } from "zod";
import { apiGet, apiPost } from "./client";

// ── validation (Zod) ──────────────────────────────────────────────────────────

const phone = z
  .string()
  .trim()
  .regex(/^(\+?234|0)\d{10}$/, "Enter a valid Nigerian phone number");

/** Roles an owner can invite (matches the backend InvitableRoles set). */
export const INVITABLE_ROLE_VALUES = [
  "teacher",
  "school_admin",
  "principal",
  "vice_principal",
  "bursar",
  "registrar",
] as const;

export const EMPLOYMENT_TYPES = ["full_time", "part_time"] as const;

export const EMPLOYMENT_LABELS: Record<
  (typeof EMPLOYMENT_TYPES)[number],
  string
> = {
  full_time: "Full-time",
  part_time: "Part-time",
};

export const inviteStaffSchema = z.object({
  firstName: z.string().trim().min(2, "First name is required"),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(2, "Last name is required"),
  phone,
  role: z.enum(INVITABLE_ROLE_VALUES, { message: "Select a role" }),
  employmentType: z.enum(EMPLOYMENT_TYPES, {
    message: "Select an employment type",
  }),
  position: z.string().trim().optional(),
});

export type InviteStaffInput = z.infer<typeof inviteStaffSchema>;

// ── owner: invite a staff member ──────────────────────────────────────────────

export interface InviteStaffResult {
  inviteLink: string;
  expiresAt: string;
}

export async function inviteStaff(
  input: InviteStaffInput
): Promise<InviteStaffResult> {
  const { data } = await apiPost<InviteStaffResult>("/school/staff/invite", {
    firstName: input.firstName,
    middleName: input.middleName ? input.middleName : null,
    lastName: input.lastName,
    phone: input.phone,
    role: input.role,
    employmentType: input.employmentType,
    position: input.position ? input.position : null,
  });
  return data;
}

// ── staff: accept an invite ───────────────────────────────────────────────────

export interface InviteDetails {
  firstName?: string | null;
  lastName?: string | null;
  schoolName?: string | null;
  role: string;
  employmentType: string;
  expiresAt: string;
  /** True if the invited phone already has a staff account (sign in to accept instead). */
  hasAccount: boolean;
}

export async function validateInvite(token: string): Promise<InviteDetails> {
  const { data } = await apiGet<InviteDetails>(
    `/staff/invite/validate?token=${encodeURIComponent(token)}`
  );
  return data;
}

export async function sendInviteOtp(token: string): Promise<void> {
  await apiPost<null>("/staff/invite/send-otp", { token });
}

/** New account: verifies the OTP and sets the password in one call; logs the staff in (cookies). */
export async function acceptInvite(input: {
  token: string;
  password: string;
  code: string;
}): Promise<void> {
  await apiPost<{ accessTokenExpiresAt: string }>(
    "/staff/invite/accept",
    input
  );
}
