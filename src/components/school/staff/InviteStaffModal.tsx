"use client";

import { useState } from "react";
import { X, Copy, Check } from "lucide-react";
import { inviteStaff } from "@/src/lib/api/staff";
import type { Staff, StaffRole } from "@/src/types/staff";
import { ROLE_LABELS, INVITABLE_ROLES } from "@/src/types/staff";

interface Props {
  onDone: (staff: Staff) => void;
  onClose: () => void;
}

export default function InviteStaffModal({ onDone, onClose }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<StaffRole>("teacher");
  const [position, setPosition] = useState("");
  const [saving, setSaving] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [savedStaff, setSavedStaff] = useState<Staff | null>(null);
  const [copied, setCopied] = useState(false);

  const canSave =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    phone.trim() &&
    position.trim();

  async function handleSave() {
    if (!canSave) return;
    setSaving(true);
    const result = await inviteStaff({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      position: position.trim(),
    });
    setSaving(false);
    setSavedStaff(result.staff);
    setInviteLink(result.inviteLink);
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
              onClick={() => {
                if (savedStaff) onDone(savedStaff);
                onClose();
              }}
              className="text-[#9ca3af] hover:text-text-heading"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          <div className="mb-4 rounded-[10px] bg-[#f0fdf4] px-4 py-3">
            <p className="text-[13px] text-[#15803d]">
              An email has been sent to{" "}
              <span className="font-semibold">{email}</span>. They will use the
              link below to set up their account.
            </p>
          </div>

          <p className="mb-2 text-[12px] font-medium text-text-body">
            Invite link — share directly if email doesn&apos;t arrive
          </p>
          <div className="flex items-center gap-2 rounded-[8px] border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2">
            <p className="flex-1 truncate text-[12px] text-text-heading">
              {inviteLink}
            </p>
            <button
              onClick={copyLink}
              className="shrink-0 text-[#9ca3af] hover:text-brand-green transition-colors"
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
            onClick={() => {
              if (savedStaff) onDone(savedStaff);
              onClose();
            }}
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
              <label className="mb-1 block text-[13px] font-medium text-text-body">
                First name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Amaka"
                className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading outline-none focus:border-brand-green"
              />
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-text-body">
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Adeyemi"
                className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading outline-none focus:border-brand-green"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-text-body">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. amaka@example.com"
              className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading outline-none focus:border-brand-green"
            />
          </div>

          <div>
            <label className="mb-1 block text-[13px] font-medium text-text-body">
              Phone number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +234 801 234 5678"
              className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading outline-none focus:border-brand-green"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[13px] font-medium text-text-body">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as StaffRole)}
                className="w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-text-heading outline-none focus:border-brand-green"
              >
                {INVITABLE_ROLES.map((r) => (
                  <option key={r} value={r}>
                    {ROLE_LABELS[r]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[13px] font-medium text-text-body">
                Position / title
              </label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Class Teacher"
                className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] text-text-heading outline-none focus:border-brand-green"
              />
            </div>
          </div>
        </div>

        <p className="mt-4 text-[12px] text-[#9ca3af]">
          An invitation will be sent to their email. They can accept and set up
          their account from there.
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
            disabled={!canSave || saving}
            className="flex-1 rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
          >
            {saving ? "Sending…" : "Send invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}
