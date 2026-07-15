"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useWorkspace } from "@/src/context/WorkspaceContext";
import { setupOrganization } from "@/src/lib/api/organizations";
import OrganizationDetailsForm, {
  type OrganizationDetailsValues,
} from "@/src/components/organization/OrganizationDetailsForm";

// Names a legacy/abandoned bootstrapped org — the only path that still needs the "unnamed org exists
// first" model (new schools are created form-first via CreateSchoolModal). Naming re-slugs, so on
// success we route to the NEW /o/{slug}. Owner-only, and skipped once already named.

export default function OrganizationWizardPage() {
  const router = useRouter();
  const ws = useWorkspace();

  // Guard: only the owner sets up, and only while the org is still unnamed.
  const canSetUp = ws.myContext.type === "owner" && ws.name == null;
  useEffect(() => {
    if (!canSetUp) router.replace(`/o/${ws.slug}`);
  }, [canSetUp, ws.slug, router]);

  async function onSubmit(values: OrganizationDetailsValues) {
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

        <OrganizationDetailsForm
          onSubmit={onSubmit}
          submitLabel="Save school"
          submittingLabel="Setting up…"
        />
      </div>
    </div>
  );
}
