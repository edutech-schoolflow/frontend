"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Camera,
} from "lucide-react";
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

const TIPS_BULLETS = [
  "Have your NIN ready",
  "Ensure your face is well-lit for the liveness check",
  "The name must match your ID document exactly",
  "NIN must be exactly 11 digits",
];

const FACE_BULLETS = [
  "Ensure you are in a well-lit environment",
  "Keep your face clearly visible",
  "Remove glasses or face coverings",
  "Hold your device steady during capture",
];

export default function NINCompliancePage() {
  const { user } = useAuth();

  const actorType = user?.role === "parent" ? "parent" : "teacher";

  const [ninStatus, setNinStatus] = useState<StepStatus>("not_started");
  const [submittedNIN, setSubmittedNIN] = useState<string | undefined>();
  const [submittedAt, setSubmittedAt] = useState<string | undefined>();
  const [verifiedAt, setVerifiedAt] = useState<string | undefined>();
  const [loaded, setLoaded] = useState(false);

  const [nin, setNin] = useState("");
  const [address, setAddress] = useState("");
  const [faceDone, setFaceDone] = useState(false);
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

  const idReady = nin.length === 11;
  const canSubmit = idReady && address.trim().length > 0 && faceDone;

  const handleSubmit = async () => {
    if (nin.length !== 11) {
      setInputError("NIN must be exactly 11 digits");
      return;
    }
    setSubmitting(true);
    const record = await submitNIN(actorType, user?.id, nin);
    const ninStep = record.steps.find((s) => s.id === "nin");
    setNinStatus(ninStep?.status ?? "pending");
    setSubmittedNIN(ninStep?.data?.nin);
    setSubmittedAt(ninStep?.data?.submittedAt);
    setNin("");
    setAddress("");
    setFaceDone(false);
    setInputError("");
    setSubmitting(false);
  };

  const cfg = STATUS_CONFIG[ninStatus];

  const inputCls =
    "h-[46px] w-full rounded-[8px] border border-[#e5e7eb] bg-white px-4 text-[14px] text-text-heading outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20";
  const labelCls = "mb-1.5 block text-[13px] font-medium text-text-heading";

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

      {/* Submitted state */}
      {(ninStatus === "pending" || ninStatus === "verified") && submittedNIN ? (
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
        </div>
      ) : (
        /* Form + tips */
        <div className="flex gap-6">
          {/* Form card */}
          <div className="flex-1 rounded-[14px] border border-[#e5e7eb] bg-white p-6">
            <h2 className="mb-5 text-[17px] font-semibold text-text-heading">
              Identity Verification
            </h2>
            <div className="flex flex-col gap-5">
              <div>
                <label className={labelCls}>
                  National Identity Number (NIN)
                </label>
                <input
                  className={`h-[46px] w-full rounded-[8px] border bg-white px-4 text-[14px] text-text-heading outline-none focus:ring-1 focus:ring-brand-green/20 ${
                    inputError
                      ? "border-[#dc2626] focus:border-[#dc2626]"
                      : "border-[#e5e7eb] focus:border-brand-green"
                  }`}
                  placeholder="Enter 11-digit NIN"
                  maxLength={11}
                  value={nin}
                  onChange={(e) => {
                    setNin(e.target.value.replace(/\D/g, ""));
                    if (inputError) setInputError("");
                  }}
                />
                {inputError && (
                  <p className="mt-1 text-[12px] text-[#dc2626]">
                    {inputError}
                  </p>
                )}
              </div>

              <div>
                <label className={labelCls}>Address</label>
                <input
                  className={inputCls}
                  placeholder="Enter your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {/* Liveness check */}
              <div>
                <p className={labelCls}>Liveliness Check</p>
                <div className="flex items-center gap-4 rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-3">
                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#f3f4f6]">
                    <Camera className="h-[20px] w-[20px] text-[#9ca3af]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-text-heading">
                      Face verification
                    </p>
                    <p className="text-[12px] text-text-body">
                      {idReady
                        ? "Click to start face check"
                        : "Complete NIN verification first"}
                    </p>
                  </div>
                  {faceDone ? (
                    <span className="text-[12px] font-medium text-brand-green">
                      Done ✓
                    </span>
                  ) : (
                    <button
                      type="button"
                      disabled={!idReady}
                      onClick={() => setFaceDone(true)}
                      className="rounded-[6px] border border-[#e5e7eb] px-4 py-1.5 text-[12px] font-medium text-text-heading transition-colors hover:border-brand-green hover:text-brand-green disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Start check
                    </button>
                  )}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting}
                className="mt-1 h-[46px] w-full rounded-[8px] bg-brand-green text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Submitting…" : "Submit"}
              </button>
            </div>
          </div>

          {/* Tips panel */}
          <div className="w-[240px] shrink-0 rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] px-6 py-6">
            <p className="mb-3 text-[13px] font-semibold text-text-heading">
              Identity Verification
            </p>
            <ul className="flex flex-col gap-2">
              {TIPS_BULLETS.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-[13px] text-text-body"
                >
                  <span className="mt-[3px] h-[6px] w-[6px] shrink-0 rounded-full bg-brand-green" />
                  {b}
                </li>
              ))}
            </ul>

            <p className="mt-5 mb-3 text-[13px] font-semibold text-text-heading">
              Face Verification
            </p>
            <ul className="flex flex-col gap-2">
              {FACE_BULLETS.map((b) => (
                <li
                  key={b}
                  className="flex items-start gap-2 text-[13px] text-text-body"
                >
                  <span className="mt-[3px] h-[6px] w-[6px] shrink-0 rounded-full bg-brand-green" />
                  {b}
                </li>
              ))}
            </ul>

            <div className="mt-5 rounded-[8px] bg-[#fef3c7] px-4 py-3">
              <p className="text-[12px] text-[#92400e]">
                <span className="font-semibold">Important Notes:</span>{" "}
                Providing incorrect or mismatched details may cause verification
                to fail.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
