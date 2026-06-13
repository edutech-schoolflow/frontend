"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Users, Edit2, ChevronDown } from "lucide-react";
import {
  getTeacherArms,
  getStudentsForArm,
  getAttendanceRecord,
  submitAttendance,
  type ArmSelectOption,
} from "@/src/lib/api/attendance";
import { useAuth } from "@/src/context/AuthContext";
import type {
  AttendanceStudentRow,
  AttendanceRecord,
  AttendanceStatus,
} from "@/src/types/attendance";
import type { ClassLevel } from "@/src/types/school";

// ─── Helpers ───────────────────────────────────────────────────────────────────

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-NG", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const LEVEL_ORDER: Record<ClassLevel, number> = {
  nursery: 0,
  primary: 1,
  junior_secondary: 2,
  senior_secondary: 3,
};

const LEVEL_LABELS: Record<ClassLevel, string> = {
  nursery: "Nursery",
  primary: "Primary",
  junior_secondary: "Junior Secondary",
  senior_secondary: "Senior Secondary",
};

// ─── Status Button ─────────────────────────────────────────────────────────────

function StatusBtn({
  status,
  active,
  onClick,
  disabled,
}: {
  status: AttendanceStatus;
  active: boolean;
  onClick: () => void;
  disabled: boolean;
}) {
  const cfg = {
    present: {
      active: "bg-[#16a34a] text-white border-[#16a34a]",
      idle: "border-[#e5e7eb] text-text-body hover:border-[#16a34a] hover:text-[#16a34a]",
      label: "P",
    },
    absent: {
      active: "bg-[#dc2626] text-white border-[#dc2626]",
      idle: "border-[#e5e7eb] text-text-body hover:border-[#dc2626] hover:text-[#dc2626]",
      label: "A",
    },
    late: {
      active: "bg-[#d97706] text-white border-[#d97706]",
      idle: "border-[#e5e7eb] text-text-body hover:border-[#d97706] hover:text-[#d97706]",
      label: "L",
    },
  }[status];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={status.charAt(0).toUpperCase() + status.slice(1)}
      className={`h-[30px] w-[30px] rounded-[6px] border text-[12px] font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
        active ? cfg.active : cfg.idle
      }`}
    >
      {cfg.label}
    </button>
  );
}

// ─── Summary Row ───────────────────────────────────────────────────────────────

function SummaryBar({
  present,
  absent,
  late,
  total,
  submitted,
  submitting,
  onSubmit,
  onEdit,
}: {
  present: number;
  absent: number;
  late: number;
  total: number;
  submitted: boolean;
  submitting: boolean;
  onSubmit: () => void;
  onEdit: () => void;
}) {
  const unmarked = total - present - absent - late;

  return (
    <div className="mt-4 flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-5 py-3.5">
      <div className="flex items-center gap-5 text-[13px]">
        <span className="flex items-center gap-1.5 font-medium text-[#16a34a]">
          <span className="inline-block h-[8px] w-[8px] rounded-full bg-[#16a34a]" />
          {present} present
        </span>
        <span className="flex items-center gap-1.5 font-medium text-[#dc2626]">
          <span className="inline-block h-[8px] w-[8px] rounded-full bg-[#dc2626]" />
          {absent} absent
        </span>
        <span className="flex items-center gap-1.5 font-medium text-[#d97706]">
          <span className="inline-block h-[8px] w-[8px] rounded-full bg-[#d97706]" />
          {late} late
        </span>
        {unmarked > 0 && (
          <span className="text-text-body">{unmarked} unmarked</span>
        )}
      </div>

      {submitted ? (
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-medium text-text-heading hover:bg-[#f3f4f6]"
        >
          <Edit2 className="h-[13px] w-[13px]" />
          Edit record
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={submitting || unmarked > 0}
          className="rounded-[8px] bg-brand-green px-5 py-2 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Submit attendance"}
        </button>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function TeacherAttendancePage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Selection
  const [arms, setArms] = useState<ArmSelectOption[]>([]);
  const [armsLoaded, setArmsLoaded] = useState(false);
  const [selectedArmId, setSelectedArmId] = useState("");
  const [selectedDate, setSelectedDate] = useState(todayIso());

  // Per-arm data (all set inside .then() — never synchronously in an effect)
  const [students, setStudents] = useState<AttendanceStudentRow[]>([]);
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [existingRecord, setExistingRecord] = useState<AttendanceRecord | null>(
    null
  );
  const [readOnly, setReadOnly] = useState(false);

  // Track data freshness: `${armId}:${date}` string — set in .then()
  const [dataKey, setDataKey] = useState("");
  // Track which submission to show the banner for
  const [submittedKey, setSubmittedKey] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // Derived — no setState needed
  const loadingArms = !armsLoaded;
  const loadingStudents =
    selectedArmId !== "" && dataKey !== `${selectedArmId}:${selectedDate}`;
  const justSubmitted =
    submittedKey === `${selectedArmId}:${selectedDate}` && readOnly;

  // Load only arms assigned to this teacher — all setState in .then()
  useEffect(() => {
    let cancelled = false;
    getTeacherArms(user?.id).then((data) => {
      if (cancelled) return;
      const sorted = [...data].sort(
        (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]
      );
      setArms(sorted);
      setArmsLoaded(true);
      const armParam = searchParams.get("arm");
      if (armParam && sorted.find((a) => a.armId === armParam)) {
        setSelectedArmId(armParam);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id, searchParams]);

  // Load students + existing record — all setState in .then()
  useEffect(() => {
    if (!selectedArmId) return;
    let cancelled = false;
    Promise.all([
      getStudentsForArm(selectedArmId),
      getAttendanceRecord(selectedArmId, selectedDate),
    ]).then(([studentList, record]) => {
      if (cancelled) return;
      setStudents(studentList);
      setDataKey(`${selectedArmId}:${selectedDate}`);
      if (record) {
        setExistingRecord(record);
        setReadOnly(true);
        const markMap: Record<string, AttendanceStatus> = {};
        record.marks.forEach((m) => {
          markMap[m.studentId] = m.status;
        });
        setMarks(markMap);
      } else {
        setExistingRecord(null);
        setReadOnly(false);
        const defaultMarks: Record<string, AttendanceStatus> = {};
        studentList.forEach((s) => {
          defaultMarks[s.studentId] = "present";
        });
        setMarks(defaultMarks);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedArmId, selectedDate]);

  const setMark = (studentId: string, status: AttendanceStatus) => {
    if (readOnly) return;
    setMarks((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAll = (status: AttendanceStatus) => {
    if (readOnly) return;
    const all: Record<string, AttendanceStatus> = {};
    students.forEach((s) => {
      all[s.studentId] = status;
    });
    setMarks(all);
  };

  const handleSubmit = async () => {
    const arm = arms.find((a) => a.armId === selectedArmId);
    if (!arm) return;
    setSubmitting(true);
    const markList = students.map((s) => ({
      studentId: s.studentId,
      studentName: s.studentName,
      status: marks[s.studentId] ?? "present",
    }));
    const record = await submitAttendance({
      armId: selectedArmId,
      armName: arm.armName,
      date: selectedDate,
      marks: markList,
    });
    setExistingRecord(record);
    setReadOnly(true);
    setSubmittedKey(`${selectedArmId}:${selectedDate}`);
    setSubmitting(false);
  };

  // Counts
  const presentCount = Object.values(marks).filter(
    (s) => s === "present"
  ).length;
  const absentCount = Object.values(marks).filter((s) => s === "absent").length;
  const lateCount = Object.values(marks).filter((s) => s === "late").length;

  // Group arms by level for the select optgroups
  const groupedArms = arms.reduce<Record<string, ArmSelectOption[]>>(
    (acc, arm) => {
      const label = LEVEL_LABELS[arm.level];
      acc[label] = acc[label] ?? [];
      acc[label].push(arm);
      return acc;
    },
    {}
  );

  return (
    <div className="px-[32px] py-[28px] pb-[60px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Attendance
        </h1>
        <p className="mt-0.5 text-[13px] text-text-body">
          Mark and track daily attendance for each class arm.
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        {/* Arm selector */}
        <div className="relative">
          <select
            value={selectedArmId}
            onChange={(e) => setSelectedArmId(e.target.value)}
            disabled={loadingArms}
            className="h-[40px] min-w-[200px] appearance-none rounded-[8px] border border-[#e5e7eb] bg-white pl-3 pr-8 text-[13px] text-text-heading outline-none focus:border-brand-green disabled:opacity-50"
          >
            <option value="">Select class arm…</option>
            {Object.entries(groupedArms).map(([group, opts]) => (
              <optgroup key={group} label={group}>
                {opts.map((a) => (
                  <option key={a.armId} value={a.armId}>
                    {a.armName}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-text-body" />
        </div>

        {/* Date */}
        <input
          type="date"
          value={selectedDate}
          max={todayIso()}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="h-[40px] rounded-[8px] border border-[#e5e7eb] bg-white px-3 text-[13px] text-text-heading outline-none focus:border-brand-green"
        />

        {/* Mark all — only in edit mode with students loaded */}
        {!readOnly && students.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[12px] text-text-body">Mark all:</span>
            <button
              onClick={() => markAll("present")}
              className="h-[32px] rounded-[6px] border border-[#e5e7eb] bg-white px-3 text-[12px] font-medium text-[#16a34a] hover:border-[#16a34a]"
            >
              Present
            </button>
            <button
              onClick={() => markAll("absent")}
              className="h-[32px] rounded-[6px] border border-[#e5e7eb] bg-white px-3 text-[12px] font-medium text-[#dc2626] hover:border-[#dc2626]"
            >
              Absent
            </button>
          </div>
        )}
      </div>

      {/* No arms assigned to this teacher */}
      {!loadingArms && arms.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-[16px] border-2 border-dashed border-[#e5e7eb] bg-white py-[80px] text-center">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#fff3e8]">
            <Users className="h-[22px] w-[22px] text-[#d97706]" />
          </div>
          <p className="text-[15px] font-semibold text-text-heading">
            No class arms assigned
          </p>
          <p className="max-w-[320px] text-[13px] text-text-body">
            You have not been assigned as class teacher to any arm yet. Contact
            your school admin to get assigned.
          </p>
        </div>
      )}

      {/* Arm selector prompt (has arms, none selected yet) */}
      {!loadingArms && arms.length > 0 && !selectedArmId && (
        <div className="flex flex-col items-center gap-3 rounded-[16px] border-2 border-dashed border-[#e5e7eb] bg-white py-[80px] text-center">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#e8f5ee]">
            <Users className="h-[22px] w-[22px] text-brand-green" />
          </div>
          <p className="text-[15px] font-semibold text-text-heading">
            Select a class arm
          </p>
          <p className="max-w-[300px] text-[13px] text-text-body">
            Choose one of your assigned arms and a date above to start marking.
          </p>
        </div>
      )}

      {/* Loading students */}
      {selectedArmId && loadingStudents && (
        <div className="flex items-center justify-center py-[60px]">
          <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      )}

      {/* Student table */}
      {selectedArmId && !loadingStudents && students.length > 0 && (
        <>
          {/* Submitted banner */}
          {justSubmitted && (
            <div className="mb-4 flex items-center gap-3 rounded-[10px] border border-green-200 bg-green-50 px-4 py-3">
              <CheckCircle2 className="h-[16px] w-[16px] shrink-0 text-[#16a34a]" />
              <p className="text-[13px] font-medium text-[#166534]">
                Attendance for{" "}
                {arms.find((a) => a.armId === selectedArmId)?.armName} on{" "}
                {formatDate(selectedDate)} has been saved.
              </p>
            </div>
          )}

          {/* Read-only notice */}
          {readOnly && !justSubmitted && existingRecord && (
            <div className="mb-4 flex items-center gap-3 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
              <CheckCircle2 className="h-[15px] w-[15px] shrink-0 text-brand-green" />
              <p className="text-[13px] text-text-body">
                Attendance already submitted for {formatDate(selectedDate)}.
                Click <strong>Edit record</strong> below to make changes.
              </p>
            </div>
          )}

          {/* Table */}
          <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="w-[48px] py-3 pl-5 text-left text-[11px] font-semibold uppercase tracking-wider text-text-body">
                    #
                  </th>
                  <th className="py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-body">
                    Student
                  </th>
                  <th className="py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-text-body">
                    Adm. No.
                  </th>
                  <th className="py-3 pr-5 text-right text-[11px] font-semibold uppercase tracking-wider text-text-body">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f3f4f6]">
                {students.map((student, idx) => {
                  const status = marks[student.studentId] ?? "present";
                  const rowBg =
                    status === "absent"
                      ? "bg-red-50"
                      : status === "late"
                        ? "bg-amber-50"
                        : "";

                  return (
                    <tr
                      key={student.studentId}
                      className={`transition-colors ${rowBg}`}
                    >
                      <td className="py-3.5 pl-5 text-[13px] text-text-body">
                        {idx + 1}
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[#e8f5ee] text-[11px] font-semibold text-brand-green">
                            {student.studentName
                              .split(" ")
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </div>
                          <span className="text-[13px] font-medium text-text-heading">
                            {student.studentName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 text-[12px] text-text-body">
                        {student.admissionNumber}
                      </td>
                      <td className="py-3.5 pr-5">
                        <div className="flex items-center justify-end gap-1.5">
                          {(
                            ["present", "absent", "late"] as AttendanceStatus[]
                          ).map((s) => (
                            <StatusBtn
                              key={s}
                              status={s}
                              active={status === s}
                              onClick={() => setMark(student.studentId, s)}
                              disabled={readOnly}
                            />
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary bar */}
          <SummaryBar
            present={presentCount}
            absent={absentCount}
            late={lateCount}
            total={students.length}
            submitted={readOnly}
            submitting={submitting}
            onSubmit={handleSubmit}
            onEdit={() => {
              setReadOnly(false);
              setSubmittedKey("");
            }}
          />
        </>
      )}

      {/* No students in arm */}
      {selectedArmId && !loadingStudents && students.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-[16px] border-2 border-dashed border-[#e5e7eb] bg-white py-[80px] text-center">
          <Users className="h-[32px] w-[32px] text-[#d1d5db]" />
          <p className="text-[15px] font-semibold text-text-heading">
            No students in this arm
          </p>
          <p className="text-[13px] text-text-body">
            Enrol students into this arm to start tracking attendance.
          </p>
        </div>
      )}
    </div>
  );
}
