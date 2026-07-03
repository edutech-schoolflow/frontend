"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useCreateStudent } from "@/src/lib/api/useSchoolStudents";
import { useClassArms } from "@/src/lib/api/useSchoolClasses";
import type { SchoolClass } from "@/src/types/school";

type Props = {
  classes: SchoolClass[];
  onDone: () => void;
  onClose: () => void;
};

const INPUT =
  "w-full rounded-lg border border-border-default px-3 py-2.5 text-[13px] text-dark-blue outline-none focus:border-brand-green";

const RELATIONSHIPS = ["mother", "father", "guardian"] as const;

export default function AddStudentModal({ classes, onDone, onClose }: Props) {
  const create = useCreateStudent();
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 — student
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "male" as "male" | "female",
    classId: classes[0]?.id ?? "",
    armId: "",
    previousSchool: "",
    medicalNotes: "",
  });

  // Step 2 — primary parent (resolved/created by phone on the backend)
  const [parent, setParent] = useState({
    phone: "",
    firstName: "",
    lastName: "",
    relationship: "mother" as (typeof RELATIONSHIPS)[number],
  });

  // Arms (streams) the school explicitly created for this class. May be empty —
  // a class can take students directly without any arm.
  const { data: arms = [] } = useClassArms(form.classId);

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));

  // The arm is optional: a student belongs to the class, and only sits in an arm
  // if the school created one and assigned them to it.
  const effectiveArmId = form.armId || undefined;

  const step1Valid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.dateOfBirth &&
    form.classId;

  const step2Valid = /^(\+?234|0)\d{10}$/.test(parent.phone.trim());

  async function handleSave() {
    try {
      await create.mutateAsync({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        middleName: form.middleName.trim() || undefined,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        classId: form.classId,
        classArmId: effectiveArmId,
        previousSchool: form.previousSchool.trim() || undefined,
        medicalNotes: form.medicalNotes.trim() || undefined,
        parent: {
          phone: parent.phone.trim(),
          firstName: parent.firstName.trim() || undefined,
          lastName: parent.lastName.trim() || undefined,
          relationship: parent.relationship,
        },
      });
      toast.success("Student enrolled.");
      onDone();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not enrol student."
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[520px] rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
          <div>
            <h2 className="text-[16px] font-semibold text-dark-blue">
              Add Student
            </h2>
            <p className="text-[12px] text-grey-text">
              Step {step} of 2 —{" "}
              {step === 1 ? "Student details" : "Parent / Guardian"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-grey-text hover:text-dark-blue"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── STEP 1: Student details ─────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4 px-6 py-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                  First name <span className="text-[#e84040]">*</span>
                </label>
                <input
                  className={INPUT}
                  placeholder="e.g. David"
                  value={form.firstName}
                  onChange={(e) => set("firstName", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                  Last name <span className="text-[#e84040]">*</span>
                </label>
                <input
                  className={INPUT}
                  placeholder="e.g. Okafor"
                  value={form.lastName}
                  onChange={(e) => set("lastName", e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                Middle name{" "}
                <span className="text-[12px] font-normal text-grey-text">
                  (optional)
                </span>
              </label>
              <input
                className={INPUT}
                placeholder="e.g. Chukwuma"
                value={form.middleName}
                onChange={(e) => set("middleName", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                  Date of birth <span className="text-[#e84040]">*</span>
                </label>
                <input
                  type="date"
                  className={INPUT}
                  value={form.dateOfBirth}
                  onChange={(e) => set("dateOfBirth", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-[13px] font-medium text-dark-blue">
                  Gender <span className="text-[#e84040]">*</span>
                </label>
                <div className="flex gap-2">
                  {(["male", "female"] as const).map((g) => (
                    <label
                      key={g}
                      className={`flex flex-1 cursor-pointer items-center justify-center rounded-lg border py-2 text-[13px] capitalize transition-colors ${form.gender === g ? "border-brand-green bg-green-50 font-medium text-brand-green" : "border-border-default text-grey-text hover:border-brand-green/40"}`}
                    >
                      <input
                        type="radio"
                        className="sr-only"
                        checked={form.gender === g}
                        onChange={() => set("gender", g)}
                      />
                      {g}
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className={arms.length > 0 ? "grid grid-cols-2 gap-3" : ""}>
              <div>
                <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                  Class <span className="text-[#e84040]">*</span>
                </label>
                <select
                  className={INPUT}
                  value={form.classId}
                  onChange={(e) => {
                    set("classId", e.target.value);
                    set("armId", "");
                  }}
                >
                  {classes.length === 0 && (
                    <option value="">No classes yet</option>
                  )}
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Arm picker only when the class has streams — and it's optional:
                  a student can be enrolled into the class without an arm. */}
              {arms.length > 0 && (
                <div>
                  <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                    Arm / Stream{" "}
                    <span className="text-[12px] font-normal text-grey-text">
                      (optional)
                    </span>
                  </label>
                  <select
                    className={INPUT}
                    value={form.armId}
                    onChange={(e) => set("armId", e.target.value)}
                  >
                    <option value="">No specific arm</option>
                    {arms.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.arm || "Main"}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                Previous school{" "}
                <span className="text-[12px] font-normal text-grey-text">
                  (optional)
                </span>
              </label>
              <input
                className={INPUT}
                placeholder="e.g. Rainbow Nursery School"
                value={form.previousSchool}
                onChange={(e) => set("previousSchool", e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                Medical notes{" "}
                <span className="text-[12px] font-normal text-grey-text">
                  (optional)
                </span>
              </label>
              <textarea
                rows={2}
                className={`${INPUT} resize-none`}
                placeholder="e.g. Mild asthma — has inhaler"
                value={form.medicalNotes}
                onChange={(e) => set("medicalNotes", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ── STEP 2: Primary parent ──────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-4 px-6 py-5">
            <p className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-[13px] text-blue-700">
              Enter the student&apos;s primary parent/guardian phone. If it
              already has a SchoolFlow account we&apos;ll link it; otherwise we
              create a pending account they activate via OTP.
            </p>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                Parent phone <span className="text-[#e84040]">*</span>
              </label>
              <input
                className={INPUT}
                placeholder="e.g. 08012345678"
                value={parent.phone}
                onChange={(e) =>
                  setParent((p) => ({
                    ...p,
                    phone: e.target.value.replace(/[^\d+]/g, ""),
                  }))
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                  Parent first name{" "}
                  <span className="text-[12px] font-normal text-grey-text">
                    (new accounts)
                  </span>
                </label>
                <input
                  className={INPUT}
                  placeholder="e.g. John"
                  value={parent.firstName}
                  onChange={(e) =>
                    setParent((p) => ({ ...p, firstName: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                  Parent last name
                </label>
                <input
                  className={INPUT}
                  placeholder="e.g. Okafor"
                  value={parent.lastName}
                  onChange={(e) =>
                    setParent((p) => ({ ...p, lastName: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                Relationship
              </label>
              <select
                className={INPUT}
                value={parent.relationship}
                onChange={(e) =>
                  setParent((p) => ({
                    ...p,
                    relationship: e.target
                      .value as (typeof RELATIONSHIPS)[number],
                  }))
                }
              >
                {RELATIONSHIPS.map((r) => (
                  <option key={r} value={r} className="capitalize">
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 border-t border-border-default px-6 py-4">
          {step === 1 ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-border-default px-5 py-2.5 text-[13px] text-dark-blue hover:bg-surface-muted"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!step1Valid}
                className="flex-1 rounded-lg bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
              >
                Next — Parent details
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="rounded-lg border border-border-default px-5 py-2.5 text-[13px] text-dark-blue hover:bg-surface-muted"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={!step2Valid || create.isPending}
                className="flex-1 rounded-lg bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
              >
                {create.isPending ? "Enrolling…" : "Add Student"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
