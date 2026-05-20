import { z } from "zod";

export const schoolInfoSchema = z.object({
  schoolName: z.string().min(2, "School name must be at least 2 characters"),
  schoolType: z.enum(["nursery", "primary", "secondary", "combined"]),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(1, "State is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
  email: z.string().email("Enter a valid school email address"),
});

export const adminAccountSchema = z
  .object({
    adminName: z.string().min(2, "Full name is required"),
    position: z.string().min(2, "Position/title is required"),
    adminEmail: z.string().email("Enter a valid email address"),
    adminPhone: z.string().min(10, "Enter a valid phone number"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const subdomainSchema = z.object({
  subdomain: z
    .string()
    .min(3, "Subdomain must be at least 3 characters")
    .max(30, "Subdomain must be 30 characters or fewer")
    .regex(
      /^[a-z0-9-]+$/,
      "Only lowercase letters, numbers, and hyphens are allowed"
    )
    .refine((v) => !v.startsWith("-") && !v.endsWith("-"), {
      message: "Subdomain cannot start or end with a hyphen",
    }),
});

export type SchoolInfoValues = z.infer<typeof schoolInfoSchema>;
export type AdminAccountValues = z.infer<typeof adminAccountSchema>;
export type SubdomainValues = z.infer<typeof subdomainSchema>;
