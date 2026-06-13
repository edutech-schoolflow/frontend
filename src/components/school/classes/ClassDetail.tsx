"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Plus,
  Users,
  UserCheck,
  CheckSquare,
  BarChart2,
  BookOpen,
  X,
  Pencil,
  ChevronDown,
} from "lucide-react";
import {
  getClassArms,
  assignClassTeacher,
  getSchoolTeachers,
} from "@/src/lib/api/schools";
import type { ClassArm } from "@/src/types/school";

// ─── Add Arm Modal ─────────────────────────────────────────────────────────────

function AddArmModal({
  className,
  onClose,
  onCreated,
}: {
  className: string;
  onClose: () => void;
  onCreated: (arm: ClassArm) => void;
}) {
  const [armName, setArmName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!armName.trim()) {
      setError("Arm name is required");
      return;
    }
    setSaving(true);
    const newArm: ClassArm = {
      id: `arm-${Date.now()}`,
      classId: "",
      className,
      arm: armName.trim().toUpperCase(),
      fullName: `${className} ${armName.trim().toUpperCase()}`,
      classTeacher: null,
      studentsCount: 0,
      subjectTeachers: [],
    };
    onCreated(newArm);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[400px] rounded-[16px] bg-white p-7 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-text-heading">
            Add arm to {className}
          </h2>
          <button
            onClick={onClose}
            className="text-text-body hover:text-text-heading"
          >
            <X className="h-[17px] w-[17px]" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
              Arm name
            </label>
            <input
              value={armName}
              onChange={(e) => {
                setArmName(e.target.value);
                setError("");
              }}
              placeholder="e.g. A, B, C or Gold, Silver"
              className="h-[42px] w-full rounded-[8px] border border-[#e5e7eb] px-3 text-[13px] outline-none focus:border-brand-green"
            />
            {error && <p className="mt-1 text-[12px] text-red-500">{error}</p>}
            <p className="mt-1.5 text-[12px] text-text-body">
              This will create{" "}
              <strong>
                {className} {armName.trim().toUpperCase() || "?"}
              </strong>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[8px] border border-[#e5e7eb] py-2.5 text-[13px] font-medium text-text-body hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-60"
            >
              {saving ? "Adding…" : "Add arm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Assign Teacher Modal ──────────────────────────────────────────────────────

function AssignTeacherModal({
  arm,
  onClose,
  onAssigned,
}: {
  arm: ClassArm;
  onClose: () => void;
  onAssigned: (arm: ClassArm) => void;
}) {
  const [teachers, setTeachers] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState(arm.classTeacher?.id ?? "");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSchoolTeachers().then((t) => {
      setTeachers(t);
      setLoaded(true);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const updated = await assignClassTeacher(arm.id, selected || null);
    onAssigned(updated);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[420px] rounded-[16px] bg-white p-7 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-[16px] font-semibold text-text-heading">
              Assign class teacher
            </h2>
            <p className="mt-0.5 text-[12px] text-text-body">{arm.fullName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-body hover:text-text-heading"
          >
            <X className="h-[17px] w-[17px]" />
          </button>
        </div>

        {!loaded ? (
          <div className="flex justify-center py-8">
            <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-text-heading">
                Select teacher
              </label>
              <div className="relative">
                <select
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                  className="h-[42px] w-full appearance-none rounded-[8px] border border-[#e5e7eb] bg-white px-3 pr-9 text-[13px] text-text-heading outline-none focus:border-brand-green"
                >
                  <option value="">— No class teacher —</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#9ca3af]" />
              </div>
              {teachers.length === 0 && (
                <p className="mt-1.5 text-[12px] text-text-body">
                  No active teachers found. Add staff first under the Staff tab.
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <button
                onClick={onClose}
                className="flex-1 rounded-[8px] border border-[#e5e7eb] py-2.5 text-[13px] font-medium text-text-body hover:bg-[#f9fafb]"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Confirm"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Arm Card ──────────────────────────────────────────────────────────────────

const QUICK_LINKS = (classId: string, armId: string) => [
  {
    label: "Attendance",
    href: `/school/dashboard/attendance?class=${classId}&arm=${armId}`,
    icon: CheckSquare,
    color: "text-[#4a6cf7]",
    bg: "bg-[#e8f0ff]",
  },
  {
    label: "Grades",
    href: `/school/dashboard/grades/ca?class=${classId}&arm=${armId}`,
    icon: BarChart2,
    color: "text-[#f47e14]",
    bg: "bg-[#fff3e8]",
  },
  {
    label: "Exam Questions",
    href: `/school/dashboard/exams?arm=${armId}`,
    icon: BookOpen,
    color: "text-brand-green",
    bg: "bg-[#e8f5ee]",
  },
];

function ArmCard({
  arm,
  classId,
  onAssign,
}: {
  arm: ClassArm;
  classId: string;
  onAssign: (arm: ClassArm) => void;
}) {
  const links = QUICK_LINKS(classId, arm.id);

  return (
    <div className="rounded-[12px] border border-[#e5e7eb] bg-white p-5">
      {/* Arm header */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-[#e8f5ee] text-[16px] font-bold text-brand-green">
          {arm.arm}
        </div>
        <div>
          <h3 className="text-[15px] font-semibold text-text-heading">
            {arm.fullName}
          </h3>
          <div className="mt-0.5 flex items-center gap-1 text-[12px] text-text-body">
            <Users className="h-[11px] w-[11px]" />
            {arm.studentsCount} students
          </div>
        </div>
      </div>

      {/* Class teacher row */}
      <div className="mb-4 flex items-center justify-between gap-2 rounded-[8px] bg-[#f9fafb] px-3 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <UserCheck className="h-[14px] w-[14px] shrink-0 text-text-body" />
          {arm.classTeacher ? (
            <p className="truncate text-[13px] text-text-heading">
              <span className="text-text-body">Class teacher: </span>
              {arm.classTeacher.name}
            </p>
          ) : (
            <p className="text-[13px] text-text-body">
              No class teacher assigned
            </p>
          )}
        </div>
        <button
          onClick={() => onAssign(arm)}
          className="flex shrink-0 items-center gap-1 rounded-[6px] border border-[#e5e7eb] bg-white px-2.5 py-1 text-[11px] font-medium text-text-body hover:border-brand-green hover:text-brand-green transition-colors"
        >
          <Pencil className="h-[10px] w-[10px]" />
          {arm.classTeacher ? "Change" : "Assign"}
        </button>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-2">
        {links.map((l) => {
          const Icon = l.icon;
          return (
            <Link
              key={l.label}
              href={l.href}
              className="flex flex-col items-center gap-1.5 rounded-[8px] border border-[#e5e7eb] px-2 py-2.5 text-[11px] font-medium text-text-heading transition-shadow hover:shadow-sm"
            >
              <div
                className={`flex h-[28px] w-[28px] items-center justify-center rounded-[7px] ${l.bg}`}
              >
                <Icon className={`h-[13px] w-[13px] ${l.color}`} />
              </div>
              {l.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────

export default function ClassDetail({
  classId,
  className,
}: {
  classId: string;
  className?: string;
}) {
  const [arms, setArms] = useState<ClassArm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddArm, setShowAddArm] = useState(false);
  const [assigningArm, setAssigningArm] = useState<ClassArm | null>(null);

  useEffect(() => {
    getClassArms(classId).then((data) => {
      setArms(data);
      setLoading(false);
    });
  }, [classId]);

  const resolvedName = className ?? arms[0]?.className ?? "Class";

  const handleArmCreated = (arm: ClassArm) => {
    setArms((prev) => [...prev, { ...arm, classId }]);
    setShowAddArm(false);
  };

  const handleAssigned = (updated: ClassArm) => {
    setArms((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    setAssigningArm(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="px-[32px] py-[28px] pb-[60px]">
        <div className="mb-6">
          <Link
            href="/school/dashboard/classes"
            className="mb-4 inline-flex items-center gap-1.5 text-[13px] text-text-body hover:text-text-heading"
          >
            <ArrowLeft className="h-[13px] w-[13px]" />
            Back to Classes
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-[22px] font-semibold text-text-heading">
                {resolvedName}
              </h1>
              <p className="mt-0.5 text-[13px] text-text-body">
                {arms.length} {arms.length === 1 ? "arm" : "arms"} ·{" "}
                {arms.reduce((s, a) => s + a.studentsCount, 0)} students total
              </p>
            </div>
            <button
              onClick={() => setShowAddArm(true)}
              className="flex items-center gap-2 rounded-[8px] bg-brand-green px-4 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
            >
              <Plus className="h-[14px] w-[14px]" />
              Add arm
            </button>
          </div>
        </div>

        {arms.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-[16px] border-2 border-dashed border-[#e5e7eb] bg-white py-[80px] text-center">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#e8f5ee]">
              <Users className="h-[22px] w-[22px] text-brand-green" />
            </div>
            <div>
              <p className="text-[15px] font-semibold text-text-heading">
                No arms yet
              </p>
              <p className="mt-1 max-w-[300px] text-[13px] text-text-body">
                Add arms to {resolvedName} to start assigning class teachers and
                students.
              </p>
            </div>
            <button
              onClick={() => setShowAddArm(true)}
              className="mt-1 flex items-center gap-2 rounded-[8px] bg-brand-green px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90"
            >
              <Plus className="h-[14px] w-[14px]" />
              Add first arm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {arms.map((arm) => (
              <ArmCard
                key={arm.id}
                arm={arm}
                classId={classId}
                onAssign={setAssigningArm}
              />
            ))}
          </div>
        )}
      </div>

      {showAddArm && (
        <AddArmModal
          className={resolvedName}
          onClose={() => setShowAddArm(false)}
          onCreated={handleArmCreated}
        />
      )}

      {assigningArm && (
        <AssignTeacherModal
          arm={assigningArm}
          onClose={() => setAssigningArm(null)}
          onAssigned={handleAssigned}
        />
      )}
    </>
  );
}
