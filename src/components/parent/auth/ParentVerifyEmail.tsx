"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";
import { verifyEmailOtp, resendVerificationEmail } from "@/src/lib/api/parents";

interface Props {
  email: string;
}

const RESEND_SECONDS = 60;

export default function ParentVerifyEmail({ email }: Props) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setError("");
    setSubmitting(true);
    try {
      await verifyEmailOtp({ email, otp });
      router.push("/parent/dashboard");
    } catch {
      setError("Invalid code. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      await resendVerificationEmail(email);
      setCountdown(RESEND_SECONDS);
      setOtp("");
    } finally {
      setResending(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-text-heading">
        Verify your email address
      </h2>
      <p className="mt-1 mb-7 text-sm text-text-body">
        We've sent a code to{" "}
        <span className="font-medium text-text-heading">{email}</span>. Enter it
        below.
      </p>

      {/* 6 OTP boxes */}
      <div className="flex justify-between mb-5">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          containerClassName="gap-2 w-full justify-between"
        >
          <InputOTPGroup className="gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="h-12 w-12 rounded-xl border border-border-default bg-surface-subtle text-base font-semibold text-text-heading first:rounded-xl first:border last:rounded-xl last:border shadow-none data-[active=true]:border-brand-green data-[active=true]:ring-brand-green/20"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      {/* Error */}
      {error && (
        <p className="mb-3 text-xs text-red-500">{error}</p>
      )}

      {/* Resend */}
      <p className="mb-6 text-xs text-text-body text-center">
        I didn't receive the code.{" "}
        {countdown > 0 ? (
          <span className="text-neutral-400">
            Resend in {countdown}s
          </span>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-brand-green hover:underline disabled:opacity-50"
          >
            {resending ? "Sending…" : "Resend"}
          </button>
        )}
      </p>

      {/* Verify button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={otp.length < 6 || submitting}
        className="flex w-full items-center justify-center rounded-lg py-3 text-sm font-semibold transition-colors
          disabled:cursor-not-allowed disabled:bg-neutral-200 disabled:text-neutral-400
          enabled:bg-brand-green enabled:text-white enabled:hover:opacity-90"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying…
          </>
        ) : (
          "Verify"
        )}
      </button>
    </div>
  );
}
