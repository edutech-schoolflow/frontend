"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { SCHOOL_TYPES } from "@/src/lib/api/schoolKyc";

// Shared school-details form (name / type / state). Used both to CREATE a school (form-first, before
// any org exists) and to name a legacy bootstrapped org. The parent decides what happens on submit.

// Values come from the single source of truth (schoolKyc.SCHOOL_TYPES); only the display labels live here.
const SCHOOL_TYPE_LABELS: Record<(typeof SCHOOL_TYPES)[number], string> = {
  nursery: "Nursery",
  primary: "Primary",
  secondary: "Secondary",
  combined: "Combined (Nursery – Secondary)",
};

const schema = z.object({
  name: z.string().trim().min(2, "Enter your school's name"),
  type: z.enum(SCHOOL_TYPES, { message: "Choose the kind of school" }),
  state: z.string().trim().optional(),
});
export type OrganizationDetailsValues = z.infer<typeof schema>;

export default function OrganizationDetailsForm({
  onSubmit,
  submitLabel,
  submittingLabel,
}: {
  onSubmit: (values: OrganizationDetailsValues) => Promise<void>;
  submitLabel: string;
  submittingLabel: string;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrganizationDetailsValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", type: undefined, state: "" },
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mt-6 flex flex-col gap-5"
    >
      <Field label="School name" error={errors.name?.message}>
        <input
          {...register("name")}
          autoFocus
          placeholder="e.g. Divine Wisdom Citadel School"
          className={inputClass(!!errors.name)}
        />
      </Field>

      <Field label="Type of school" error={errors.type?.message}>
        <select
          {...register("type")}
          defaultValue=""
          className={inputClass(!!errors.type)}
        >
          <option value="" disabled>
            Select…
          </option>
          {SCHOOL_TYPES.map((t) => (
            <option key={t} value={t}>
              {SCHOOL_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </Field>

      <Field label="State" hint="Optional" error={errors.state?.message}>
        <input
          {...register("state")}
          placeholder="e.g. Lagos"
          className={inputClass(false)}
        />
      </Field>

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-[10px] bg-brand-green px-5 py-3 text-[14px] font-medium text-white transition-colors hover:bg-brand-green/90 disabled:opacity-60"
      >
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? submittingLabel : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[13px] font-medium text-[#1b1b1b]">
        {label}
        {hint && (
          <span className="ml-1.5 font-normal text-[#9ca3af]">{hint}</span>
        )}
      </span>
      {children}
      {error && <span className="text-[12px] text-[#dc2626]">{error}</span>}
    </label>
  );
}

function inputClass(hasError: boolean): string {
  return `h-11 rounded-[10px] border px-3.5 text-[14px] text-[#1b1b1b] outline-none transition-colors focus:border-brand-green ${
    hasError ? "border-[#dc2626]" : "border-[#d1d5db]"
  }`;
}
