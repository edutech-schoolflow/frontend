"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthShell, { AUTH_BUTTON } from "./AuthShell";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";
import { verifyIdentityPhone, resendIdentityOtp } from "@/src/lib/api/identityAuth";

/** FE-001: standalone phone verification — one step of the identity journey, one route. */
export default function VerifyPhone({ phone, next }: { phone: string; next: string | null }) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);

  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";

  async function handleVerify() {
    if (otp.length !== 6) return;
    setBusy(true);
    try {
      toast.success(await verifyIdentityPhone(phone, otp));
      router.push(loginHref);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The code didn't work.");
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    try {
      toast.info(await resendIdentityOtp(phone));
      setOtp("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not resend the code.");
    }
  }

  return (
    <AuthShell>
      <div className="mx-auto w-full max-w-[526px] lg:mx-0">
        <div className="flex flex-col gap-[45px]">
          <div className="flex flex-col gap-[18px]">
            <h2 className="text-[24px] font-medium text-[#1b1b1b]">Verify your phone number</h2>
            <p className="text-[16px] font-medium text-[#1b1b1b]">
              We&apos;ve sent a 6-digit code to{" "}
              <span className="text-brand-green">{phone || "your phone"}</span>. Enter it below.
            </p>

            <div className="flex w-full max-w-[448px] flex-col items-center gap-[19px]">
              <InputOTP maxLength={6} value={otp} onChange={setOtp} containerClassName="gap-[12px] w-full">
                <InputOTPGroup className="gap-[12px]">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <InputOTPSlot
                      key={i}
                      index={i}
                      className="h-[64px] w-[52px] rounded-[5px] border-0 bg-[#eee] text-[16px] font-medium text-[#1b1b1b] shadow-none data-[active=true]:ring-2 data-[active=true]:ring-brand-green"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <p className="text-center text-[14px] text-[#1b1b1b]">
                I didn&apos;t receive the code.{" "}
                <button
                  type="button"
                  onClick={() => void handleResend()}
                  className="text-brand-green underline hover:opacity-80"
                >
                  Resend
                </button>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => void handleVerify()}
            disabled={otp.length !== 6 || busy}
            className={AUTH_BUTTON}
          >
            {busy ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Verifying…
              </>
            ) : (
              "Verify"
            )}
          </button>
        </div>
      </div>
    </AuthShell>
  );
}
