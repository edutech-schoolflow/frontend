"use client";

import { useState } from "react";
import {
  X,
  ChevronRight,
  Users,
  User,
  Package,
  Loader2,
  CheckCircle2,
  Search,
} from "lucide-react";
import {
  getAssignmentPreview,
  formatNaira,
  type ClassOption,
  type StudentOption,
  type AssignTarget,
} from "@/src/lib/api/store";
import type { StoreItem } from "@/src/types/store";
import StudentAvatar from "./StudentAvatar";

type AssignStep = "scope" | "target" | "qty" | "preview";

const STEPS: AssignStep[] = ["scope", "target", "qty", "preview"];
const STEP_LABELS = ["Who", "Select", "Quantity", "Confirm"];

export default function AssignModal({
  item,
  classes,
  students,
  onConfirm,
  onClose,
}: {
  item: StoreItem;
  classes: ClassOption[];
  students: StudentOption[];
  onConfirm: (target: AssignTarget, qty: number, note: string) => Promise<void>;
  onClose: () => void;
}) {
  const [step, setStep] = useState<AssignStep>("scope");
  const [scope, setScope] = useState<AssignTarget["scope"]>("individual");
  const [studentId, setStudentId] = useState("");
  const [classId, setClassId] = useState(classes[0]?.id ?? "");
  const [studentSearch, setStudentSearch] = useState("");
  const [qty, setQty] = useState(1);
  const [note, setNote] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const target: AssignTarget = { scope, studentId, classId };
  const preview = getAssignmentPreview(target, classes, students);
  const total = preview.length * item.price * qty;
  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(studentSearch.toLowerCase())
  );

  async function handleConfirm() {
    setConfirming(true);
    await onConfirm(target, qty, note);
    setConfirming(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
        <div className="w-full max-w-[420px] rounded-[16px] bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-[56px] w-[56px] items-center justify-center rounded-full bg-[#f0fdf4]">
            <CheckCircle2 className="h-[28px] w-[28px] text-[#16a34a]" />
          </div>
          <p className="text-[16px] font-semibold text-text-heading">
            Assignment complete
          </p>
          <p className="mt-2 text-[13px] text-text-body">
            <span className="font-semibold text-text-heading">
              {item.emoji} {item.name}
            </span>{" "}
            assigned to{" "}
            <span className="font-semibold text-text-heading">
              {preview.length} student{preview.length !== 1 ? "s" : ""}
            </span>
            .
            <br />
            <span className="font-semibold text-brand-green">
              {formatNaira(total)}
            </span>{" "}
            added to their invoices.
          </p>
          <button
            onClick={onClose}
            className="mt-6 w-full rounded-[8px] bg-brand-green py-2.5 text-[13px] font-medium text-white hover:bg-[#17904f] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/30 p-4 pt-[60px]">
      <div className="w-full max-w-[520px] rounded-[16px] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f3f4f6] px-6 py-4">
          <div>
            <p className="text-[15px] font-semibold text-text-heading">
              Assign to students
            </p>
            <p className="text-[12px] text-text-body">
              {item.emoji} {item.name} · {formatNaira(item.price)}/{item.unit}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-text-heading"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex border-b border-[#f3f4f6]">
          {STEPS.map((s, i) => {
            const idx = STEPS.indexOf(step);
            const sIdx = STEPS.indexOf(s);
            return (
              <div
                key={s}
                className={`flex-1 py-2.5 text-center text-[11px] font-medium ${
                  sIdx === idx
                    ? "border-b-2 border-brand-green text-brand-green"
                    : sIdx < idx
                      ? "text-[#9ca3af]"
                      : "text-[#d1d5db]"
                }`}
              >
                {STEP_LABELS[i]}
              </div>
            );
          })}
        </div>

        <div className="px-6 py-5">
          {/* Step 1: Scope */}
          {step === "scope" && (
            <div className="space-y-3">
              <p className="text-[13px] text-text-body">
                Who do you want to assign this to?
              </p>
              {[
                {
                  value: "individual",
                  icon: User,
                  label: "Individual student",
                  desc: "Pick one specific student",
                },
                {
                  value: "class",
                  icon: Users,
                  label: "Whole class",
                  desc: "All students in a selected class",
                },
                {
                  value: "all",
                  icon: Package,
                  label: "All students",
                  desc: `Assign to all ${students.length} students in the school`,
                },
              ].map(({ value, icon: Icon, label, desc }) => (
                <button
                  key={value}
                  onClick={() => setScope(value as AssignTarget["scope"])}
                  className={`flex w-full items-center gap-4 rounded-[12px] border p-4 text-left transition-colors ${
                    scope === value
                      ? "border-brand-green bg-[#e8f5ee]"
                      : "border-[#e5e7eb] hover:border-[#d1d5db]"
                  }`}
                >
                  <div
                    className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full ${scope === value ? "bg-brand-green" : "bg-[#f3f4f6]"}`}
                  >
                    <Icon
                      className={`h-[18px] w-[18px] ${scope === value ? "text-white" : "text-[#6b7280]"}`}
                    />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-text-heading">
                      {label}
                    </p>
                    <p className="text-[12px] text-text-body">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Step 2: Target — individual */}
          {step === "target" && scope === "individual" && (
            <div className="space-y-3">
              <p className="text-[13px] text-text-body">
                Search for the student
              </p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#9ca3af]" />
                <input
                  autoFocus
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  placeholder="Type a student's name…"
                  className="w-full rounded-[8px] border border-[#e5e7eb] py-2 pl-9 pr-3 text-[13px] focus:border-brand-green focus:outline-none"
                />
              </div>
              <div className="max-h-[260px] overflow-y-auto space-y-1">
                {filteredStudents.slice(0, 20).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStudentId(s.id)}
                    className={`flex w-full items-center gap-3 rounded-[8px] px-3 py-2.5 text-left transition-colors ${
                      studentId === s.id
                        ? "bg-[#e8f5ee] text-brand-green"
                        : "hover:bg-[#f9fafb] text-text-heading"
                    }`}
                  >
                    <StudentAvatar
                      name={s.name}
                      photoUrl={s.photoUrl}
                      size={30}
                    />
                    <span className="flex-1 text-[13px] font-medium">
                      {s.name}
                    </span>
                    <span className="text-[11px] text-text-body">
                      {s.className}
                    </span>
                  </button>
                ))}
                {filteredStudents.length === 0 && (
                  <p className="py-6 text-center text-[13px] text-[#9ca3af]">
                    No students found
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Target — class */}
          {step === "target" && scope === "class" && (
            <div className="space-y-3">
              <p className="text-[13px] text-text-body">Select a class</p>
              <div className="space-y-2">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    onClick={() => setClassId(cls.id)}
                    className={`flex w-full items-center justify-between rounded-[12px] border p-4 text-left transition-colors ${
                      classId === cls.id
                        ? "border-brand-green bg-[#e8f5ee]"
                        : "border-[#e5e7eb] hover:border-[#d1d5db]"
                    }`}
                  >
                    <span className="text-[14px] font-semibold text-text-heading">
                      {cls.name}
                    </span>
                    <span className="text-[12px] text-text-body">
                      {cls.studentCount} student
                      {cls.studentCount !== 1 ? "s" : ""}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Target — all */}
          {step === "target" && scope === "all" && (
            <div className="rounded-[12px] bg-[#f9fafb] p-5 text-center">
              <p className="text-[32px]">🏫</p>
              <p className="mt-2 text-[14px] font-semibold text-text-heading">
                All {students.length} students
              </p>
              <p className="mt-1 text-[13px] text-text-body">
                This item will be assigned to every student currently enrolled
                in the school.
              </p>
            </div>
          )}

          {/* Step 3: Quantity + note */}
          {step === "qty" && (
            <div className="space-y-5">
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-text-heading">
                  Quantity per student
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQty((v) => Math.max(1, v - 1))}
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border border-[#e5e7eb] text-[18px] text-text-body hover:border-[#d1d5db] transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={qty}
                    onChange={(e) =>
                      setQty(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-[80px] rounded-[8px] border border-[#e5e7eb] py-2 text-center text-[15px] font-semibold text-text-heading focus:border-brand-green focus:outline-none"
                  />
                  <button
                    onClick={() => setQty((v) => v + 1)}
                    className="flex h-[38px] w-[38px] items-center justify-center rounded-[8px] border border-[#e5e7eb] text-[18px] text-text-body hover:border-[#d1d5db] transition-colors"
                  >
                    +
                  </button>
                  <span className="text-[13px] text-text-body">
                    {item.unit}
                    {qty > 1 ? "s" : ""} × {formatNaira(item.price)} ={" "}
                    <strong className="text-text-heading">
                      {formatNaira(item.price * qty)}
                    </strong>{" "}
                    per student
                  </span>
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-semibold text-text-heading">
                  Note (optional)
                </label>
                <input
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Required for new term"
                  className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2 text-[13px] focus:border-brand-green focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Step 4: Preview */}
          {step === "preview" && (
            <div className="space-y-4">
              <div className="rounded-[12px] bg-[#f9fafb] p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-text-body">
                    Students affected
                  </p>
                  <p className="text-[14px] font-bold text-text-heading">
                    {preview.length}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-[13px] text-text-body">Cost per student</p>
                  <p className="text-[14px] font-bold text-text-heading">
                    {formatNaira(item.price * qty)}
                  </p>
                </div>
                <div className="mt-2 flex items-center justify-between border-t border-[#e5e7eb] pt-2">
                  <p className="text-[13px] font-semibold text-text-heading">
                    Total added to invoices
                  </p>
                  <p className="text-[16px] font-bold text-brand-green">
                    {formatNaira(total)}
                  </p>
                </div>
              </div>
              <div className="max-h-[200px] overflow-y-auto rounded-[10px] border border-[#e5e7eb]">
                {preview.map((s, i) => (
                  <div
                    key={s.id}
                    className={`flex items-center gap-3 px-4 py-2.5 ${i < preview.length - 1 ? "border-b border-[#f3f4f6]" : ""}`}
                  >
                    <StudentAvatar
                      name={s.name}
                      photoUrl={s.photoUrl}
                      size={26}
                    />
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-text-heading">
                        {s.name}
                      </p>
                      <p className="text-[11px] text-text-body">
                        {s.className}
                      </p>
                    </div>
                    <p className="text-[12px] font-medium text-text-body">
                      {formatNaira(item.price * qty)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="flex items-center gap-3 border-t border-[#f3f4f6] px-6 py-4">
          {step !== "scope" ? (
            <button
              onClick={() => setStep(STEPS[STEPS.indexOf(step) - 1])}
              className="rounded-[8px] border border-[#e5e7eb] px-5 py-2.5 text-[13px] text-text-body hover:border-[#d1d5db] transition-colors"
            >
              Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="rounded-[8px] border border-[#e5e7eb] px-5 py-2.5 text-[13px] text-text-body hover:border-[#d1d5db] transition-colors"
            >
              Cancel
            </button>
          )}

          {step !== "preview" ? (
            <button
              onClick={() => setStep(STEPS[STEPS.indexOf(step) + 1])}
              disabled={
                (step === "target" && scope === "individual" && !studentId) ||
                (step === "target" && scope === "class" && !classId)
              }
              className="ml-auto flex items-center gap-1.5 rounded-[8px] bg-brand-green px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#17904f] disabled:opacity-50 transition-colors"
            >
              Continue <ChevronRight className="h-[14px] w-[14px]" />
            </button>
          ) : (
            <button
              onClick={handleConfirm}
              disabled={confirming || preview.length === 0}
              className="ml-auto flex items-center gap-2 rounded-[8px] bg-brand-green px-5 py-2.5 text-[13px] font-medium text-white hover:bg-[#17904f] disabled:opacity-50 transition-colors"
            >
              {confirming && (
                <Loader2 className="h-[14px] w-[14px] animate-spin" />
              )}
              {confirming
                ? "Assigning…"
                : `Confirm & bill ${preview.length} student${preview.length !== 1 ? "s" : ""}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
