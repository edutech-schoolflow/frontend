"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";
import { toast } from "sonner";
import { verifyParentPhone, resendParentOtp } from "@/src/lib/api/parentAuth";
import OtpResultModal from "./OtpResultModal";

interface Props {
  phone: string;
  /**
   * What "Continue to login" does after a successful verify. Defaults to navigating
   * to /parent/login — but when this component is already rendered ON the login page
   * (inline, after a "phone not verified" attempt), navigating there is a no-op, so
   * the caller passes a handler that returns to the login form instead.
   */
  onVerified?: () => void;
}

const RESEND_SECONDS = 60;

export default function ParentVerifyEmail({ phone, onVerified }: Props) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [modal, setModal] = useState<"success" | "error" | null>(null);
  const [resultMsg, setResultMsg] = useState("");

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setSubmitting(true);
    try {
      const message = await verifyParentPhone({ phone, code: otp });
      setResultMsg(message);
      setModal("success");
    } catch (err) {
      setResultMsg(err instanceof Error ? err.message : "The code you entered is wrong.");
      setModal("error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const message = await resendParentOtp(phone);
      toast.success(message);
      setCountdown(RESEND_SECONDS);
      setOtp("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend the code.");
    } finally {
      setResending(false);
    }
  };

  return (
    <>
      {modal === "success" && (
        <OtpResultModal
          type="success"
          title="Phone verified!"
          message={resultMsg}
          actionLabel="Continue to login"
          onAction={() => {
            setModal(null);
            if (onVerified) onVerified();
            else router.push("/parent/login");
          }}
        />
      )}

      {modal === "error" && (
        <OtpResultModal
          type="error"
          title="Incorrect code"
          message={resultMsg}
          actionLabel="Try again"
          onAction={() => {
            setModal(null);
            setOtp("");
          }}
        />
      )}

      <div className="flex flex-col gap-[45px]">
        <div className="flex flex-col gap-[48px]">
          {/* Header */}
          <div className="flex flex-col gap-[18px]">
            <h2 className="text-[24px] font-medium text-[#1b1b1b]">
              Verify your phone number
            </h2>
            <p className="text-[16px] font-medium text-[#1b1b1b]">
              We&apos;ve sent a 6-digit code to{" "}
              <span className="text-brand-green">{phone}</span>. Enter it below.
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
    </>
  );
}
