"use client";

import { useState } from "react";
import {
  X,
  Mail,
  Phone,
  CalendarDays,
  BookOpen,
  Pencil,
  Check,
} from "lucide-react";
import {
  deactivateStaff,
  reactivateStaff,
  resendInvite,
  updateStaffRole,
} from "@/src/lib/api/staff";
import type { Staff, StaffRole } from "@/src/types/staff";
import { ROLE_LABELS, INVITABLE_ROLES } from "@/src/types/staff";

const ROLE_COLORS: Record<StaffRole, { text: string; bg: string }> = {
  super_admin: { text: "text-[#7c3aed]", bg: "bg-[#f5f3ff]" },
  school_admin: { text: "text-[#7c3aed]", bg: "bg-[#f5f3ff]" },
  principal: { text: "text-[#0369a1]", bg: "bg-[#e0f2fe]" },
  vice_principal: { text: "text-[#0369a1]", bg: "bg-[#e0f2fe]" },
  teacher: { text: "text-[#2563eb]", bg: "bg-[#eff6ff]" },
  bursar: { text: "text-[#b45309]", bg: "bg-[#fffbeb]" },
  registrar: { text: "text-[#374151]", bg: "bg-[#f3f4f6]" },
};

const AVATAR_BG: Record<StaffRole, string> = {
  super_admin: "bg-[#7c3aed]",
  school_admin: "bg-[#7c3aed]",
  principal: "bg-[#0369a1]",
  vice_principal: "bg-[#0369a1]",
  teacher: "bg-brand-green",
  bursar: "bg-[#b45309]",
  registrar: "bg-[#6b7280]",
};

const STATUS_CONFIG = {
  active: {
    label: "Active",
    cls: "bg-[#f0fdf4] text-[#16a34a] border-[#bbf7d0]",
  },
  pending: {
    label: "Invite pending",
    cls: "bg-[#fffbeb] text-[#b45309] border-[#fde68a]",
  },
  inactive: {
    label: "Inactive",
    cls: "bg-[#f9fafb] text-[#6b7280] border-[#e5e7eb]",
  },
};

interface Props {
  staff: Staff;
  assignedArms: string[];
  onUpdate: (updated: Staff) => void;
  onClose: () => void;
}

export default function StaffDetailModal({
  staff,
  assignedArms,
  onUpdate,
  onClose,
}: Props) {
  const [acting, setActing] = useState<
    "deactivate" | "reactivate" | "resend" | null
  >(null);
  const [resent, setResent] = useState(false);
  const [editingRole, setEditingRole] = useState(false);
  const [draftRole, setDraftRole] = useState<StaffRole>(staff.role);
  const [draftPosition, setDraftPosition] = useState(staff.position);
  const [savingRole, setSavingRole] = useState(false);

  const initials = `${staff.firstName[0]}${staff.lastName[0]}`.toUpperCase();
  const { text: roleText, bg: roleBg } = ROLE_COLORS[staff.role];
  const { label: statusLabel, cls: statusCls } = STATUS_CONFIG[staff.status];
  const joinedDate = new Date(staff.createdAt).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  async function handleDeactivate() {
    setActing("deactivate");
    const updated = await deactivateStaff(staff.id);
    setActing(null);
    onUpdate(updated);
  }

  async function handleReactivate() {
    setActing("reactivate");
    const updated = await reactivateStaff(staff.id);
    setActing(null);
    onUpdate(updated);
  }

  async function handleResend() {
    setActing("resend");
    await resendInvite(staff.id);
    setActing(null);
    setResent(true);
  }

  async function handleSaveRole() {
    setSavingRole(true);
    const updated = await updateStaffRole(staff.id, {
      role: draftRole,
      position: draftPosition,
    });
    setSavingRole(false);
    setEditingRole(false);
    onUpdate(updated);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex w-full max-w-[480px] max-h-[90vh] flex-col overflow-hidden rounded-[16px] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f3f4f6] px-6 py-4">
          <p className="text-[15px] font-semibold text-text-heading">
            Staff profile
          </p>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-text-heading"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {/* Avatar + name + badges */}
          <div className="flex items-center gap-4">
            <div
              className={`flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[16px] ${AVATAR_BG[staff.role]} text-[22px] font-bold text-white`}
            >
              {initials}
            </div>
            <div>
              <p className="text-[18px] font-semibold text-text-heading">
                {staff.firstName} {staff.lastName}
              </p>
              <p className="text-[13px] text-text-body">{staff.position}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${roleText} ${roleBg}`}
                >
                  {ROLE_LABELS[staff.role]}
                </span>
                <span
                  className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusCls}`}
                >
                  {statusLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
              Contact
            </p>
            <a
              href={`mailto:${staff.email}`}
              className="flex items-center gap-2.5 text-[13px] text-text-heading hover:text-brand-green"
            >
              <Mail className="h-[14px] w-[14px] shrink-0 text-[#9ca3af]" />
              {staff.email}
            </a>
            <a
              href={`tel:${staff.phone}`}
              className="flex items-center gap-2.5 text-[13px] text-text-heading hover:text-brand-green"
            >
              <Phone className="h-[14px] w-[14px] shrink-0 text-[#9ca3af]" />
              {staff.phone}
            </a>
            <div className="flex items-center gap-2.5 text-[13px] text-text-body">
              <CalendarDays className="h-[14px] w-[14px] shrink-0 text-[#9ca3af]" />
              Joined {joinedDate}
            </div>
          </div>

          {/* Assigned arms (teachers only) */}
          {staff.role === "teacher" && (
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                Assigned classes
              </p>
              {assignedArms.length === 0 ? (
                <p className="text-[13px] text-[#9ca3af]">
                  Not assigned to any class yet. Assign from the Classes tab.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {assignedArms.map((arm) => (
                    <span
                      key={arm}
                      className="flex items-center gap-1.5 rounded-[8px] border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5 text-[12px] font-medium text-text-heading"
                    >
                      <BookOpen className="h-[11px] w-[11px] text-brand-green" />
                      {arm}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Role & position editor */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                Role & position
              </p>
              {!editingRole && staff.status !== "pending" && (
                <button
                  onClick={() => {
                    setDraftRole(staff.role);
                    setDraftPosition(staff.position);
                    setEditingRole(true);
                  }}
                  className="flex items-center gap-1 text-[12px] text-brand-green hover:opacity-80"
                >
                  <Pencil className="h-[11px] w-[11px]" />
                  Edit
                </button>
              )}
            </div>

            {editingRole ? (
              <div className="space-y-3 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-4">
                <div>
                  <label className="mb-1 block text-[12px] font-medium text-text-body">
                    Role
                  </label>
                  <select
                    value={draftRole}
                    onChange={(e) => setDraftRole(e.target.value as StaffRole)}
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
                  <label className="mb-1 block text-[12px] font-medium text-text-body">
                    Position / title
                  </label>
                  <input
                    type="text"
                    value={draftPosition}
                    onChange={(e) => setDraftPosition(e.target.value)}
                    className="w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-text-heading outline-none focus:border-brand-green"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveRole}
                    disabled={savingRole || !draftPosition.trim()}
                    className="flex items-center gap-1.5 rounded-[7px] bg-brand-green px-3 py-1.5 text-[12px] font-medium text-white hover:opacity-90 disabled:opacity-50"
                  >
                    <Check className="h-[12px] w-[12px]" />
                    {savingRole ? "Saving…" : "Save"}
                  </button>
                  <button
                    onClick={() => setEditingRole(false)}
                    className="rounded-[7px] border border-[#e5e7eb] px-3 py-1.5 text-[12px] text-text-body hover:bg-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-[13px] text-text-body">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${roleText} ${roleBg}`}
                >
                  {ROLE_LABELS[staff.role]}
                </span>
                <span>{staff.position}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-[#f3f4f6] px-6 py-4">
          {staff.status === "active" && (
            <button
              onClick={handleDeactivate}
              disabled={acting === "deactivate"}
              className="w-full rounded-[8px] border border-red-200 bg-red-50 py-2.5 text-[13px] font-medium text-[#dc2626] hover:bg-red-100 disabled:opacity-50"
            >
              {acting === "deactivate"
                ? "Deactivating…"
                : "Deactivate staff member"}
            </button>
          )}

          {staff.status === "inactive" && (
            <button
              onClick={handleReactivate}
              disabled={acting === "reactivate"}
              className="w-full rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {acting === "reactivate"
                ? "Reactivating…"
                : "Reactivate staff member"}
            </button>
          )}

          {staff.status === "pending" && (
            <button
              onClick={handleResend}
              disabled={acting === "resend" || resent}
              className="w-full rounded-[8px] border border-blue-200 bg-blue-50 py-2.5 text-[13px] font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
            >
              {resent
                ? "Invitation resent ✓"
                : acting === "resend"
                  ? "Resending…"
                  : "Resend invitation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
