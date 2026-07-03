"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import {
  useStaffDirectory,
  useInvalidateStaffDirectory,
} from "@/src/lib/api/useSchoolStaffDirectory";
import type { Staff, StaffRole } from "@/src/types/staff";
import { ROLE_LABELS } from "@/src/types/staff";
import InviteStaffModal from "./InviteStaffModal";
import StaffDetailModal from "./StaffDetailModal";
import StaffAttendanceBoard from "./StaffAttendanceBoard";

type PageView = "directory" | "attendance";

// ─── Config ────────────────────────────────────────────────────────────────────

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
    cls: "bg-[#f3f4f6] text-[#6b7280] border-[#e5e7eb]",
  },
};

type FilterTab = "all" | "teachers" | "support" | "pending";

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "teachers", label: "Teachers" },
  { key: "support", label: "Admin & Support" },
  { key: "pending", label: "Pending" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function StaffCard({
  staff,
  assignedArms,
  onClick,
}: {
  staff: Staff;
  assignedArms: string[];
  onClick: () => void;
}) {
  const initials = `${staff.firstName[0]}${staff.lastName[0]}`.toUpperCase();
  const { text, bg } = ROLE_COLORS[staff.role];
  const { label: statusLabel, cls: statusCls } = STATUS_CONFIG[staff.status];

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-[14px] border border-[#e5e7eb] bg-white p-5 transition-all hover:border-[#d1d5db] hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-[12px] ${AVATAR_BG[staff.role]} text-[16px] font-bold text-white`}
        >
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-semibold text-text-heading">
            {staff.firstName} {staff.lastName}
          </p>
          <p className="mt-0.5 truncate text-[12px] text-text-body">
            {staff.position}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${text} ${bg}`}
        >
          {ROLE_LABELS[staff.role]}
        </span>
        <span
          className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusCls}`}
        >
          {statusLabel}
        </span>
        {staff.role === "teacher" && assignedArms.length > 0 && (
          <span className="rounded-full bg-[#f3f4f6] px-2 py-0.5 text-[11px] text-[#6b7280]">
            {assignedArms.length} arm{assignedArms.length !== 1 ? "s" : ""}
          </span>
        )}
        {staff.role === "teacher" &&
          staff.status === "active" &&
          assignedArms.length === 0 && (
            <span className="rounded-full bg-[#fff7ed] px-2 py-0.5 text-[11px] text-[#c2410c]">
              No class assigned
            </span>
          )}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function StaffPage() {
  const [view, setView] = useState<PageView>("directory");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Staff | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const { data: staffData, isPending } = useStaffDirectory();
  const invalidateDirectory = useInvalidateStaffDirectory();
  const staff = staffData ?? [];
  // Class-assignment counts come from the Classes module (not wired yet).
  const armsByStaff: Record<string, string[]> = {};
  const loadedTerm = !isPending;

  const tabCounts: Record<FilterTab, number> = {
    all: staff.length,
    teachers: staff.filter((s) => s.role === "teacher").length,
    support: staff.filter((s) => s.role !== "teacher" && s.status !== "pending")
      .length,
    pending: staff.filter((s) => s.status === "pending").length,
  };

  const filtered = useMemo(() => {
    let list = staff;
    if (filter === "teachers") list = list.filter((s) => s.role === "teacher");
    else if (filter === "support")
      list = list.filter((s) => s.role !== "teacher" && s.status !== "pending");
    else if (filter === "pending")
      list = list.filter((s) => s.status === "pending");

    const q = search.toLowerCase();
    if (q) {
      list = list.filter(
        (s) =>
          `${s.firstName} ${s.lastName}`.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.position.toLowerCase().includes(q)
      );
    }
    return list;
  }, [staff, filter, search]);

  const activeCount = staff.filter((s) => s.status === "active").length;
  const pendingCount = staff.filter((s) => s.status === "pending").length;
  const teacherCount = staff.filter(
    (s) => s.role === "teacher" && s.status === "active"
  ).length;

  function handleInviteDone() {
    invalidateDirectory();
    setInviteOpen(false);
  }

  function handleStaffUpdate(updated: Staff) {
    // The list auto-refreshes via the mutation's query invalidation; keep the open modal in sync.
    setSelected(updated);
  }

  return (
    <div className="p-[30px]">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-text-heading">Staff</h1>
          <p className="mt-0.5 text-[14px] text-text-body">
            Manage teaching and non-teaching staff at your school.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex gap-1 rounded-[10px] border border-[#e5e7eb] bg-[#f3f4f6] p-1">
            {(["directory", "attendance"] as PageView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded-[8px] px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  view === v
                    ? "bg-white text-text-heading shadow-sm"
                    : "text-text-body hover:text-text-heading"
                }`}
              >
                {v === "directory" ? "Directory" : "Attendance"}
              </button>
            ))}
          </div>
          {view === "directory" && (
            <button
              onClick={() => setInviteOpen(true)}
              className="flex shrink-0 items-center gap-2 rounded-[10px] bg-brand-green px-4 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
            >
              <Plus className="h-[15px] w-[15px]" />
              Invite staff
            </button>
          )}
        </div>
      </div>

      {/* Attendance view */}
      {view === "attendance" && <StaffAttendanceBoard />}

      {/* Directory view — everything below only shown in directory mode */}
      {view === "directory" && (
        <>
          {/* Stats */}
          {loadedTerm && (
            <div className="mb-6 grid grid-cols-4 gap-4">
              {[
                {
                  label: "Total staff",
                  value: staff.length,
                  color: "text-text-heading",
                  bg: "bg-[#f9fafb]",
                },
                {
                  label: "Active",
                  value: activeCount,
                  color: "text-[#16a34a]",
                  bg: "bg-[#f0fdf4]",
                },
                {
                  label: "Teachers",
                  value: teacherCount,
                  color: "text-[#2563eb]",
                  bg: "bg-[#eff6ff]",
                },
                {
                  label: "Pending invite",
                  value: pendingCount,
                  color: "text-[#b45309]",
                  bg: "bg-[#fffbeb]",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`rounded-[12px] ${stat.bg} px-5 py-4`}
                >
                  <p className={`text-[28px] font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-[13px] text-text-body">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Filters + search */}
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="flex gap-1 rounded-[10px] border border-[#e5e7eb] bg-[#f3f4f6] p-1">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`rounded-[8px] px-4 py-1.5 text-[13px] font-medium transition-colors ${
                    filter === tab.key
                      ? "bg-white text-text-heading shadow-sm"
                      : "text-text-body hover:text-text-heading"
                  }`}
                >
                  {tab.label}
                  {tabCounts[tab.key] > 0 && (
                    <span className="ml-1.5 text-[11px] text-[#9ca3af]">
                      {tabCounts[tab.key]}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="relative max-w-[280px] flex-1">
              <Search className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#9ca3af]" />
              <input
                type="text"
                placeholder="Search by name or role…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-[8px] border border-[#e5e7eb] bg-white py-2 pl-9 pr-3 text-[13px] text-text-heading outline-none focus:border-brand-green"
              />
            </div>
          </div>

          {/* Loading skeleton */}
          {!loadedTerm && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="h-[110px] animate-pulse rounded-[14px] bg-[#f3f4f6]"
                />
              ))}
            </div>
          )}

          {/* Staff grid */}
          {loadedTerm &&
            (filtered.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-[14px] border border-dashed border-[#e5e7eb] py-16 text-center">
                <Users className="h-[40px] w-[40px] text-[#d1d5db]" />
                <p className="text-[15px] font-medium text-text-heading">
                  {search ? "No staff match your search" : "No staff yet"}
                </p>
                <p className="text-[13px] text-text-body">
                  {search
                    ? "Try a different search term or clear the filter."
                    : "Invite your first staff member to get started."}
                </p>
                {!search && (
                  <button
                    onClick={() => setInviteOpen(true)}
                    className="mt-1 flex items-center gap-1.5 rounded-[8px] bg-brand-green px-4 py-2 text-[13px] font-medium text-white hover:opacity-90"
                  >
                    <Plus className="h-[13px] w-[13px]" />
                    Invite staff
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((s) => (
                  <StaffCard
                    key={s.id}
                    staff={s}
                    assignedArms={armsByStaff[s.id] ?? []}
                    onClick={() => setSelected(s)}
                  />
                ))}
              </div>
            ))}
        </>
      )}

      {/* Modals */}
      {inviteOpen && (
        <InviteStaffModal
          onDone={handleInviteDone}
          onClose={() => setInviteOpen(false)}
        />
      )}
      {selected && (
        <StaffDetailModal
          staff={selected}
          assignedArms={armsByStaff[selected.id] ?? []}
          onUpdate={handleStaffUpdate}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
