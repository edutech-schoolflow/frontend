"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { toast } from "sonner";
import {
  useMarkableUnits,
  useAttendanceRoster,
  useSubmitAttendance,
} from "@/src/lib/api/useSchoolAttendance";
import { unitKey, type AttendanceStatus } from "@/src/lib/api/schoolAttendance";

const STATUSES: {
  value: AttendanceStatus;
  label: string;
  cls: string;
  on: string;
}[] = [
  {
    value: "present",
    label: "Present",
    cls: "text-[#16a34a]",
    on: "bg-green-50 border-[#16a34a] text-[#16a34a]",
  },
  {
    value: "absent",
    label: "Absent",
    cls: "text-[#dc2626]",
    on: "bg-red-50 border-[#dc2626] text-[#dc2626]",
  },
  {
    value: "late",
    label: "Late",
    cls: "text-[#d97706]",
    on: "bg-amber-50 border-[#d97706] text-[#d97706]",
  },
];

export default function TakeRegisterModal({
  initialDate,
  onClose,
}: {
  initialDate: string;
  onClose: () => void;
}) {
  const { data: units = [], isPending: unitsLoading } = useMarkableUnits();
  const [selectedKey, setSelectedKey] = useState("");
  const [date, setDate] = useState(initialDate);
  const [overrides, setOverrides] = useState<Record<string, AttendanceStatus>>(
    {}
  );

  const selected = units.find((u) => unitKey(u) === selectedKey) ?? null;
  const { data: roster, isPending: rosterLoading } = useAttendanceRoster(
    selected?.classId ?? null,
    selected?.armId ?? null,
    selected ? date : ""
  );
  const submit = useSubmitAttendance();

  const students = roster?.students ?? [];
  const statusFor = (s: {
    studentId: string;
    status: AttendanceStatus | null;
  }): AttendanceStatus => overrides[s.studentId] ?? s.status ?? "present";

  function resetOverrides() {
    setOverrides({});
  }

  function setStatus(studentId: string, status: AttendanceStatus) {
    setOverrides((prev) => ({ ...prev, [studentId]: status }));
  }

  function markAll(status: AttendanceStatus) {
    setOverrides(
      Object.fromEntries(students.map((s) => [s.studentId, status]))
    );
  }

  async function handleSubmit() {
    if (!selected || students.length === 0) return;
    try {
      await submit.mutateAsync({
        classId: selected.classId,
        armId: selected.armId,
        date,
        marks: students.map((s) => ({
          studentId: s.studentId,
          status: statusFor(s),
        })),
      });
      toast.success(`Register submitted for ${selected.armName}.`);
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not submit register."
      );
    }
  }

  const counts = students.reduce(
    (acc, s) => {
      acc[statusFor(s)]++;
      return acc;
    },
    { present: 0, absent: 0, late: 0 } as Record<AttendanceStatus, number>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex max-h-[88vh] w-full max-w-[560px] flex-col rounded-[16px] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#eee] px-6 py-4">
          <h2 className="text-[16px] font-semibold text-text-heading">
            Take register
          </h2>
          <button
            onClick={onClose}
            className="text-text-body hover:text-text-heading"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 border-b border-[#eee] px-6 py-4">
          <div>
            <label className="mb-1 block text-[12px] font-medium text-text-body">
              Class / arm
            </label>
            <select
              value={selectedKey}
              onChange={(e) => {
                setSelectedKey(e.target.value);
                resetOverrides();
              }}
              disabled={unitsLoading}
              className="h-[40px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green disabled:opacity-60"
            >
              <option value="">
                {unitsLoading ? "Loading…" : "Select a class"}
              </option>
              {units.map((u) => (
                <option key={unitKey(u)} value={unitKey(u)}>
                  {u.armName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-text-body">
              Date
            </label>
            <input
              type="date"
              value={date}
              max={initialDate}
              onChange={(e) => {
                setDate(e.target.value);
                resetOverrides();
              }}
              className="h-[40px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
            />
          </div>
        </div>

        {/* Roster */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!selected ? (
            <p className="py-12 text-center text-[13px] text-text-body">
              Pick a class to load its roster.
            </p>
          ) : rosterLoading ? (
            <div className="flex justify-center py-12">
              <div className="h-[26px] w-[26px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
            </div>
          ) : students.length === 0 ? (
            <p className="py-12 text-center text-[13px] text-text-body">
              No active students in this class yet.
            </p>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[12px] text-text-body">
                  {students.length} students
                  {roster?.submitted && (
                    <span className="ml-2 rounded-full bg-green-50 px-2 py-0.5 text-[11px] text-green-700">
                      Already submitted — resubmitting replaces it
                    </span>
                  )}
                </p>
                <button
                  onClick={() => markAll("present")}
                  className="flex items-center gap-1 text-[12px] font-medium text-brand-green hover:underline"
                >
                  <Check className="h-[12px] w-[12px]" /> All present
                </button>
              </div>

              <div className="flex flex-col divide-y divide-[#f3f4f6]">
                {students.map((s) => {
                  const current = statusFor(s);
                  return (
                    <div
                      key={s.studentId}
                      className="flex items-center justify-between gap-2 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-text-heading">
                          {s.studentName}
                        </p>
                        {s.admissionNumber && (
                          <p className="text-[11px] text-text-body">
                            {s.admissionNumber}
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1.5">
                        {STATUSES.map((st) => (
                          <button
                            key={st.value}
                            onClick={() => setStatus(s.studentId, st.value)}
                            className={`rounded-[6px] border px-2.5 py-1 text-[12px] font-medium transition-colors ${
                              current === st.value
                                ? st.on
                                : "border-[#e5e7eb] text-text-body hover:border-[#ccc]"
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-[#eee] px-6 py-4">
          <div className="flex gap-3 text-[12px] text-text-body">
            <span className="text-[#16a34a]">{counts.present} present</span>
            <span className="text-[#dc2626]">{counts.absent} absent</span>
            <span className="text-[#d97706]">{counts.late} late</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-[8px] border border-[#e5e7eb] px-5 py-2.5 text-[13px] font-medium text-text-body hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!selected || students.length === 0 || submit.isPending}
              className="rounded-[8px] bg-brand-green px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
            >
              {submit.isPending ? "Submitting…" : "Submit register"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
