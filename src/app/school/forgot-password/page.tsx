"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { toast } from "sonner";

import SchoolAuthLayout from "@/src/layout/auth/SchoolAuthLayout";
import { Form } from "@/src/components/ui/form";
import FormInput from "@/src/components/ui/formInput";
import FormButton from "@/src/components/ui/formButton";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";
import { forgotPasswordSchema } from "@/src/lib/api/schoolAuth";
import {
  useForgotPassword,
  useResetPassword,
} from "@/src/lib/api/useSchoolAuth";

type RequestInput = z.infer<typeof forgotPasswordSchema>;

const RESEND_SECONDS = 60;

export default function SchoolForgotPasswordPage() {
  const [phone, setPhone] = useState<string | null>(null);

  return (
    <SchoolAuthLayout
      title={phone ? "Reset your password" : "Forgot password"}
      subtitle={
        phone
          ? "Enter the code we sent and choose a new password"
          : "We'll send a reset code to your phone"
      }
    >
      {phone ? (
        <ResetStep phone={phone} onBack={() => setPhone(null)} />
      ) : (
        <RequestStep onSent={setPhone} />
      )}
    </SchoolAuthLayout>
  );
}

function RequestStep({ onSent }: { onSent: (phone: string) => void }) {
  const forgot = useForgotPassword();
  const form = useForm<RequestInput>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: "onTouched",
    defaultValues: { phone: "" },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  const onSubmit = async (values: RequestInput) => {
    try {
      await forgot.mutateAsync(values.phone);
      // Backend responds generically ("if that account exists…") — always advance.
      toast.success("If that account exists, we sent a reset code.");
      onSent(values.phone);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send code.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FormInput
          name="phone"
          label="Phone number"
          placeholder="e.g. 08012345678"
          type="tel"
        />
        <FormButton
          text="Send reset code"
          loadingText="Sending…"
          loading={forgot.isPending}
          disabled={!isValid || forgot.isPending}
          className="mt-2! w-full bg-brand-green hover:bg-brand-green/90"
        />
      </form>
      <p className="mt-6 text-center text-sm text-text-body">
        Remembered it?{" "}
        <Link
          href="/school/login"
          className="font-medium text-brand-green hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </Form>
  );
}

const passwordSchema = z
  .object({
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordInput = z.infer<typeof passwordSchema>;

function ResetStep({ phone, onBack }: { phone: string; onBack: () => void }) {
  const router = useRouter();
  const reset = useResetPassword();
  const forgot = useForgotPassword();
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(RESEND_SECONDS);

  const form = useForm<PasswordInput>({
    resolver: zodResolver(passwordSchema),
    mode: "onTouched",
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  const {
    handleSubmit,
    formState: { isValid },
  } = form;

  useEffect(() => {
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(t);
  }, [countdown]);

  const onSubmit = async (values: PasswordInput) => {
    if (code.length < 6) {
      toast.error("Enter the 6-digit code.");
      return;
    }
    try {
      await reset.mutateAsync({
        phone,
        code,
        newPassword: values.newPassword,
      });
      toast.success("Password reset. Please sign in.");
      router.push("/school/login");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Reset failed.");
    }
  };

  const handleResend = async () => {
    try {
      await forgot.mutateAsync(phone);
      setCountdown(RESEND_SECONDS);
      setCode("");
      toast.success("A new code is on its way.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend.");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <p className="text-sm text-text-body">
          Code sent to{" "}
          <span className="font-medium text-text-heading">{phone}</span>.
        </p>

        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {Array.from({ length: 6 }).map((_, i) => (
                <InputOTPSlot key={i} index={i} className="h-11 w-11" />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <FormInput
          name="newPassword"
          label="New password"
          placeholder="At least 8 characters"
          type="password"
        />
        <FormInput
          name="confirmPassword"
          label="Confirm password"
          placeholder="Re-enter your password"
          type="password"
        />

        <FormButton
          text="Reset password"
          loadingText="Resetting…"
          loading={reset.isPending}
          disabled={!isValid || code.length < 6 || reset.isPending}
          className="mt-1! w-full bg-brand-green hover:bg-brand-green/90"
        />
      </form>

      <div className="mt-5 flex items-center justify-between text-sm">
        <button
          onClick={onBack}
          className="text-text-body hover:text-text-heading"
        >
          ← Change number
        </button>
        <button
          onClick={handleResend}
          disabled={countdown > 0 || forgot.isPending}
          className="font-medium text-brand-green hover:underline disabled:text-grey-text disabled:no-underline"
        >
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
        </button>
      </div>
    </Form>
  );
}
