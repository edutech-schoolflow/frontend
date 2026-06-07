"use client";

import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";
import OtpResultModal from "@/src/components/parent/auth/OtpResultModal";

interface Props {
  email: string;
  onSuccess: () => void;
  onClose: () => void;
}

export default function EmailVerifyModal({ email, onSuccess, onClose }: Props) {
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modal, setModal] = useState<"success" | "error" | null>(null);

  const handleVerify = async () => {
    if (otp.length < 6) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    if (otp === "123456") {
      setModal("success");
    } else {
      setModal("error");
    }
  };

  if (modal === "success") {
    return (
      <OtpResultModal
        type="success"
        title="Email verified!"
        message={`${email} has been verified successfully.`}
        actionLabel="Done"
        onAction={() => {
          onSuccess();
          onClose();
        }}
      />
    );
  }

  if (modal === "error") {
    return (
      <OtpResultModal
        type="error"
        title="Incorrect code"
        message="The code you entered is wrong. Please check and try again."
        actionLabel="Try again"
        onAction={() => {
          setModal(null);
          setOtp("");
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex w-full max-w-[460px] flex-col gap-[28px] rounded-[12px] bg-white px-[36px] py-[40px]">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-[6px]">
            <h3 className="text-[20px] font-medium text-[#1b1b1b]">
              Verify your email
            </h3>
            <p className="text-[14px] text-[#666]">
              We&apos;ve sent a 6-digit code to{" "}
              <span className="font-medium text-[#1b1b1b]">{email}</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#aaa] transition-colors hover:text-[#1b1b1b]"
          >
            <X className="h-[20px] w-[20px]" />
          </button>
        </div>

        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOtp}
          containerClassName="gap-[12px] w-full"
        >
          <InputOTPGroup className="gap-[12px] w-full">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <InputOTPSlot
                key={i}
                index={i}
                className="h-[60px] flex-1 rounded-[8px] border-0 bg-[#f5f5f5] text-[18px] font-medium text-[#1b1b1b] shadow-none data-[active=true]:ring-2 data-[active=true]:ring-[#1ca95c]"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>

        <button
          type="button"
          onClick={handleVerify}
          disabled={otp.length < 6 || submitting}
          className="flex h-[50px] w-full items-center justify-center rounded-[8px] text-[15px] font-medium transition-opacity disabled:cursor-not-allowed disabled:bg-[#eee] disabled:text-[#888] enabled:bg-[#1ca95c] enabled:text-white enabled:hover:opacity-90"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying…
            </>
          ) : (
            "Verify email"
          )}
        </button>
      </div>
    </div>
  );
}
