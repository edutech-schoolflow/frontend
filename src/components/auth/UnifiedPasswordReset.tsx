"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthShell, { AUTH_INPUT, AUTH_LABEL, AUTH_BUTTON } from "./AuthShell";
import {
  forgotIdentityPassword,
  resetIdentityPassword,
} from "@/src/lib/api/identityAuth";

/** Step 1 — request the reset code (one flow for every account). */
export function UnifiedForgotPassword() {
  const router = useRouter();
  const loginHref = "/login";
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      toast.success(await forgotIdentityPassword(phone));
      router.push(`/reset-password?phone=${encodeURIComponent(phone)}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <div className="mx-auto w-full max-w-[526px] lg:mx-0">
        <div className="flex flex-col gap-[18px]">
          <div>
            <h2 className="text-[24px] font-medium text-[#1b1b1b]">
              Forgot your password?
            </h2>
            <p className="mt-[6px] text-[15px] text-[#666]">
              Enter your phone number and we&apos;ll text you a reset code.
            </p>
          </div>

          <form
            className="mt-[14px] flex flex-col gap-[17px]"
            onSubmit={submit}
          >
            <div className="flex flex-col gap-[6px]">
              <label className={AUTH_LABEL}>Phone number</label>
              <input
                className={AUTH_INPUT}
                placeholder="e.g. 08012345678"
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/[^\d+]/g, ""))
                }
              />
            </div>
            <button
              type="submit"
              disabled={busy || !phone}
              className={`mt-[10px] ${AUTH_BUTTON}`}
            >
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Sending…
                </>
              ) : (
                "Send reset code"
              )}
            </button>
          </form>

          <p className="mt-[6px] text-center text-[14px] text-[#666]">
            <Link
              href={loginHref}
              className="font-medium text-brand-green underline hover:opacity-80"
            >
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </AuthShell>
  );
}

/** Step 2 — code + new password. */
export function UnifiedResetPassword({ phone }: { phone: string }) {
  const router = useRouter();
  const loginHref = "/login";
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const mismatch = confirm.length > 0 && password !== confirm;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) {
      toast.error("Start again — we don't know which number to reset.");
      router.push("/forgot-password");
      return;
    }
    if (mismatch) return;
    setBusy(true);
    try {
      toast.success(
        await resetIdentityPassword({
          phone,
          code: code.trim(),
          newPassword: password,
        })
      );
      router.push(loginHref);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not reset your password."
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <div className="mx-auto w-full max-w-[526px] lg:mx-0">
        <div className="flex flex-col gap-[18px]">
          <div>
            <h2 className="text-[24px] font-medium text-[#1b1b1b]">
              Reset your password
            </h2>
            <p className="mt-[6px] text-[16px] font-medium text-[#1b1b1b]">
              Enter the code we sent{phone ? ` to ${phone}` : ""} and choose a
              new password.
            </p>
          </div>

          <form
            className="mt-[14px] flex flex-col gap-[17px]"
            onSubmit={submit}
          >
            <div className="flex flex-col gap-[6px]">
              <label className={AUTH_LABEL}>Verification code</label>
              <input
                className={AUTH_INPUT}
                inputMode="numeric"
                maxLength={6}
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className={AUTH_LABEL}>Set your password</label>
              <input
                className={AUTH_INPUT}
                type="password"
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-[6px]">
              <label className={AUTH_LABEL}>Retype your password</label>
              <input
                className={AUTH_INPUT}
                type="password"
                autoComplete="new-password"
                placeholder="Type it again"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
              {mismatch && (
                <p className="text-[13px] text-red-500">
                  Passwords do not match.
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={
                busy || code.length !== 6 || password.length < 8 || mismatch
              }
              className={`mt-[10px] ${AUTH_BUTTON}`}
            >
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Updating…
                </>
              ) : (
                "Reset password"
              )}
            </button>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}
