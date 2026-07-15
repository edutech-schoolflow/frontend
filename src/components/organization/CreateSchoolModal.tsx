"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import OrganizationDetailsForm, {
  type OrganizationDetailsValues,
} from "@/src/components/organization/OrganizationDetailsForm";
import { createOrganization } from "@/src/lib/api/identityAuth";

/**
 * Form-first school creation (FE-001) — no route, no ghost. The org is created only on submit, already
 * named, so abandoning this modal writes nothing. On success the owner context is live and we land in
 * the new /o/{slug} workspace. Reuses the same form the legacy-draft setup page uses.
 */
export default function CreateSchoolModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function onSubmit(values: OrganizationDetailsValues) {
    try {
      const { message, slug } = await createOrganization(values);
      toast.success(message);
      router.replace(slug ? `/o/${slug}` : "/select-context");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Couldn't create your school."
      );
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-[16px]"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-[460px] rounded-[16px] bg-white p-[28px] shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[20px] font-semibold text-[#1b1b1b]">
              Create your school
            </h2>
            <p className="mt-1.5 text-[14px] text-[#666]">
              A few details to open your workspace. You can refine everything
              later.
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[8px] text-[#666] transition-colors hover:bg-[#f5f5f5]"
            aria-label="Close"
          >
            <X size={17} />
          </button>
        </div>

        <OrganizationDetailsForm
          onSubmit={onSubmit}
          submitLabel="Create school"
          submittingLabel="Creating…"
        />
      </div>
    </div>
  );
}
