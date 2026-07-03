"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import {
  useValidateInvite,
  useSendInviteOtp,
  useAcceptInvite,
} from "@/src/lib/api/useStaffInvite";
import { EMPLOYMENT_LABELS } from "@/src/lib/api/staffInvite";
import { ROLE_LABELS } from "@/src/types/staff";
import type { StaffRole } from "@/src/types/staff";

type Step = "welcome" | "otp" | "password";

const roleLabel = (role: string) =>
  ROLE_LABELS[role as StaffRole] ?? role.replace(/_/g, " ");
const employmentLabel = (t: string) =>
  EMPLOYMENT_LABELS[t as keyof typeof EMPLOYMENT_LABELS] ?? t;

// ── Password strength ─────────────────────────────────────────────────────────

function passwordStrength(pw: string): {
  level: 0 | 1 | 2 | 3;
  label: string;
  color: string;
} {
  if (pw.length < 6) return { level: 0, label: "", color: "" };
  const score =
    (/[A-Z]/.test(pw) ? 1 : 0) +
    (/\d/.test(pw) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(pw) ? 1 : 0);
  if (pw.length >= 10 && score >= 2)
    return { level: 3, label: "Strong", color: "bg-[#16a34a]" };
  if (pw.length >= 8 && score >= 1)
    return { level: 2, label: "Fair", color: "bg-[#d97706]" };
  return { level: 1, label: "Weak", color: "bg-[#dc2626]" };
}

// ── OTP input ─────────────────────────────────────────────────────────────────

function OTPInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(idx: number, char: string) {
    const digit = char.replace(/\D/g, "").slice(-1);
    const next = [...value];
    next[idx] = digit;
    onChange(next);
    if (digit && idx < 5) refs.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !value[idx] && idx > 0) {
      refs.current[idx - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault();
    const digits = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!digits) return;
    const next = Array(6).fill("");
    digits.split("").forEach((d, i) => (next[i] = d));
    onChange(next);
    refs.current[Math.min(digits.length, 5)]?.focus();
  }

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          className="h-[52px] w-[44px] rounded-[10px] border border-[#e5e7eb] bg-white text-center text-[20px] font-semibold text-text-heading outline-none transition-all focus:border-brand-green focus:ring-2 focus:ring-brand-green/20"
        />
      ))}
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] px-4 py-12">
      <div className="w-full max-w-[420px]">
        <p className="mb-8 text-center text-[18px] font-bold tracking-tight text-brand-green">
          SchoolFlow
        </p>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-text-body">{label}</span>
      <span className="text-[13px] font-medium capitalize text-text-heading">
        {value}
      </span>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function InviteAcceptFlow({ token }: { token: string }) {
  const router = useRouter();
  const { data: details, isPending, isError } = useValidateInvite(token);
  const sendOtp = useSendInviteOtp();
  const accept = useAcceptInvite();

  const [step, setStep] = useState<Step>("welcome");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [countdown]);

  async function handleSendOtp() {
    try {
      await sendOtp.mutateAsync(token);
      setCountdown(60);
      setStep("otp");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send code.");
    }
  }

  async function handleCreateAccount() {
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPw) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await accept.mutateAsync({ token, password, code: otp.join("") });
      toast.success("Welcome aboard!");
      router.push("/staff/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const strength = passwordStrength(password);

  // ── Loading / invalid ──────────────────────────────────────────────────────
  if (isPending) {
    return (
      <Shell>
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      </Shell>
    );
  }

  if (isError || !details) {
    return (
      <Shell>
        <div className="rounded-[16px] bg-white p-8 text-center shadow-sm">
          <p className="text-[32px]">🔗</p>
          <p className="mt-3 text-[16px] font-semibold text-text-heading">
            This link is invalid or has expired
          </p>
          <p className="mt-2 text-[13px] text-text-body">
            Ask your school administrator to send a new invite.
          </p>
        </div>
      </Shell>
    );
  }

  // ── Already has a staff account ──────────────────────────────────────────────
  if (details.hasAccount) {
    return (
      <Shell>
        <div className="rounded-[16px] bg-white p-8 text-center shadow-sm">
          <p className="mb-1 text-[13px] font-medium text-brand-green">
            {details.schoolName}
          </p>
          <h1 className="text-[20px] font-bold leading-snug text-text-heading">
            You already have a staff account
          </h1>
          <p className="mt-2 text-[13px] text-text-body">
            Sign in and you&apos;ll be able to accept this invitation and join{" "}
            {details.schoolName}.
          </p>
          <Link
            href="/staff/login"
            className="mt-6 inline-block w-full rounded-[10px] bg-brand-green py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#17904f]"
          >
            Sign in to accept
          </Link>
        </div>
      </Shell>
    );
  }

  // ── Welcome ──────────────────────────────────────────────────────────────────
  if (step === "welcome") {
    return (
      <Shell>
        <div className="rounded-[16px] bg-white p-8 shadow-sm">
          <p className="mb-1 text-[13px] font-medium text-brand-green">
            {details.schoolName}
          </p>
          <h1 className="text-[20px] font-bold leading-snug text-text-heading">
            {details.firstName
              ? `You've been invited, ${details.firstName}`
              : "You've been invited to join"}
          </h1>
          <p className="mt-1 text-[13px] text-text-body">
            {details.schoolName} has added you as a staff member.
          </p>

          <div className="mt-5 space-y-2 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
            {(details.firstName || details.lastName) && (
              <Row
                label="Name"
                value={`${details.firstName ?? ""} ${details.lastName ?? ""}`.trim()}
              />
            )}
            <Row label="School" value={details.schoolName ?? "—"} />
            <Row label="Role" value={roleLabel(details.role)} />
            <Row
              label="Employment"
              value={employmentLabel(details.employmentType)}
            />
          </div>

          <p className="mt-5 text-[13px] text-text-body">
            To confirm your identity, we&apos;ll send a 6-digit code to your
            registered phone number.
          </p>

          <button
            onClick={handleSendOtp}
            disabled={sendOtp.isPending}
            className="mt-5 w-full rounded-[10px] bg-brand-green py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#17904f] disabled:opacity-50"
          >
            {sendOtp.isPending ? "Sending…" : "Send verification code"}
          </button>
        </div>
      </Shell>
    );
  }

  // ── OTP ──────────────────────────────────────────────────────────────────────
  if (step === "otp") {
    return (
      <Shell>
        <div className="rounded-[16px] bg-white p-8 shadow-sm">
          <h1 className="text-[20px] font-bold text-text-heading">
            Verify your number
          </h1>
          <p className="mt-1.5 text-[13px] text-text-body">
            We sent a 6-digit code to your registered phone number.
          </p>

          <div className="mt-7">
            <OTPInput value={otp} onChange={setOtp} />
          </div>

          <div className="mt-3 text-center">
            {countdown > 0 ? (
              <p className="text-[12px] text-[#9ca3af]">
                Resend code in {countdown}s
              </p>
            ) : (
              <button
                onClick={handleSendOtp}
                className="text-[12px] font-medium text-brand-green hover:underline"
              >
                Resend code
              </button>
            )}
          </div>

          <button
            onClick={() => setStep("password")}
            disabled={otp.join("").length < 6}
            className="mt-6 w-full rounded-[10px] bg-brand-green py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#17904f] disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </Shell>
    );
  }

  // ── Password (final accept) ──────────────────────────────────────────────────
  return (
    <Shell>
      <div className="rounded-[16px] bg-white p-8 shadow-sm">
        <h1 className="text-[20px] font-bold text-text-heading">
          Create your password
        </h1>
        <p className="mt-1.5 text-[13px] text-text-body">
          You&apos;ll use this to sign in to your staff account.
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-body">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              placeholder="Min. 8 characters"
              className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2.5 text-[13px] text-text-heading outline-none focus:border-brand-green"
            />
            {password.length >= 6 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3].map((l) => (
                    <div
                      key={l}
                      className={`h-[3px] flex-1 rounded-full transition-colors ${
                        strength.level >= l ? strength.color : "bg-[#e5e7eb]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[11px] text-text-body">
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-text-body">
              Confirm password
            </label>
            <input
              type="password"
              value={confirmPw}
              onChange={(e) => {
                setConfirmPw(e.target.value);
                setError("");
              }}
              placeholder="Repeat your password"
              className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2.5 text-[13px] text-text-heading outline-none focus:border-brand-green"
            />
          </div>
        </div>

        {error && <p className="mt-2 text-[12px] text-[#dc2626]">{error}</p>}

        <button
          onClick={handleCreateAccount}
          disabled={accept.isPending || !password || !confirmPw}
          className="mt-6 w-full rounded-[10px] bg-brand-green py-3 text-[14px] font-semibold text-white transition-colors hover:bg-[#17904f] disabled:opacity-50"
        >
          {accept.isPending ? "Creating account…" : "Create account & join"}
        </button>

        <button
          onClick={() => setStep("otp")}
          className="mt-3 w-full text-center text-[12px] text-text-body hover:text-text-heading"
        >
          ← Back
        </button>
      </div>
    </Shell>
  );
}
