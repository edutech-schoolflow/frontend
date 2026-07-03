"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useInviteStaff } from "@/src/lib/api/useStaffInvite";
import {
  inviteStaffSchema,
  EMPLOYMENT_TYPES,
  EMPLOYMENT_LABELS,
} from "@/src/lib/api/staffInvite";
import type { Staff, StaffRole } from "@/src/types/staff";
import { ROLE_LABELS, INVITABLE_ROLES } from "@/src/types/staff";

interface Props {
  onDone: (staff: Staff) => void;
  onClose: () => void;
}

const inputCls =
  "w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading outline-none focus:border-brand-green";
const labelCls = "mb-1 block text-[13px] font-medium text-text-body";

export default function InviteStaffModal({ onDone, onClose }: Props) {
  const invite = useInviteStaff();

  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("teacher");
  const [employmentType, setEmploymentType] =
    useState<(typeof EMPLOYMENT_TYPES)[number]>("full_time");
  const [position, setPosition] = useState("");

  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleSave() {
    const parsed = inviteStaffSchema.safeParse({
      firstName,
      middleName,
      lastName,
      phone,
      role,
      employmentType,
      position,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    try {
      const result = await invite.mutateAsync(parsed.data);
      setInviteLink(result.inviteLink);
      // Optimistic pending entry (no staff-list endpoint yet) so the directory updates.
      onDone({
        id: `pending-${Date.now()}`,
        schoolId: "",
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        email: "",
        phone: parsed.data.phone,
        role: parsed.data.role,
        position: parsed.data.position ?? "",
        status: "pending",
        employmentType: parsed.data.employmentType,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not send invite."
      );
    }
  }

  async function copyLink() {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Success state ──────────────────────────────────────────────────────────
  if (inviteLink) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
        <div className="w-full max-w-[480px] rounded-[16px] bg-white p-6 shadow-xl">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-[16px] font-semibold text-text-heading">
              Invitation sent
            </h2>
            <button
              onClick={onClose}
              className="text-[#9ca3af] hover:text-text-heading"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="mb-4 rounded-[10px] bg-[#f0fdf4] px-4 py-3">
            <p className="text-[13px] text-[#15803d]">
              We sent the invite link by SMS to{" "}
              <span className="font-semibold">{phone}</span>. They&apos;ll use
              it to set up their account.
            </p>
          </div>

          <p className="mb-2 text-[12px] font-medium text-text-body">
            Invite link — share directly if the SMS doesn&apos;t arrive
          </p>
          <div className="flex items-center gap-2 rounded-[8px] border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2">
            <p className="flex-1 truncate text-[12px] text-text-heading">
              {inviteLink}
            </p>
            <button
              onClick={copyLink}
              className="shrink-0 text-[#9ca3af] transition-colors hover:text-brand-green"
            >
              {copied ? (
                <Check className="h-[15px] w-[15px] text-brand-green" />
              ) : (
                <Copy className="h-[15px] w-[15px]" />
              )}
            </button>
          </div>

          <p className="mt-3 text-[11px] text-[#9ca3af]">
            This link is unique to {firstName}. Do not share it with anyone
            else.
          </p>

          <button
            onClick={onClose}
            className="mt-5 w-full rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ── Form state ─────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[480px] rounded-[16px] bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-text-heading">
            Invite staff member
          </h2>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-text-heading"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>First name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Amaka"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Last name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Adeyemi"
                className={inputCls}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>Middle name (optional)</label>
            <input
              value={middleName}
              onChange={(e) => setMiddleName(e.target.value)}
              placeholder="e.g. Ngozi"
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Phone number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
              placeholder="e.g. 08012345678"
              className={inputCls}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className={`${inputCls} bg-white`}
              >
                {INVITABLE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Employment type</label>
              <select
                value={employmentType}
                onChange={(e) =>
                  setEmploymentType(
                    e.target.value as (typeof EMPLOYMENT_TYPES)[number]
                  )
                }
                className={`${inputCls} bg-white`}
              >
                {EMPLOYMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {EMPLOYMENT_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className={labelCls}>Position / title (optional)</label>
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="e.g. Class Teacher"
              className={inputCls}
            />
          </div>
        </div>

        <p className="mt-4 text-[12px] text-[#9ca3af]">
          We&apos;ll text them an invite link to set up their account.
        </p>

        <div className="mt-5 flex gap-3">
          <button
            onClick={onClose}
            className="rounded-[8px] border border-[#e5e7eb] px-5 py-2.5 text-[13px] text-text-body hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={invite.isPending}
            className="flex-1 rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            {invite.isPending ? "Sending…" : "Send invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
