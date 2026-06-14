"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin, ShieldCheck } from "lucide-react";
import {
  getStaffAttendanceSettings,
  getStaffAttendanceForDate,
  overrideStaffAttendance,
} from "@/src/lib/api/staffAttendance";
import { getSchoolStaff } from "@/src/lib/api/staff";
import type { Staff } from "@/src/types/staff";
import type {
  StaffCheckIn,
  StaffCheckInStatus,
  StaffAttendanceSettings,
} from "@/src/types/staffAttendance";
import { ROLE_LABELS } from "@/src/types/staff";

// ─── Config ────────────────────────────────────────────────────────────────────

const STATUS_CFG = {
  present: {
    label: "Present",
    bg: "bg-[#f0fdf4]",
    text: "text-[#16a34a]",
    border: "border-[#bbf7d0]",
  },
  late: {
    label: "Late",
    bg: "bg-[#fffbeb]",
    text: "text-[#b45309]",
    border: "border-[#fde68a]",
  },
  absent: {
    label: "Absent",
    bg: "bg-[#fef2f2]",
    text: "text-[#dc2626]",
    border: "border-[#fecaca]",
  },
} satisfies Record<
  StaffCheckInStatus,
  { label: string; bg: string; text: string; border: string }
>;

const NOT_IN_CFG = {
  label: "Not checked in",
  bg: "bg-[#f3f4f6]",
  text: "text-[#6b7280]",
  border: "border-[#e5e7eb]",
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  return new Date(iso + "T12:00:00").toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Row component ─────────────────────────────────────────────────────────────

function StaffAttendanceRow({
  staff,
  checkIn,
  onOverride,
}: {
  staff: Staff;
  checkIn: StaffCheckIn | undefined;
  onOverride: (staffId: string, status: StaffCheckInStatus) => void;
}) {
  const [overriding, setOverriding] = useState(false);
  const initials = `${staff.firstName[0]}${staff.lastName[0]}`.toUpperCase();
  const cfg = checkIn ? STATUS_CFG[checkIn.status] : NOT_IN_CFG;

  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] bg-[#f3f4f6] text-[13px] font-bold text-text-heading">
        {initials}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium text-text-heading">
          {staff.firstName} {staff.lastName}
        </p>
        <p className="text-[11px] text-text-body">{ROLE_LABELS[staff.role]}</p>
      </div>

      {checkIn && (
        <div className="flex items-center gap-1.5 text-[12px] text-text-body">
          <MapPin className="h-[11px] w-[11px] shrink-0 text-[#9ca3af]" />
          {checkIn.distanceMeters}m
        </div>
      )}

      {checkIn && (
        <p className="w-[48px] text-right text-[13px] font-medium text-text-heading">
          {checkIn.checkInTime !== "--:--" ? checkIn.checkInTime : "—"}
        </p>
      )}

      <span
        className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${cfg.bg} ${cfg.text} ${cfg.border}`}
      >
        {cfg.label}
      </span>

      {/* Override dropdown */}
      <div className="relative">
        {overriding ? (
          <div className="absolute right-0 top-0 z-10 flex flex-col overflow-hidden rounded-[8px] border border-[#e5e7eb] bg-white shadow-lg">
            {(["present", "late", "absent"] as StaffCheckInStatus[]).map(
              (s) => (
                <button
                  key={s}
                  onClick={() => {
                    onOverride(staff.id, s);
                    setOverriding(false);
                  }}
                  className={`px-4 py-2 text-left text-[12px] font-medium hover:bg-[#f9fafb] ${STATUS_CFG[s].text}`}
                >
                  {STATUS_CFG[s].label}
                </button>
              )
            )}
            <button
              onClick={() => setOverriding(false)}
              className="border-t border-[#f3f4f6] px-4 py-2 text-left text-[12px] text-text-body hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOverriding(true)}
            className="rounded-[6px] border border-[#e5e7eb] px-2.5 py-1 text-[11px] text-text-body hover:border-[#d1d5db] hover:text-text-heading"
          >
            Override
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main board ────────────────────────────────────────────────────────────────

export default function StaffAttendanceBoard() {
  const [date, setDate] = useState(todayIso());
  const [staff, setStaff] = useState<Staff[]>([]);
  const [checkIns, setCheckIns] = useState<Record<string, StaffCheckIn>>({});
  const [settings, setSettings] = useState<StaffAttendanceSettings | null>(
    null
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([getSchoolStaff(), getStaffAttendanceSettings()]).then(
      ([{ staff: s }, sett]) => {
        if (cancelled) return;
        setStaff(s.filter((m) => m.status === "active"));
        setSettings(sett);
        setLoaded(true);
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getStaffAttendanceForDate(date).then((data) => {
      if (cancelled) return;
      setCheckIns(data);
    });
    return () => {
      cancelled = true;
    };
  }, [date]);

  const handleOverride = useCallback(
    async (staffId: string, status: StaffCheckInStatus) => {
      const updated = await overrideStaffAttendance(staffId, date, status);
      setCheckIns((prev) => ({ ...prev, [staffId]: updated }));
    },
    [date]
  );

  const counts = useMemo(() => {
    let present = 0,
      late = 0,
      absent = 0,
      notIn = 0;
    for (const s of staff) {
      const c = checkIns[s.id];
      if (!c) {
        notIn++;
        continue;
      }
      if (c.status === "present") present++;
      else if (c.status === "late") late++;
      else absent++;
    }
    return { present, late, absent, notIn };
  }, [staff, checkIns]);

  return (
    <div>
      {/* Controls */}
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-[15px] w-[15px] text-[#9ca3af]" />
          <input
            type="date"
            value={date}
            max={todayIso()}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-[8px] border border-[#e5e7eb] bg-white px-3 py-2 text-[13px] text-text-heading outline-none focus:border-brand-green"
          />
        </div>

        {settings && (
          <div className="flex items-center gap-1.5 rounded-[8px] border border-[#e5e7eb] bg-[#f9fafb] px-3 py-2 text-[12px] text-text-body">
            <ShieldCheck className="h-[13px] w-[13px] text-brand-green" />
            Geo-fence: {settings.geofenceRadius}m radius · Cut-off:{" "}
            {settings.checkInCutoff}
          </div>
        )}
      </div>

      {/* Summary stats */}
      {loaded && (
        <div className="mb-5 grid grid-cols-4 gap-3">
          {[
            {
              label: "Present",
              value: counts.present,
              color: "text-[#16a34a]",
              bg: "bg-[#f0fdf4]",
            },
            {
              label: "Late",
              value: counts.late,
              color: "text-[#b45309]",
              bg: "bg-[#fffbeb]",
            },
            {
              label: "Absent",
              value: counts.absent,
              color: "text-[#dc2626]",
              bg: "bg-[#fef2f2]",
            },
            {
              label: "Not checked in",
              value: counts.notIn,
              color: "text-[#6b7280]",
              bg: "bg-[#f3f4f6]",
            },
          ].map((s) => (
            <div key={s.label} className={`rounded-[12px] ${s.bg} px-4 py-3.5`}>
              <p className={`text-[24px] font-bold ${s.color}`}>{s.value}</p>
              <p className="mt-0.5 text-[12px] text-text-body">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Date label */}
      <p className="mb-3 text-[13px] font-medium text-text-body">
        {formatDate(date)}
      </p>

      {/* Loading */}
      {!loaded && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-[64px] animate-pulse rounded-[10px] bg-[#f3f4f6]"
            />
          ))}
        </div>
      )}

      {/* Staff list */}
      {loaded && (
        <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
          <div className="divide-y divide-[#f3f4f6]">
            {staff.map((s) => (
              <StaffAttendanceRow
                key={s.id}
                staff={s}
                checkIn={checkIns[s.id]}
                onOverride={handleOverride}
              />
            ))}
          </div>

          {staff.length === 0 && (
            <p className="py-12 text-center text-[13px] text-text-body">
              No active staff members.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
