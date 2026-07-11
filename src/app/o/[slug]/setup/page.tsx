"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useWorkspace } from "@/src/context/WorkspaceContext";
import { setupOrganization } from "@/src/lib/api/organizations";

// Organization Wizard (FE-001 Phase 2). Names a bootstrapped org — the backend re-slugs from the
// name, so on success we route to the NEW /o/{slug}. Owner-only, and skipped once already named.

const SCHOOL_TYPES = [
  { value: "nursery", label: "Nursery" },
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary" },
  { value: "combined", label: "Combined (Nursery – Secondary)" },
] as const;

const schema = z.object({
  name: z.string().trim().min(2, "Enter your school's name"),
  type: z.enum(["nursery", "primary", "secondary", "combined"], {
    message: "Choose the kind of school",
  }),
  state: z.string().trim().optional(),
});
type FormValues = z.infer<typeof schema>;

export default function OrganizationWizardPage() {
  const router = useRouter();
  const ws = useWorkspace();

  // Guard: only the owner sets up, and only while the org is still unnamed.
  const canSetUp = ws.myContext.type === "owner" && ws.name == null;
  useEffect(() => {
    if (!canSetUp) router.replace(`/o/${ws.slug}`);
  }, [canSetUp, ws.slug, router]);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", type: undefined, state: "" },
  });
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;

  async function onSubmit(values: FormValues) {
    try {
      const workspace = await setupOrganization(ws.slug, values);
      toast.success("School set up.");
      // Naming re-slugs — go to the new URL (replace so the placeholder slug leaves history).
      router.replace(`/o/${workspace.slug}`);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't save. Please try again."
      );
    }
  }

  if (!canSetUp) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-6 py-12">
      <div className="w-full max-w-[480px] rounded-[14px] border border-[#e5e7eb] bg-white p-8 shadow-sm">
        <h1 className="text-[22px] font-semibold text-[#1b1b1b]">
          Set up your school
        </h1>
        <p className="mt-1.5 text-[15px] text-[#666]">
          A few details to open your workspace to staff and parents. You can
          refine everything later.
        </p>

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
                <option key={t.value} value={t.value}>
                  {t.label}
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
            {isSubmitting ? "Setting up…" : "Create school"}
          </button>
        </form>
      </div>
    </div>
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
