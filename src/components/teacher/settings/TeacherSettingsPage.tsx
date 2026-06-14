"use client";

import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Landmark,
  GraduationCap,
  Plus,
  Trash2,
  Check,
  ChevronDown,
} from "lucide-react";
import {
  getStaffSettings,
  saveStaffSettings,
  NIGERIAN_BANKS,
} from "@/src/lib/api/teacherSettings";
import type { QualificationEntry } from "@/src/lib/api/teacherSettings";
import { useAuth } from "@/src/context/AuthContext";

const QUAL_TYPES: { value: QualificationEntry["type"]; label: string }[] = [
  { value: "degree", label: "University Degree" },
  { value: "diploma", label: "Diploma" },
  { value: "certificate", label: "Certificate" },
  { value: "other", label: "Other" },
];

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[16px] border border-[#e5e7eb] bg-white p-6">
      <div className="mb-5 flex items-start gap-4">
        <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[12px] bg-[#f0fdf4]">
          <Icon className="h-[20px] w-[20px] text-brand-green" />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-text-heading">{title}</p>
          <p className="mt-0.5 text-[13px] text-text-body">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-medium text-text-body">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`h-[42px] w-full rounded-[8px] border px-3.5 text-[14px] text-text-heading placeholder:text-[#d1d5db] focus:outline-none ${
          error
            ? "border-[#dc2626] focus:border-[#dc2626]"
            : "border-[#e5e7eb] focus:border-brand-green"
        }`}
      />
      {error && <p className="mt-1 text-[11px] text-[#dc2626]">{error}</p>}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-medium text-text-body">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-[42px] w-full appearance-none rounded-[8px] border border-[#e5e7eb] bg-white px-3.5 pr-9 text-[14px] text-text-heading focus:border-brand-green focus:outline-none"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#9ca3af]" />
      </div>
    </div>
  );
}

function SaveButton({
  saving,
  saved,
  onClick,
}: {
  saving: boolean;
  saved: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={saving}
      className="flex items-center gap-2 rounded-[8px] bg-brand-green px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
    >
      {saved && !saving ? (
        <>
          <Check className="h-[14px] w-[14px]" />
          Saved
        </>
      ) : saving ? (
        "Saving…"
      ) : (
        "Save"
      )}
    </button>
  );
}

export default function StaffSettingsPage() {
  const { user } = useAuth();

  const [loaded, setLoaded] = useState(false);

  // TRCN
  const [trcn, setTrcn] = useState("");
  const [trcnSaving, setTrcnSaving] = useState(false);
  const [trcnSaved, setTrcnSaved] = useState(false);
  const [trcnError, setTrcnError] = useState("");

  // Bank
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [bankSaving, setBankSaving] = useState(false);
  const [bankSaved, setBankSaved] = useState(false);
  const [bankErrors, setBankErrors] = useState<Record<string, string>>({});

  // Qualifications
  const [qualifications, setQualifications] = useState<QualificationEntry[]>(
    []
  );
  const [qualSaving, setQualSaving] = useState(false);
  const [qualSaved, setQualSaved] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getStaffSettings(user?.id).then((s) => {
      if (cancelled) return;
      setTrcn(s.trcnNumber);
      setBankName(s.bank.bankName);
      setAccountNumber(s.bank.accountNumber);
      setAccountName(s.bank.accountName);
      setQualifications(s.qualifications);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  // ── TRCN ─────────────────────────────────────────────────────────────────────
  const handleSaveTrcn = async () => {
    if (trcn.trim() && !/^\d{8}$/.test(trcn.trim())) {
      setTrcnError("TRCN must be exactly 8 digits");
      return;
    }
    setTrcnError("");
    setTrcnSaving(true);
    await saveStaffSettings(user?.id, { trcnNumber: trcn.trim() });
    setTrcnSaving(false);
    setTrcnSaved(true);
    setTimeout(() => setTrcnSaved(false), 3000);
  };

  // ── Bank ──────────────────────────────────────────────────────────────────────
  const handleSaveBank = async () => {
    const e: Record<string, string> = {};
    if (accountNumber.trim() && !/^\d{10}$/.test(accountNumber.trim()))
      e.accountNumber = "Account number must be 10 digits";
    if (accountNumber.trim() && !bankName) e.bankName = "Select a bank";
    if (accountNumber.trim() && !accountName.trim())
      e.accountName = "Account name is required";
    if (Object.keys(e).length > 0) {
      setBankErrors(e);
      return;
    }
    setBankErrors({});
    setBankSaving(true);
    await saveStaffSettings(user?.id, {
      bank: {
        bankName,
        accountNumber: accountNumber.trim(),
        accountName: accountName.trim(),
      },
    });
    setBankSaving(false);
    setBankSaved(true);
    setTimeout(() => setBankSaved(false), 3000);
  };

  // ── Qualifications ───────────────────────────────────────────────────────────
  const addQualification = () => {
    setQualifications((prev) => [
      ...prev,
      {
        id: `q-${Date.now()}`,
        type: "degree",
        title: "",
        institution: "",
        year: "",
      },
    ]);
  };

  const updateQual = (
    id: string,
    field: keyof QualificationEntry,
    value: string
  ) => {
    setQualifications((prev) =>
      prev.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const removeQual = (id: string) => {
    setQualifications((prev) => prev.filter((q) => q.id !== id));
  };

  const handleSaveQualifications = async () => {
    setQualSaving(true);
    await saveStaffSettings(user?.id, { qualifications });
    setQualSaving(false);
    setQualSaved(true);
    setTimeout(() => setQualSaved(false), 3000);
  };

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-[30px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Settings
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          Optional professional details — complete these at your own pace.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        {/* TRCN */}
        <SectionCard
          icon={ShieldCheck}
          title="TRCN Number"
          subtitle="Your Teachers Registration Council of Nigeria registration number."
        >
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <Field
                label="TRCN number (8 digits)"
                value={trcn}
                onChange={(v) => {
                  setTrcn(v.replace(/\D/g, "").slice(0, 8));
                  setTrcnError("");
                }}
                placeholder="e.g. 12345678"
                error={trcnError}
              />
            </div>
            <div className="pt-5">
              <SaveButton
                saving={trcnSaving}
                saved={trcnSaved}
                onClick={handleSaveTrcn}
              />
            </div>
          </div>
          <p className="mt-2 text-[12px] text-[#9ca3af]">
            Leave blank if you are not yet registered with TRCN.
          </p>
        </SectionCard>

        {/* Bank details */}
        <SectionCard
          icon={Landmark}
          title="Bank Account"
          subtitle="Used by your school for salary payments. Not shared publicly."
        >
          <div className="flex flex-col gap-4">
            <Select
              label="Bank name"
              value={bankName}
              onChange={setBankName}
              options={NIGERIAN_BANKS}
              placeholder="Select a bank"
            />
            {bankErrors.bankName && (
              <p className="-mt-2 text-[11px] text-[#dc2626]">
                {bankErrors.bankName}
              </p>
            )}
            <Field
              label="Account number"
              value={accountNumber}
              onChange={(v) => {
                setAccountNumber(v.replace(/\D/g, "").slice(0, 10));
                setBankErrors({});
              }}
              placeholder="10-digit NUBAN"
              error={bankErrors.accountNumber}
            />
            <Field
              label="Account name"
              value={accountName}
              onChange={(v) => {
                setAccountName(v);
                setBankErrors({});
              }}
              placeholder="As it appears on your bank statement"
              error={bankErrors.accountName}
            />
          </div>
          <div className="mt-5 flex items-center justify-between">
            <p className="text-[12px] text-[#9ca3af]">
              Your bank details are only visible to your school&apos;s bursar.
            </p>
            <SaveButton
              saving={bankSaving}
              saved={bankSaved}
              onClick={handleSaveBank}
            />
          </div>
        </SectionCard>

        {/* Qualifications */}
        <SectionCard
          icon={GraduationCap}
          title="Qualifications"
          subtitle="Degrees, diplomas, and certificates you have earned."
        >
          <div className="flex flex-col gap-4">
            {qualifications.length === 0 && (
              <p className="text-[13px] text-text-body">
                No qualifications added yet. Click below to add one.
              </p>
            )}

            {qualifications.map((q, idx) => (
              <div
                key={q.id}
                className="rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] p-4"
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[13px] font-semibold text-text-heading">
                    Qualification {idx + 1}
                  </p>
                  <button
                    onClick={() => removeQual(q.id)}
                    className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] text-[#9ca3af] hover:bg-[#fee2e2] hover:text-[#dc2626] transition-colors"
                  >
                    <Trash2 className="h-[14px] w-[14px]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className="mb-1 block text-[12px] font-medium text-text-body">
                      Type
                    </label>
                    <div className="relative">
                      <select
                        value={q.type}
                        onChange={(e) =>
                          updateQual(q.id, "type", e.target.value)
                        }
                        className="h-[42px] w-full appearance-none rounded-[8px] border border-[#e5e7eb] bg-white px-3.5 pr-9 text-[14px] text-text-heading focus:border-brand-green focus:outline-none"
                      >
                        {QUAL_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>
                            {t.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-[15px] w-[15px] -translate-y-1/2 text-[#9ca3af]" />
                    </div>
                  </div>
                  <div className="col-span-2">
                    <Field
                      label="Title / Programme"
                      value={q.title}
                      onChange={(v) => updateQual(q.id, "title", v)}
                      placeholder="e.g. B.Ed. Mathematics Education"
                    />
                  </div>
                  <Field
                    label="Institution"
                    value={q.institution}
                    onChange={(v) => updateQual(q.id, "institution", v)}
                    placeholder="e.g. University of Lagos"
                  />
                  <Field
                    label="Year completed"
                    value={q.year}
                    onChange={(v) =>
                      updateQual(q.id, "year", v.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="e.g. 2018"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addQualification}
              className="flex items-center gap-2 self-start rounded-[8px] border border-dashed border-[#d1d5db] px-4 py-2.5 text-[13px] font-medium text-text-body hover:border-brand-green hover:text-brand-green transition-colors"
            >
              <Plus className="h-[14px] w-[14px]" />
              Add qualification
            </button>
          </div>

          {qualifications.length > 0 && (
            <div className="mt-5 flex justify-end border-t border-[#f3f4f6] pt-5">
              <SaveButton
                saving={qualSaving}
                saved={qualSaved}
                onClick={handleSaveQualifications}
              />
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
