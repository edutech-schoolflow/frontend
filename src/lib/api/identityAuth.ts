import { z } from "zod";
import { apiGet, apiPost } from "./client";

// EDD-001 — the ONE registration and ONE login for every person (phone + password).
// Login returns the identity's CONTEXTS (organization relationships); entering one sets the same
// httpOnly portal cookies the dashboards already use, so everything downstream is unchanged.

// ── validation ────────────────────────────────────────────────────────────────

const phoneSchema = z
  .string()
  .trim()
  .regex(/^(\+?234|0)\d{10}$/, "Enter a valid Nigerian phone number");

export const identityLoginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, "Enter your password"),
});
export type IdentityLoginInput = z.infer<typeof identityLoginSchema>;

export const identityRegisterSchema = z.object({
  firstName: z.string().trim().min(1, "Required"),
  middleName: z.string().trim().optional(),
  lastName: z.string().trim().min(1, "Required"),
  phone: phoneSchema,
  email: z.string().trim().email("Enter a valid email").optional().or(z.literal("")),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type IdentityRegisterInput = z.infer<typeof identityRegisterSchema>;

// ── types (mirror UnifiedAuthDtos) ────────────────────────────────────────────

export type AuthContextType = "owner" | "staff" | "parent";

export interface AuthContext {
  /** The relationship row's id — structured, nothing to parse. */
  id: string;
  type: AuthContextType;
  organizationId?: string | null;
  organizationName?: string | null;
  /** URL identity of the workspace — /o/{slug} (FE-001 Phase 2). */
  organizationSlug?: string | null;
  role?: string | null;
}

export interface LoginOutcome {
  contexts: AuthContext[];
  /** The entered context's id, or null when the caller must pick (or has none). */
  selected: string | null;
  message: string;
}

export interface IdentityMe {
  fullName: string;
  phone: string;
  email?: string | null;
  phoneVerified: boolean;
  /** Profile kinds this identity owns (e.g. "parent", "staff") — distinct from contexts. */
  profiles: string[];
  contexts: AuthContext[];
}

/** Where each context type lands after login. */
export function dashboardFor(type: AuthContextType): string {
  switch (type) {
    case "owner":
      return "/school/dashboard";
    case "staff":
      return "/staff/dashboard";
    case "parent":
      return "/parent/dashboard";
  }
}

// ── requests (messages always come from the backend) ──────────────────────────

export async function registerIdentity(input: IdentityRegisterInput): Promise<string> {
  const { message } = await apiPost<null>("/auth/register", {
    firstName: input.firstName,
    middleName: input.middleName || null,
    lastName: input.lastName,
    phone: input.phone,
    email: input.email || null,
    password: input.password,
  });
  return message;
}

export async function verifyIdentityPhone(phone: string, code: string): Promise<string> {
  const { message } = await apiPost<null>("/auth/verify-phone", { phone, code });
  return message;
}

export async function resendIdentityOtp(phone: string): Promise<string> {
  const { message } = await apiPost<null>("/auth/resend-otp", { phone });
  return message;
}

/**
 * One login. One context → auto-entered (portal cookies). Zero or several → an IDENTITY-scope
 * session is set; use selectContext (or the onboarding hub) to proceed.
 */
export async function loginIdentity(input: IdentityLoginInput): Promise<LoginOutcome> {
  const { data, message } = await apiPost<{
    contexts: AuthContext[];
    selected: string | null;
  }>("/auth/login", { phone: input.phone, password: input.password });
  return { contexts: data.contexts, selected: data.selected, message };
}

/** Enters one of the signed-in identity's contexts — the only way a session changes context. */
export async function selectContext(contextId: string): Promise<LoginOutcome> {
  const { data, message } = await apiPost<{
    contexts: AuthContext[];
    selected: string | null;
  }>("/auth/select-context", { contextId });
  return { contexts: data.contexts, selected: data.selected, message };
}

/**
 * Deliberate start of the parent journey (onboarding hub): creates the parent PROFILE (owned by the
 * parent context, not by auth), then the caller selects the returned context to enter the portal.
 */
export async function createParentProfile(): Promise<{ contextId: string; message: string }> {
  const { data, message } = await apiPost<{ contextId: string; type: string }>(
    "/parents/profile",
    {}
  );
  return { contextId: data.contextId, message };
}

export async function forgotIdentityPassword(phone: string): Promise<string> {
  const { message } = await apiPost<null>("/auth/forgot-password", { phone });
  return message;
}

export async function resetIdentityPassword(input: {
  phone: string;
  code: string;
  newPassword: string;
}): Promise<string> {
  const { message } = await apiPost<null>("/auth/reset-password", input);
  return message;
}

/** The signed-in person (any portal cookie) + every context they hold. */
export async function getIdentityMe(): Promise<IdentityMe> {
  const { data } = await apiGet<IdentityMe>("/auth/me");
  return data;
}

/**
 * Organization onboarding (NOT registration): a signed-in, verified identity creates a school and
 * receives the owner context cookies. The account always exists first.
 */
export async function createOrganization(): Promise<string> {
  const { message } = await apiPost<{ contexts: AuthContext[]; selected: string | null }>(
    "/organizations",
    {}
  );
  return message;
}

export async function logoutIdentity(): Promise<void> {
  await apiPost<null>("/auth/logout");
}
