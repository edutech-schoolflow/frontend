import { z } from "zod";
import { apiGet, apiPostForm } from "./client";

// ── validation (Zod) ──────────────────────────────────────────────────────────

const elevenDigits = z
  .string()
  .trim()
  .regex(/^\d{11}$/, "Must be exactly 11 digits");

export const SCHOOL_TYPES = [
  "nursery",
  "primary",
  "secondary",
  "combined",
] as const;

/** The fields the backend KYC submission accepts (the CAC file is attached separately). */
export const kycSchema = z.object({
  // School profile
  name: z.string().trim().min(2, "School name is required"),
  type: z.enum(SCHOOL_TYPES, { message: "Select a school type" }),
  address: z.string().trim().min(3, "Address is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  phone: z
    .string()
    .trim()
    .regex(/^(\+?234|0)\d{10}$/, "Enter a valid Nigerian phone number"),
  email: z.email("Enter a valid email"),

  // School location (proof of address) — captured via GPS or a Google Maps link.
  latitude: z.number({ message: "Capture your school's location" }),
  longitude: z.number({ message: "Capture your school's location" }),

  // Proprietor identity (verified digitally via NIN + BVN)
  proprietorFirstName: z.string().trim().min(2, "First name is required"),
  proprietorMiddleName: z.string().trim().optional(),
  proprietorLastName: z.string().trim().min(2, "Last name is required"),
  proprietorNin: elevenDigits,
  proprietorBvn: elevenDigits,

  // Business registration (CAC) — the certificate is attached separately.
  businessName: z.string().trim().min(2, "Business name is required"),

  // Settlement bank account
  bankName: z.string().trim().min(2, "Bank name is required"),
  accountNumber: z
    .string()
    .trim()
    .regex(/^\d{10}$/, "Account number must be 10 digits"),
  accountName: z.string().trim().min(2, "Account name is required"),
});

export type KycInput = z.infer<typeof kycSchema>;

// ── backend response shapes ─────────────────────────────────────────────────

export type KycStatus =
  | "not_submitted"
  | "under_review"
  | "approved"
  | "rejected";

/**
 * KYC status as returned by the backend — status metadata only. The submitted details
 * (proprietor, NIN/BVN, bank account, documents) are intentionally NOT returned.
 */
export interface KycSubmission {
  status: KycStatus;
  submittedAt?: string | null;
  reviewedAt?: string | null;
  schoolMessage?: string | null;
  // School identity captured at creation — prefilled and locked in the KYC form.
  schoolName?: string | null;
  schoolType?: string | null;
  schoolState?: string | null;
  // Proprietor name from the owning identity — prefilled and locked in the KYC form.
  proprietorFirstName?: string | null;
  proprietorMiddleName?: string | null;
  proprietorLastName?: string | null;
}

// ── requests ──────────────────────────────────────────────────────────────────

export async function getKycStatus(): Promise<KycSubmission> {
  const { data } = await apiGet<KycSubmission>("/school/kyc");
  return data;
}

/** Submits KYC as multipart/form-data (the CAC document is `registrationCert`). */
export async function submitKyc(
  input: KycInput,
  registrationCert: File
): Promise<KycSubmission> {
  const form = new FormData();
  form.append("name", input.name);
  form.append("type", input.type);
  form.append("address", input.address);
  form.append("city", input.city);
  form.append("state", input.state);
  form.append("phone", input.phone);
  form.append("email", input.email);
  form.append("latitude", String(input.latitude));
  form.append("longitude", String(input.longitude));
  form.append("businessName", input.businessName);
  form.append("proprietorFirstName", input.proprietorFirstName);
  if (input.proprietorMiddleName) {
    form.append("proprietorMiddleName", input.proprietorMiddleName);
  }
  form.append("proprietorLastName", input.proprietorLastName);
  form.append("proprietorNin", input.proprietorNin);
  form.append("proprietorBvn", input.proprietorBvn);
  form.append("bankName", input.bankName);
  form.append("accountNumber", input.accountNumber);
  form.append("accountName", input.accountName);
  form.append("registrationCert", registrationCert);

  const { data } = await apiPostForm<KycSubmission>("/school/kyc", form);
  return data;
}
