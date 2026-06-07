"use client";

import { useState } from "react";
import { X, Search, CheckCircle2, UserPlus } from "lucide-react";
import { createStudent } from "@/src/lib/api/students";
import { searchParentByPhone, inviteNewParent } from "@/src/lib/api/parents";
import type { Class, Student } from "@/src/types/student";
import type { Parent } from "@/src/types/parent";

type Props = {
  classes: Class[];
  onDone: (student: Student) => void;
  onClose: () => void;
};

type ParentMode = "existing" | "new";

const INPUT =
  "w-full rounded-lg border border-border-default px-3 py-2.5 text-[13px] text-dark-blue outline-none focus:border-brand-green";

export default function AddStudentModal({ classes, onDone, onClose }: Props) {
  const [step, setStep] = useState<1 | 2>(1);

  // Step 1 — student fields
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    gender: "male" as "male" | "female",
    classId: classes[0]?.id ?? "",
    previousSchool: "",
    medicalNotes: "",
  });

  // Step 2 — parent linking
  const [parentMode, setParentMode] = useState<ParentMode>("existing");
  const [phoneQuery, setPhoneQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [foundParent, setFoundParent] = useState<Parent | null | undefined>(
    undefined
  );
  const [linkedParent, setLinkedParent] = useState<Parent | null>(null);
  const [newParent, setNewParent] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [saving, setSaving] = useState(false);

  const set = (k: keyof typeof form, v: string) =>
    setForm((p) => ({ ...p, [k]: v }));
  const setNP = (k: keyof typeof newParent, v: string) =>
    setNewParent((p) => ({ ...p, [k]: v }));

  const step1Valid =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.dateOfBirth &&
    form.classId;

  const step2Valid =
    parentMode === "existing"
      ? linkedParent !== null
      : newParent.firstName.trim() &&
        newParent.lastName.trim() &&
        newParent.phone.trim();

  async function handleSearch() {
    if (!phoneQuery.trim()) return;
    setSearching(true);
    setFoundParent(undefined);
    setLinkedParent(null);
    const result = await searchParentByPhone(phoneQuery);
    setFoundParent(result);
    setSearching(false);
  }

  async function handleSave() {
    setSaving(true);

    // If new parent, send invitation first
    if (parentMode === "new" && !linkedParent) {
      await inviteNewParent({
        firstName: newParent.firstName.trim(),
        lastName: newParent.lastName.trim(),
        phone: newParent.phone.trim(),
        email: newParent.email.trim() || undefined,
      });
    }

    const student = await createStudent({
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      middleName: form.middleName.trim() || undefined,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender,
      classId: form.classId,
      previousSchool: form.previousSchool.trim() || undefined,
      medicalNotes: form.medicalNotes.trim() || undefined,
    });

    setSaving(false);
    onDone(student);
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

            <div>
              <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                Class <span className="text-[#e84040]">*</span>
              </label>
              <select
                className={INPUT}
                value={form.classId}
                onChange={(e) => set("classId", e.target.value)}
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
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

        {/* ── STEP 2: Parent / Guardian ───────────────────────────── */}
        {step === 2 && (
          <div className="px-6 py-5 space-y-5">
            {/* Mode toggle */}
            <div className="flex gap-2 rounded-xl border border-border-default bg-surface-muted p-1">
              {(
                [
                  { key: "existing", label: "Existing parent account" },
                  { key: "new", label: "New parent" },
                ] as { key: ParentMode; label: string }[]
              ).map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => {
                    setParentMode(opt.key);
                    setFoundParent(undefined);
                    setLinkedParent(null);
                  }}
                  className={`flex-1 rounded-lg py-2 text-[13px] font-medium transition-colors ${parentMode === opt.key ? "bg-white text-dark-blue shadow-sm" : "text-grey-text hover:text-dark-blue"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Existing parent search */}
            {parentMode === "existing" && (
              <div className="space-y-3">
                <p className="text-[13px] text-grey-text">
                  Search by the parent&apos;s registered phone number.
                </p>

                <div className="flex gap-2">
                  <input
                    className={`${INPUT} flex-1`}
                    placeholder="+234 801 234 5678"
                    value={phoneQuery}
                    onChange={(e) => {
                      setPhoneQuery(e.target.value);
                      setFoundParent(undefined);
                      setLinkedParent(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                  <button
                    type="button"
                    onClick={handleSearch}
                    disabled={searching || !phoneQuery.trim()}
                    className="flex items-center gap-[6px] rounded-lg bg-brand-green px-4 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
                  >
                    <Search className="h-[14px] w-[14px]" />
                    {searching ? "Searching…" : "Search"}
                  </button>
                </div>

                {/* Result */}
                {foundParent === null && (
                  <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-[13px] text-amber-700">
                    No account found with this number. Switch to{" "}
                    <button
                      type="button"
                      onClick={() => setParentMode("new")}
                      className="font-semibold underline"
                    >
                      New parent
                    </button>{" "}
                    to invite them.
                  </div>
                )}

                {foundParent && !linkedParent && (
                  <div className="flex items-center justify-between rounded-lg border border-border-default bg-surface-muted px-4 py-3">
                    <div>
                      <p className="text-[13px] font-medium text-dark-blue">
                        {foundParent.firstName} {foundParent.lastName}
                      </p>
                      <p className="text-[12px] text-grey-text">
                        {foundParent.phone}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLinkedParent(foundParent)}
                      className="rounded-lg bg-brand-green px-4 py-1.5 text-[12px] font-medium text-white hover:opacity-90"
                    >
                      Link
                    </button>
                  </div>
                )}

                {linkedParent && (
                  <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-brand-green" />
                    <div>
                      <p className="text-[13px] font-medium text-green-700">
                        {linkedParent.firstName} {linkedParent.lastName} will be
                        linked
                      </p>
                      <p className="text-[12px] text-green-600">
                        {linkedParent.phone}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLinkedParent(null)}
                      className="ml-auto text-[12px] text-grey-text hover:text-dark-blue"
                    >
                      Change
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* New parent form */}
            {parentMode === "new" && (
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3">
                  <UserPlus className="mt-[1px] h-4 w-4 shrink-0 text-blue-600" />
                  <p className="text-[13px] text-blue-700">
                    A WhatsApp invitation will be sent to this number. The
                    parent can activate their account and set a PIN to access
                    the portal.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                      First name <span className="text-[#e84040]">*</span>
                    </label>
                    <input
                      className={INPUT}
                      placeholder="e.g. John"
                      value={newParent.firstName}
                      onChange={(e) => setNP("firstName", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                      Last name <span className="text-[#e84040]">*</span>
                    </label>
                    <input
                      className={INPUT}
                      placeholder="e.g. Okafor"
                      value={newParent.lastName}
                      onChange={(e) => setNP("lastName", e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                    Phone number <span className="text-[#e84040]">*</span>
                  </label>
                  <input
                    className={INPUT}
                    placeholder="+234 801 234 5678"
                    value={newParent.phone}
                    onChange={(e) => setNP("phone", e.target.value)}
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                    Email{" "}
                    <span className="text-[12px] font-normal text-grey-text">
                      (optional)
                    </span>
                  </label>
                  <input
                    type="email"
                    className={INPUT}
                    placeholder="john@example.com"
                    value={newParent.email}
                    onChange={(e) => setNP("email", e.target.value)}
                  />
                </div>
              </div>
            )}
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
                disabled={!step2Valid || saving}
                className="flex-1 rounded-lg bg-brand-green py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
              >
                {saving
                  ? "Adding…"
                  : parentMode === "new"
                    ? "Add Student & Invite Parent"
                    : "Add Student"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
