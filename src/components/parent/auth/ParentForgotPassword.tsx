"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { z } from "zod";

import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";
import { forgotPassword, verifyForgotPasswordOtp } from "@/src/lib/api/parents";

const schema = z.object({
  email: z.email("Enter a valid email address"),
});

type Values = z.infer<typeof schema>;

type Step = "email" | "otp";

const AUTH_INPUT =
  "h-[46px] w-full rounded-[10px] border border-[#ccc] bg-white px-[17px] text-[14px] text-[#1b1b1b] placeholder:text-[#aaa] pr-10 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none outline-none";
const AUTH_LABEL = "text-[14px] font-normal text-[#666]";
const RESEND_SECONDS = 60;

export default function ParentForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [sentEmail, setSentEmail] = useState("");

  // OTP state
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const [error, setError] = useState("");

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { email: "" },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = form;

  // Countdown for resend
  useEffect(() => {
    if (step !== "otp" || countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [step, countdown]);

  const onSubmitEmail = async (values: Values) => {
    await forgotPassword(values.email);
    setSentEmail(values.email);
    setOtp("");
    setCountdown(RESEND_SECONDS);
    setError("");
    setStep("otp");
  };

  const handleContinue = async () => {
    if (otp.length < 6) return;
    setError("");
    setSubmitting(true);
    try {
      await verifyForgotPasswordOtp({ email: sentEmail, otp });
      router.push("/parent/reset-password");
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
      await forgotPassword(sentEmail);
      setCountdown(RESEND_SECONDS);
      setOtp("");
    } finally {
      setResending(false);
    }
  };

  return (
    <div
      className="h-screen"
      style={{ display: "grid", gridTemplateColumns: "710px 1fr" }}
    >
      {/* Left — green photo panel */}
      <div className="relative overflow-hidden bg-brand-green">
        <Link
          href="/"
          className="absolute left-[100px] top-[57px] z-10 text-[16px] font-normal text-black"
        >
          SchoolFlow
        </Link>
        <Image
          src="/images/svg/parentchildscreen.svg"
          alt="Parent and child"
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Right — white panel */}
      <div className="relative overflow-y-auto bg-white">
        {/* Close */}
        <button
          onClick={() => router.push("/")}
          className="absolute right-8 top-8 flex h-8 w-8 items-center justify-center rounded-full text-text-body transition-colors hover:bg-surface-subtle"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          className="flex flex-col py-14"
          style={{ paddingLeft: "105px", paddingRight: "99px" }}
        >
          {step === "email" ? (
            /* ── Step 1: Enter email ── */
            <div className="flex flex-col gap-[45px]">
              <div className="flex flex-col gap-[18px]">
                <h2 className="text-[24px] font-medium text-[#1b1b1b]">
                  Forgot your password?
                </h2>
                <p className="text-[14px] font-normal text-[#666]">
                  Enter your email address and we&apos;ll send you a code to
                  reset your password.
                </p>
              </div>

              <Form {...form}>
                <form
                  onSubmit={handleSubmit(onSubmitEmail)}
                  className="flex flex-col gap-[13px]"
                >
                  <FormInput
                    name="email"
                    label="Email"
                    placeholder="Type it here"
                    type="email"
                    inputClassName={AUTH_INPUT}
                    labelClassName={AUTH_LABEL}
                  />

                  <button
                    type="submit"
                    disabled={!isValid || isSubmitting}
                    className="flex h-[59px] w-full items-center justify-center rounded-[5px] text-[20px] font-normal transition-colors
                      disabled:cursor-not-allowed disabled:bg-[#eee] disabled:text-[#888]
                      enabled:bg-brand-green enabled:text-white enabled:hover:opacity-90"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending…
                      </>
                    ) : (
                      "Send code"
                    )}
                  </button>

                  <div className="flex justify-center">
                    <Link
                      href="/parent/login"
                      className="text-[14px] text-brand-green underline hover:opacity-80"
                    >
                      Back to login
                    </Link>
                  </div>
                </form>
              </Form>
            </div>
          ) : (
            /* ── Step 2: Enter OTP ── */
            <div className="flex flex-col gap-[45px]">
              <div className="flex flex-col gap-[48px]">
                {/* Header */}
                <div className="flex flex-col gap-[18px]">
                  <h2 className="text-[24px] font-medium text-[#1b1b1b]">
                    Forgot password
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

                  {error && (
                    <p className="w-full text-xs text-red-500">{error}</p>
                  )}

                  <p className="text-[14px] font-normal text-[#1b1b1b] text-center">
                    I didn&apos;t receive the code.{" "}
                    {countdown > 0 ? (
                      <span className="text-[#888]">
                        Resend in {countdown}s
                      </span>
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

              {/* Continue button */}
              <button
                type="button"
                onClick={handleContinue}
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
                  "Continue"
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
