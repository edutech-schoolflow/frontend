"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import FormButton from "@/src/components/ui/formButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";
import {
  useVerifyPhone,
  useResendOtp,
  useSchoolLogin,
} from "@/src/lib/api/useSchoolAuth";

const RESEND_SECONDS = 60;

/**
 * Phone OTP verification + auto-login. Used after registration and when a login is
 * rejected because the phone isn't verified yet (`sendOnMount` fires a fresh code).
 */
export default function PhoneVerificationStep({
  phone,
  password,
  onVerified,
  sendOnMount = false,
}: {
  phone: string;
  password: string;
  onVerified: () => void;
  sendOnMount?: boolean;
}) {
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const verify = useVerifyPhone();
  const resend = useResendOtp();
  const login = useSchoolLogin();
  const sent = useRef(false);

  // When reached from the login path, send a code immediately (none was sent yet).
  useEffect(() => {
    if (sendOnMount && !sent.current) {
      sent.current = true;
      resend.mutate(phone, {
        onSuccess: () =>
          toast.success("We sent a verification code to your phone."),
      });
    }
  }, [sendOnMount, phone, resend]);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const handleVerify = async () => {
    if (code.length < 6) return;
    try {
      await verify.mutateAsync({ phone, code });
      // Phone verified → log them straight in.
      await login.mutateAsync({ phone, password });
      toast.success("Phone verified!");
      onVerified();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Verification failed.");
      setCode("");
    }
  };

  const handleResend = async () => {
    try {
      await resend.mutateAsync(phone);
      setCountdown(RESEND_SECONDS);
      setCode("");
      toast.success("A new code is on its way.");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not resend code."
      );
    }
  };

  const busy = verify.isPending || login.isPending;

  return (
    <div className="flex flex-col items-center gap-5 text-center">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-text-heading">
          Verify your phone
        </h2>
        <p className="text-sm text-text-body">
          Enter the 6-digit code we sent to{" "}
          <span className="font-medium text-text-heading">{phone}</span>.
        </p>
      </div>

      <InputOTP maxLength={6} value={code} onChange={setCode}>
        <InputOTPGroup>
          {Array.from({ length: 6 }).map((_, i) => (
            <InputOTPSlot key={i} index={i} className="h-11 w-11" />
          ))}
        </InputOTPGroup>
      </InputOTP>

      <FormButton
        text="Verify & continue"
        loadingText="Verifying…"
        loading={busy}
        disabled={code.length < 6 || busy}
        onClick={handleVerify}
        type="button"
        className="w-full bg-brand-green hover:bg-brand-green/90"
      />

      <button
        type="button"
        onClick={handleResend}
        disabled={countdown > 0 || resend.isPending}
        className="text-sm font-medium text-brand-green hover:underline disabled:text-grey-text disabled:no-underline"
      >
        {countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
      </button>
    </div>
  );
}
