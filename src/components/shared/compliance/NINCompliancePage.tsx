"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock, ShieldCheck, AlertCircle } from "lucide-react";
import { getComplianceRecord, submitNIN } from "@/src/lib/api/compliance";
import { useAuth } from "@/src/context/AuthContext";
import type { StepStatus } from "@/src/types/compliance";

function maskNIN(nin: string) {
  return `${nin.slice(0, 3)}****${nin.slice(-3)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const STATUS_CONFIG: Record<
  StepStatus,
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    Icon: React.ElementType;
  }
> = {
  not_started: {
    label: "Not submitted",
    color: "#6b7280",
    bg: "#f3f4f6",
    border: "#e5e7eb",
    Icon: AlertCircle,
  },
  in_progress: {
    label: "In progress",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    Icon: Clock,
  },
  pending: {
    label: "Under review",
    color: "#d97706",
    bg: "#fffbeb",
    border: "#fde68a",
    Icon: Clock,
  },
  verified: {
    label: "Verified",
    color: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    Icon: CheckCircle2,
  },
};

export default function NINCompliancePage() {
  const { user } = useAuth();

  const actorType = user?.role === "parent" ? "parent" : "teacher";

  const [ninStatus, setNinStatus] = useState<StepStatus>("not_started");
  const [submittedNIN, setSubmittedNIN] = useState<string | undefined>();
  const [submittedAt, setSubmittedAt] = useState<string | undefined>();
  const [verifiedAt, setVerifiedAt] = useState<string | undefined>();
  const [loaded, setLoaded] = useState(false);

  const [ninInput, setNinInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getComplianceRecord(actorType, user?.id).then((record) => {
      if (cancelled) return;
      const ninStep = record.steps.find((s) => s.id === "nin");
      setNinStatus(ninStep?.status ?? "not_started");
      setSubmittedNIN(ninStep?.data?.nin);
      setSubmittedAt(ninStep?.data?.submittedAt);
      setVerifiedAt(ninStep?.data?.verifiedAt);
      setLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [actorType, user?.id]);

  const validateNIN = (val: string) => {
    if (val.length === 0) return "NIN is required";
    if (!/^\d+$/.test(val)) return "NIN must contain digits only";
    if (val.length !== 11) return "NIN must be exactly 11 digits";
    return "";
  };

  const handleSubmit = async () => {
    const err = validateNIN(ninInput);
    if (err) {
      setInputError(err);
      return;
    }
    setSubmitting(true);
    const record = await submitNIN(actorType, user?.id, ninInput);
    const ninStep = record.steps.find((s) => s.id === "nin");
    setNinStatus(ninStep?.status ?? "pending");
    setSubmittedNIN(ninStep?.data?.nin);
    setSubmittedAt(ninStep?.data?.submittedAt);
    setNinInput("");
    setInputError("");
    setSubmitting(false);
  };

  const cfg = STATUS_CONFIG[ninStatus];

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
          Compliance
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          Verify your identity to stay compliant with school registration
          requirements.
        </p>
      </div>

      {/* Status card */}
      <div
        className="mb-6 flex items-start gap-4 rounded-[14px] border px-6 py-5"
        style={{ backgroundColor: cfg.bg, borderColor: cfg.border }}
      >
        <cfg.Icon
          className="mt-0.5 h-[22px] w-[22px] shrink-0"
          style={{ color: cfg.color }}
        />
        <div>
          <p className="text-[15px] font-semibold" style={{ color: cfg.color }}>
            {cfg.label}
          </p>
          <p className="mt-0.5 text-[13px] text-text-body">
            {ninStatus === "not_started" &&
              "Submit your NIN below to complete your compliance profile."}
            {(ninStatus === "in_progress" || ninStatus === "pending") &&
              `Your NIN was submitted on ${submittedAt ? formatDate(submittedAt) : "—"} and is under review. We will notify you once it is verified.`}
            {ninStatus === "verified" &&
              `Your NIN was verified on ${verifiedAt ? formatDate(verifiedAt) : "—"}.`}
          </p>
        </div>
      </div>

      {/* Phone verified note */}
      <div className="mb-6 flex items-center gap-3 rounded-[12px] border border-[#bbf7d0] bg-[#f0fdf4] px-5 py-3.5">
        <CheckCircle2 className="h-[16px] w-[16px] shrink-0 text-[#16a34a]" />
        <p className="text-[13px] text-[#15803d]">
          <span className="font-medium">Phone number verified</span> — your
          phone was confirmed during registration.
        </p>
      </div>

      {/* NIN card */}
      <div className="rounded-[14px] border border-[#e5e7eb] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-[#f0fdf4]">
            <ShieldCheck className="h-[20px] w-[20px] text-brand-green" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-text-heading">
              National Identification Number (NIN)
            </p>
            <p className="text-[12px] text-text-body">
              Your 11-digit NIN issued by NIMC
            </p>
          </div>
        </div>

        {(ninStatus === "pending" || ninStatus === "verified") &&
        submittedNIN ? (
          <div className="flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
            <div>
              <p className="text-[13px] text-text-body">Submitted NIN</p>
              <p className="mt-0.5 font-mono text-[18px] font-semibold tracking-widest text-text-heading">
                {maskNIN(submittedNIN)}
              </p>
            </div>
            <span
              className="rounded-full px-3 py-1 text-[12px] font-semibold"
              style={{ color: cfg.color, backgroundColor: cfg.bg }}
            >
              {cfg.label}
            </span>
          </div>
        ) : (
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-body">
              Enter your NIN
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={11}
                  value={ninInput}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "");
                    setNinInput(val);
                    if (inputError) setInputError("");
                  }}
                  placeholder="e.g. 12345678901"
                  className={`h-[44px] w-full rounded-[8px] border px-4 font-mono text-[16px] tracking-widest text-text-heading focus:outline-none ${
                    inputError
                      ? "border-[#dc2626] focus:border-[#dc2626]"
                      : "border-[#e5e7eb] focus:border-brand-green"
                  }`}
                />
                {inputError && (
                  <p className="mt-1 text-[12px] text-[#dc2626]">
                    {inputError}
                  </p>
                )}
              </div>
              <button
                onClick={handleSubmit}
                disabled={submitting || ninInput.length === 0}
                className="h-[44px] rounded-[8px] bg-brand-green px-5 text-[14px] font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
            <p className="mt-2 text-[12px] text-[#9ca3af]">
              Your NIN is kept confidential and used only for identity
              verification purposes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
