"use client";

import { useState } from "react";
import { X } from "lucide-react";
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
    onDone(result);
  }

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
