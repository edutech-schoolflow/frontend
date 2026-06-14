"use client";

import { useEffect, useState } from "react";
import {
  Search,
  X,
  ChevronDown,
  Phone,
  Mail,
  Check,
  ArrowRightLeft,
  UserMinus,
  UserCheck,
  AlertTriangle,
  FileText,
  ShieldCheck,
  Clock,
  XCircle,
  User,
  NotebookPen,
} from "lucide-react";
import Image from "next/image";
import {
  getStudents,
  getClasses,
  withdrawStudent,
  reAdmitStudent,
  transferStudent,
  getStudentDocuments,
} from "@/src/lib/api/students";
import type { Student, Class, StudentDocument } from "@/src/types/student";

// ── Helpers ────────────────────────────────────────────────────────────────────

function nameInitials(s: Student) {
  return `${s.firstName[0]}${s.lastName[0]}`.toUpperCase();
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function studentAge(dob: string) {
  return Math.floor(
    (Date.now() - new Date(dob).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );
}

function getClassName(s: Student, classes: Class[]) {
  return classes.find((c) => c.id === s.classId)?.name ?? "—";
}

// ── Avatar ─────────────────────────────────────────────────────────────────────

function StudentAvatar({
  student,
  size = 32,
}: {
  student: Student;
  size?: number;
}) {
  if (student.photoUrl) {
    return (
      <div
        style={{ width: size, height: size }}
        className="shrink-0 overflow-hidden rounded-full"
      >
        <Image
          src={student.photoUrl}
          alt={`${student.firstName} ${student.lastName}`}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.375 }}
      className="flex shrink-0 items-center justify-center rounded-full bg-[#e8f5e9] font-semibold text-brand-green"
    >
      {nameInitials(student)}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatusBadge({ status = "active" }: { status?: string }) {
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${
        status === "active"
          ? "bg-[#f0fdf4] text-[#16a34a]"
          : "bg-[#fef2f2] text-[#dc2626]"
      }`}
    >
      {status}
    </span>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <p className="shrink-0 text-[13px] text-[#9ca3af]">{label}</p>
      <p className="text-right text-[13px] font-medium text-text-heading">
        {value}
      </p>
    </div>
  );
}

function DocStatusChip({ status }: { status: StudentDocument["status"] }) {
  if (status === "verified")
    return (
      <span className="flex items-center gap-1 rounded-full bg-[#f0fdf4] px-2.5 py-0.5 text-[11px] font-medium text-[#16a34a]">
        <ShieldCheck className="h-[10px] w-[10px]" />
        Verified
      </span>
    );
  if (status === "rejected")
    return (
      <span className="flex items-center gap-1 rounded-full bg-[#fef2f2] px-2.5 py-0.5 text-[11px] font-medium text-[#dc2626]">
        <XCircle className="h-[10px] w-[10px]" />
        Rejected
      </span>
    );
  return (
    <span className="flex items-center gap-1 rounded-full bg-[#fffbeb] px-2.5 py-0.5 text-[11px] font-medium text-[#d97706]">
      <Clock className="h-[10px] w-[10px]" />
      Pending
    </span>
  );
}

// ── Documents Tab ──────────────────────────────────────────────────────────────

function DocumentsTab({ student }: { student: Student }) {
  const [docs, setDocs] = useState<StudentDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getStudentDocuments(student.id).then((d) => {
      setDocs(d);
      setLoading(false);
    });
  }, [student.id]);

  const passportDoc = docs.find((d) => d.category === "passport_photo");
  const otherDocs = docs.filter((d) => d.category !== "passport_photo");

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );

  return (
    <div>
      <div className="flex flex-col gap-4">
        {/* Passport photo */}
        <div className="overflow-hidden rounded-[10px] border border-[#e5e7eb]">
          <div className="flex items-center justify-between bg-[#f9fafb] px-3.5 py-2.5">
            <p className="text-[12px] font-semibold text-text-heading">
              Passport Photograph
            </p>
            {passportDoc ? (
              <DocStatusChip status={passportDoc.status} />
            ) : (
              <span className="text-[11px] text-[#9ca3af]">Not submitted</span>
            )}
          </div>

          {passportDoc ? (
            <div className="p-3.5">
              <div className="flex items-start gap-3">
                <div className="h-[80px] w-[64px] shrink-0 overflow-hidden rounded-[8px] border border-[#e5e7eb] bg-[#f3f4f6]">
                  {student.photoUrl ? (
                    <Image
                      src={student.photoUrl}
                      alt="Passport photo"
                      width={64}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <User className="h-[28px] w-[28px] text-[#d1d5db]" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[12px] text-[#9ca3af]">
                    Uploaded {fmtDate(passportDoc.uploadedAt)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#9ca3af]">
                    Submitted by parent
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-3.5 py-4 text-center">
              <p className="text-[12px] text-[#9ca3af]">No photo on file.</p>
            </div>
          )}
        </div>

        {/* Other docs (birth certificate, etc.) */}
        {otherDocs.length === 0 && !passportDoc && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileText className="mb-3 h-[32px] w-[32px] text-[#e5e7eb]" />
            <p className="text-[13px] font-medium text-text-heading">
              No documents on file
            </p>
            <p className="mt-1 text-[11px] text-text-body">
              Documents submitted during the application will appear here.
            </p>
          </div>
        )}

        {otherDocs.map((doc) => (
          <div
            key={doc.id}
            className="rounded-[10px] border border-[#e5e7eb] bg-white p-3.5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[8px] bg-[#f3f4f6]">
                <FileText className="h-[16px] w-[16px] text-[#6b7280]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-[13px] font-medium text-text-heading">
                      {doc.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#9ca3af]">
                      PDF · {fmtDate(doc.uploadedAt)}
                    </p>
                  </div>
                  <DocStatusChip status={doc.status} />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Medical notes submitted by parent during application */}
        {student.medicalNotes && (
          <div className="rounded-[10px] border border-[#e5e7eb] overflow-hidden">
            <div className="flex items-center gap-2 bg-[#f9fafb] px-3.5 py-2.5">
              <NotebookPen className="h-[13px] w-[13px] text-[#6b7280]" />
              <p className="text-[12px] font-semibold text-text-heading">
                Medical Notes
              </p>
              <span className="ml-auto text-[11px] text-[#9ca3af]">
                Submitted by parent
              </span>
            </div>
            <div className="px-3.5 py-3">
              <p className="text-[13px] leading-relaxed text-text-body">
                {student.medicalNotes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Detail Panel ───────────────────────────────────────────────────────────────

type PanelMode = "view" | "transfer" | "withdraw" | "readmit";
type PanelTab = "overview" | "documents";

function StudentPanel({
  student,
  classes,
  onClose,
  onUpdate,
}: {
  student: Student;
  classes: Class[];
  onClose: () => void;
  onUpdate: (updated: Student) => void;
}) {
  const [tab, setTab] = useState<PanelTab>("overview");
  const [mode, setMode] = useState<PanelMode>("view");
  const [saving, setSaving] = useState(false);
  const [transferTo, setTransferTo] = useState(student.classId ?? "");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTransferTo(student.classId ?? "");

    setMode("view");

    setTab("overview");
  }, [student.id]);

  async function confirmTransfer() {
    if (!transferTo || transferTo === student.classId) return;
    setSaving(true);
    const updated = await transferStudent(student.id, transferTo);
    onUpdate(updated);
    setSaving(false);
    setMode("view");
  }

  async function confirmWithdraw() {
    setSaving(true);
    const updated = await withdrawStudent(student.id);
    onUpdate(updated);
    setSaving(false);
    setMode("view");
  }

  async function confirmReAdmit() {
    setSaving(true);
    const updated = await reAdmitStudent(student.id);
    onUpdate(updated);
    setSaving(false);
    setMode("view");
  }

  const cls = getClassName(student, classes);
  const age = student.dateOfBirth ? studentAge(student.dateOfBirth) : null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Slide-in panel */}
      <div className="fixed right-0 top-0 z-50 flex h-full w-[420px] flex-col overflow-hidden bg-white shadow-2xl">
        {/* Panel header */}
        <div className="border-b border-[#f3f4f6] px-6 pb-0 pt-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Use actual photo in large panel header */}
              {student.photoUrl ? (
                <div className="h-[52px] w-[52px] shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={student.photoUrl}
                    alt={`${student.firstName} ${student.lastName}`}
                    width={52}
                    height={52}
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#1ca95c] text-[18px] font-semibold text-white">
                  {nameInitials(student)}
                </div>
              )}
              <div>
                <p className="text-[16px] font-semibold text-text-heading">
                  {student.firstName} {student.lastName}
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[12px] text-[#9ca3af]">
                    {student.admissionNumber ?? "—"}
                  </span>
                  <StatusBadge status={student.status} />
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="mt-0.5 text-[#9ca3af] transition-colors hover:text-text-heading"
            >
              <X className="h-[18px] w-[18px]" />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-4 flex gap-1">
            {(["overview", "documents"] as PanelTab[]).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setMode("view");
                }}
                className={`rounded-t-[8px] px-4 py-2 text-[13px] font-medium capitalize transition-colors ${
                  tab === t
                    ? "border-b-2 border-brand-green text-brand-green"
                    : "text-[#9ca3af] hover:text-text-heading"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {tab === "documents" ? (
            <DocumentsTab student={student} />
          ) : (
            <>
              {/* Personal info */}
              <div className="mb-6">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                  Personal info
                </p>
                <div className="divide-y divide-[#f9fafb]">
                  <Row
                    label="Date of birth"
                    value={
                      student.dateOfBirth
                        ? `${fmtDate(student.dateOfBirth)}${age ? ` (age ${age})` : ""}`
                        : "—"
                    }
                  />
                  <Row
                    label="Gender"
                    value={student.gender === "male" ? "Male" : "Female"}
                  />
                  <Row label="Class" value={cls} />
                  <Row label="Enrolled" value={fmtDate(student.createdAt)} />
                  {student.previousSchool && (
                    <Row
                      label="Previous school"
                      value={student.previousSchool}
                    />
                  )}
                </div>
              </div>

              {/* Medical notes */}
              {student.medicalNotes && (
                <div className="mb-6">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Medical notes
                  </p>
                  <div className="flex items-start gap-2.5 rounded-[10px] border border-[#fef3c7] bg-[#fffbeb] px-3.5 py-3">
                    <NotebookPen className="mt-0.5 h-[13px] w-[13px] shrink-0 text-[#d97706]" />
                    <p className="text-[13px] leading-relaxed text-[#92400e]">
                      {student.medicalNotes}
                    </p>
                  </div>
                </div>
              )}

              {/* Guardian — read-only */}
              <div className="mb-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Guardian
                  </p>
                  <span className="text-[11px] text-[#9ca3af]">
                    Managed by parent
                  </span>
                </div>

                {student.guardians?.length ? (
                  <div className="flex flex-col gap-2">
                    {student.guardians.map((g, i) => (
                      <div
                        key={i}
                        className="rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] p-3.5"
                      >
                        <p className="text-[13px] font-medium text-text-heading">
                          {g.name}
                        </p>
                        <p className="mt-0.5 text-[12px] text-[#9ca3af]">
                          {g.relationship}
                        </p>
                        <div className="mt-2.5 flex flex-col gap-1.5">
                          <span className="flex items-center gap-2 text-[12px] text-text-body">
                            <Phone className="h-[11px] w-[11px] text-[#9ca3af]" />
                            {g.phone}
                          </span>
                          {g.email && (
                            <span className="flex items-center gap-2 text-[12px] text-text-body">
                              <Mail className="h-[11px] w-[11px] text-[#9ca3af]" />
                              {g.email}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-text-body">
                    No guardian on record.
                  </p>
                )}
              </div>

              {/* Actions — active student */}
              {student.status !== "withdrawn" && mode === "view" && (
                <div className="mb-2">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Actions
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => setMode("transfer")}
                      className="flex w-full items-center gap-2.5 rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-3 text-left text-[13px] text-text-heading transition-colors hover:border-brand-green hover:bg-[#f0fdf4]"
                    >
                      <ArrowRightLeft className="h-[14px] w-[14px] text-brand-green" />
                      Transfer to another class
                    </button>
                    <button
                      onClick={() => setMode("withdraw")}
                      className="flex w-full items-center gap-2.5 rounded-[10px] border border-[#fee2e2] bg-white px-4 py-3 text-left text-[13px] text-[#dc2626] transition-colors hover:bg-[#fef2f2]"
                    >
                      <UserMinus className="h-[14px] w-[14px]" />
                      Withdraw student
                    </button>
                  </div>
                </div>
              )}

              {/* Actions — withdrawn student */}
              {student.status === "withdrawn" && mode === "view" && (
                <div className="mb-2">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Actions
                  </p>
                  <button
                    onClick={() => setMode("readmit")}
                    className="flex w-full items-center gap-2.5 rounded-[10px] border border-[#e5e7eb] bg-white px-4 py-3 text-left text-[13px] text-text-heading transition-colors hover:border-brand-green hover:bg-[#f0fdf4]"
                  >
                    <UserCheck className="h-[14px] w-[14px] text-brand-green" />
                    Re-admit student
                  </button>
                </div>
              )}

              {/* Re-admit confirm */}
              {mode === "readmit" && (
                <div className="mb-2">
                  <div className="rounded-[10px] border border-[#d1fae5] bg-[#f0fdf4] p-4">
                    <div className="flex items-start gap-2.5">
                      <UserCheck className="mt-0.5 h-[15px] w-[15px] shrink-0 text-brand-green" />
                      <div>
                        <p className="text-[13px] font-medium text-[#15803d]">
                          Re-admit {student.firstName}?
                        </p>
                        <p className="mt-1 text-[12px] text-[#9ca3af]">
                          The student will be restored to active status and
                          returned to their last assigned class.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={confirmReAdmit}
                        disabled={saving}
                        className="rounded-[8px] bg-brand-green px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {saving ? "Re-admitting…" : "Confirm re-admission"}
                      </button>
                      <button
                        onClick={() => setMode("view")}
                        className="rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] text-text-body transition-colors hover:border-[#d1d5db]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Transfer flow */}
              {mode === "transfer" && (
                <div className="mb-2">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Transfer class
                  </p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="mb-1 block text-[12px] text-text-body">
                        New class
                      </label>
                      <div className="relative">
                        <select
                          value={transferTo}
                          onChange={(e) => setTransferTo(e.target.value)}
                          className="h-[40px] w-full appearance-none rounded-[8px] border border-[#e5e7eb] bg-white pl-3 pr-8 text-[13px] focus:border-brand-green focus:outline-none"
                        >
                          {classes.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-[13px] w-[13px] -translate-y-1/2 text-[#9ca3af]" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={confirmTransfer}
                        disabled={saving || transferTo === student.classId}
                        className="flex items-center gap-1.5 rounded-[8px] bg-brand-green px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        <Check className="h-[13px] w-[13px]" />
                        {saving ? "Transferring…" : "Confirm transfer"}
                      </button>
                      <button
                        onClick={() => setMode("view")}
                        className="rounded-[8px] border border-[#e5e7eb] px-4 py-2 text-[13px] text-text-body transition-colors hover:border-[#d1d5db]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Withdraw confirm */}
              {mode === "withdraw" && (
                <div className="mb-2">
                  <div className="rounded-[10px] border border-[#fee2e2] bg-[#fef2f2] p-4">
                    <div className="flex items-start gap-2.5">
                      <AlertTriangle className="mt-0.5 h-[15px] w-[15px] shrink-0 text-[#dc2626]" />
                      <div>
                        <p className="text-[13px] font-medium text-[#dc2626]">
                          Withdraw {student.firstName}?
                        </p>
                        <p className="mt-1 text-[12px] text-[#9ca3af]">
                          The student will be removed from active class lists.
                          Their record is retained and can be viewed under
                          &ldquo;Withdrawn&rdquo;.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={confirmWithdraw}
                        disabled={saving}
                        className="rounded-[8px] bg-[#dc2626] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                      >
                        {saving ? "Withdrawing…" : "Confirm withdrawal"}
                      </button>
                      <button
                        onClick={() => setMode("view")}
                        className="rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] text-text-body transition-colors hover:border-[#d1d5db]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClassId, setFilterClassId] = useState("all");
  const [filterStatus, setFilterStatus] = useState<
    "active" | "withdrawn" | "all"
  >("active");
  const [selected, setSelected] = useState<Student | null>(null);

  useEffect(() => {
    Promise.all([getStudents(), getClasses()]).then(([{ data }, cls]) => {
      setStudents(data);
      setClasses(cls);
      setLoading(false);
    });
  }, []);

  function handleUpdate(updated: Student) {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setSelected(updated);
  }

  const activeCount = students.filter(
    (s) => (s.status ?? "active") === "active"
  ).length;

  const filtered = students.filter((s) => {
    if (filterStatus !== "all" && (s.status ?? "active") !== filterStatus)
      return false;
    if (filterClassId !== "all" && s.classId !== filterClassId) return false;
    if (search) {
      const q = search.toLowerCase();
      const name = `${s.firstName} ${s.lastName}`.toLowerCase();
      if (
        !name.includes(q) &&
        !(s.admissionNumber ?? "").toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });

  return (
    <div className="p-[30px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Students
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          {activeCount} enrolled student{activeCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Filters */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] max-w-[320px] flex-1">
          <Search className="absolute left-3 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#9ca3af]" />
          <input
            placeholder="Search name or admission no."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-[40px] w-full rounded-[10px] border border-[#e5e7eb] bg-white pl-8 pr-4 text-[13px] focus:border-brand-green focus:outline-none"
          />
        </div>

        <div className="relative">
          <select
            value={filterClassId}
            onChange={(e) => setFilterClassId(e.target.value)}
            className="h-[40px] appearance-none rounded-[10px] border border-[#e5e7eb] bg-white pl-3 pr-8 text-[13px] focus:border-brand-green focus:outline-none"
          >
            <option value="all">All classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-[13px] w-[13px] -translate-y-1/2 text-[#9ca3af]" />
        </div>

        <div className="flex rounded-[10px] border border-[#e5e7eb] bg-white p-1">
          {(
            [
              { value: "active", label: "Active" },
              { value: "withdrawn", label: "Withdrawn" },
              { value: "all", label: "All" },
            ] as const
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilterStatus(value)}
              className={`rounded-[7px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
                filterStatus === value
                  ? "bg-brand-green text-white"
                  : "text-text-body hover:text-text-heading"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-[80px]">
          <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#e5e7eb] py-[60px] text-center">
          <p className="text-[15px] font-medium text-text-heading">
            No students found
          </p>
          <p className="mt-1 text-[13px] text-text-body">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                {[
                  "Student",
                  "Admission No.",
                  "Class",
                  "Gender",
                  "Enrolled",
                  "Status",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, idx) => (
                <tr
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={`cursor-pointer transition-colors hover:bg-[#f9fafb] ${
                    idx < filtered.length - 1 ? "border-b border-[#f3f4f6]" : ""
                  } ${selected?.id === s.id ? "bg-[#f0fdf4]" : ""}`}
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <StudentAvatar student={s} size={32} />
                      <span className="text-[13px] font-medium text-text-heading">
                        {s.firstName} {s.lastName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-[#9ca3af]">
                    {s.admissionNumber ?? "—"}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-text-body">
                    {getClassName(s, classes)}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] capitalize text-text-body">
                    {s.gender}
                  </td>
                  <td className="px-4 py-3.5 text-[13px] text-text-body">
                    {new Date(s.createdAt).toLocaleDateString("en-NG", {
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={s.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <StudentPanel
          student={selected}
          classes={classes}
          onClose={() => setSelected(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
}
