"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  validateInviteToken,
  sendOTP,
  verifyOTP,
  completeRegistration,
} from "@/src/lib/api/invite";
import { STAFF_TEST_USER_KEY } from "@/src/context/StaffFeaturesContext";
import type { InviteDetails } from "@/src/lib/api/invite";

type Step = "loading" | "invalid" | "welcome" | "otp" | "password" | "success";

// ── Password strength ─────────────────────────────────────────────────────────

function passwordStrength(pw: string): {
  level: 0 | 1 | 2 | 3;
  label: string;
  color: string;
} {
  if (pw.length < 6) return { level: 0, label: "", color: "" };
  const hasUpper = /[A-Z]/.test(pw);
  const hasNum = /\d/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = (hasUpper ? 1 : 0) + (hasNum ? 1 : 0) + (hasSpecial ? 1 : 0);
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
    const focusIdx = Math.min(digits.length, 5);
    refs.current[focusIdx]?.focus();
  }

  return (
    <div className="flex gap-3 justify-center">
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
          className="h-[52px] w-[44px] rounded-[10px] border border-[#e5e7eb] bg-white text-center text-[20px] font-semibold text-text-heading outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all"
        />
      ))}
    </div>
  );
}

// ── Shell layout ──────────────────────────────────────────────────────────────

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f9fafb] px-4 py-12">
      <div className="w-full max-w-[420px]">
        <p className="mb-8 text-center text-[18px] font-bold tracking-tight text-brand-green">
          EduPortal
        </p>
        {children}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function InviteAcceptFlow({ token }: { token: string }) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("loading");
  const [details, setDetails] = useState<InviteDetails | null>(null);

  // OTP step state
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpError, setOtpError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Password step state
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [creating, setCreating] = useState(false);

  // Validate token on mount
  useEffect(() => {
    validateInviteToken(token).then((d) => {
      if (!d) {
        setStep("invalid");
      } else {
        setDetails(d);
        setStep("welcome");
      }
    });
  }, [token]);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (step !== "otp") return;
    const id = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(id);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [step]);

  async function handleSendOTP() {
    if (!details) return;
    await sendOTP(details.staffId);
    setCountdown(60);
    setStep("otp");
  }

  async function handleVerifyOTP() {
    if (!details) return;
    const code = otp.join("");
    if (code.length < 6) {
      setOtpError("Enter all 6 digits.");
      return;
    }
    setVerifying(true);
    setOtpError("");
    const ok = await verifyOTP(details.staffId, code);
    setVerifying(false);
    if (ok) {
      setStep("password");
    } else {
      setOtpError("Incorrect code. Try again.");
      setOtp(Array(6).fill(""));
    }
  }

  async function handleCreateAccount() {
    if (!details) return;
    if (password.length < 6) {
      setPwError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPw) {
      setPwError("Passwords do not match.");
      return;
    }
    setCreating(true);
    setPwError("");
    try {
      const { userId } = await completeRegistration(token, password);
      localStorage.setItem(STAFF_TEST_USER_KEY, userId);
      setStep("success");
    } catch {
      setPwError("Something went wrong. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  const strength = passwordStrength(password);

  // ── Renders ────────────────────────────────────────────────────────────────

  if (step === "loading") {
    return (
      <Shell>
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      </Shell>
    );
  }

  if (step === "invalid") {
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

  if (step === "welcome" && details) {
    return (
      <Shell>
        <div className="rounded-[16px] bg-white p-8 shadow-sm">
          <p className="mb-1 text-[13px] font-medium text-brand-green">
            {details.schoolName}
          </p>
          <h1 className="text-[20px] font-bold text-text-heading leading-snug">
            You&apos;ve been invited to join
          </h1>
          <p className="mt-1 text-[13px] text-text-body">
            {details.schoolName} has added you as a staff member.
          </p>

          <div className="mt-5 rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4 space-y-2">
            <Row
              label="Name"
              value={`${details.firstName} ${details.lastName}`}
            />
            <Row label="Role" value={details.role} />
            <Row label="Position" value={details.position} />
            <Row label="School" value={details.schoolName} />
          </div>

          <p className="mt-5 text-[13px] text-text-body">
            To confirm your identity, we&apos;ll send a 6-digit code to your
            registered phone number.
          </p>

          <button
            onClick={handleSendOTP}
            className="mt-5 w-full rounded-[10px] bg-brand-green py-3 text-[14px] font-semibold text-white hover:bg-[#17904f] transition-colors"
          >
            Send verification code
          </button>
        </div>
      </Shell>
    );
  }

  if (step === "otp" && details) {
    return (
      <Shell>
        <div className="rounded-[16px] bg-white p-8 shadow-sm">
          <h1 className="text-[20px] font-bold text-text-heading">
            Verify your number
          </h1>
          <p className="mt-1.5 text-[13px] text-text-body">
            We sent a 6-digit code to{" "}
            <span className="font-medium text-text-heading">
              {details.phoneMasked}
            </span>
          </p>

          <div className="mt-7">
            <OTPInput value={otp} onChange={setOtp} />
          </div>

          {otpError && (
            <p className="mt-3 text-center text-[12px] text-[#dc2626]">
              {otpError}
            </p>
          )}

          <div className="mt-3 text-center">
            {countdown > 0 ? (
              <p className="text-[12px] text-[#9ca3af]">
                Resend code in{" "}
                {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                {String(countdown % 60).padStart(2, "0")}
              </p>
            ) : (
              <button
                onClick={handleSendOTP}
                className="text-[12px] font-medium text-brand-green hover:underline"
              >
                Resend code
              </button>
            )}
          </div>

          {/* Dev hint */}
          <div className="mt-5 rounded-[8px] border border-[#fbbf24] bg-[#fffbeb] px-3 py-2 text-center">
            <p className="text-[11px] text-[#b45309]">
              Testing mode — use code <span className="font-bold">123456</span>
            </p>
          </div>

          <button
            onClick={handleVerifyOTP}
            disabled={verifying || otp.join("").length < 6}
            className="mt-5 w-full rounded-[10px] bg-brand-green py-3 text-[14px] font-semibold text-white hover:bg-[#17904f] disabled:opacity-50 transition-colors"
          >
            {verifying ? "Verifying…" : "Verify"}
          </button>
        </div>
      </Shell>
    );
  }

  if (step === "password") {
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
                  setPwError("");
                }}
                placeholder="Min. 6 characters"
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
                  setPwError("");
                }}
                placeholder="Repeat your password"
                className="w-full rounded-[8px] border border-[#e5e7eb] px-3 py-2.5 text-[13px] text-text-heading outline-none focus:border-brand-green"
              />
            </div>
          </div>

          {pwError && (
            <p className="mt-2 text-[12px] text-[#dc2626]">{pwError}</p>
          )}

          <button
            onClick={handleCreateAccount}
            disabled={creating || !password || !confirmPw}
            className="mt-6 w-full rounded-[10px] bg-brand-green py-3 text-[14px] font-semibold text-white hover:bg-[#17904f] disabled:opacity-50 transition-colors"
          >
            {creating ? "Creating account…" : "Create account"}
          </button>
        </div>
      </Shell>
    );
  }

  if (step === "success" && details) {
    return (
      <Shell>
        <div className="rounded-[16px] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#f0fdf4]">
            <svg
              className="h-8 w-8 text-brand-green"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-[20px] font-bold text-text-heading">
            You&apos;re in, {details.firstName}!
          </h1>
          <p className="mt-2 text-[13px] text-text-body">
            You&apos;re now part of{" "}
            <span className="font-medium text-text-heading">
              {details.schoolName}
            </span>{" "}
            as{" "}
            <span className="font-medium text-text-heading">
              {details.position}
            </span>
            .
          </p>

          <button
            onClick={() => router.push("/staff/dashboard")}
            className="mt-7 w-full rounded-[10px] bg-brand-green py-3 text-[14px] font-semibold text-white hover:bg-[#17904f] transition-colors"
          >
            Go to my dashboard
          </button>
        </div>
      </Shell>
    );
  }

  return null;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-text-body">{label}</span>
      <span className="text-[13px] font-medium text-text-heading">{value}</span>
    </div>
  );
}
