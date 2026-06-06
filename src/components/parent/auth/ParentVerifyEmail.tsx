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
    <div className="flex flex-col gap-[45px]">
      <div className="flex flex-col gap-[48px]">
        {/* Header */}
        <div className="flex flex-col gap-[18px]">
          <h2 className="text-[24px] font-medium text-[#1b1b1b]">
            Verify your email address
          </h2>
          <p className="text-[16px] font-medium text-[#1b1b1b]">
            We&apos;ve sent a code to your email. Enter it below.
          </p>
        </div>

        {/* OTP + resend */}
        <div className="flex flex-col gap-[19px] items-center w-[448px]">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            containerClassName="gap-[20px] w-full"
          >
            <InputOTPGroup className="gap-[20px]">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot
                  key={i}
                  index={i}
                  className="h-[71px] w-[58px] rounded-[5px] border-0 bg-[#eee] text-[16px] font-medium text-[#1b1b1b] shadow-none data-[active=true]:ring-2 data-[active=true]:ring-brand-green"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {/* Error */}
          {error && <p className="w-full text-xs text-red-500">{error}</p>}

          {/* Resend */}
          <p className="text-[14px] font-normal text-[#1b1b1b] text-center">
            I didn&apos;t receive the code.{" "}
            {countdown > 0 ? (
              <span className="text-[#888]">Resend in {countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={resending}
                className="text-brand-green underline hover:opacity-80 disabled:opacity-50"
              >
                {resending ? "Sending…" : "Resend"}
              </button>
            )}
          </p>
        </div>
      </div>

      {/* Verify button */}
      <button
        type="button"
        onClick={handleVerify}
        disabled={otp.length < 6 || submitting}
        className="flex h-[59px] w-full items-center justify-center rounded-[5px] text-[20px] font-normal transition-colors
          disabled:cursor-not-allowed disabled:bg-[#eee] disabled:text-[#888]
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
