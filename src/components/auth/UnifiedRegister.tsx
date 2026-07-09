"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthShell, { AUTH_INPUT, AUTH_LABEL, AUTH_BUTTON } from "./AuthShell";
import {
  identityRegisterSchema,
  registerIdentity,
} from "@/src/lib/api/identityAuth";

/**
 * The ONE registration (EDD-001): it creates an Identity — never a role. "Parent", "staff" or
 * "owner" come later, from relationships (a school links you, hires you, or you register one).
 */
export default function UnifiedRegister() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const loginHref = next ? `/login?next=${encodeURIComponent(next)}` : "/login";
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    password: "",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const parsed = identityRegisterSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Check the form.");
      return;
    }
    setBusy(true);
    try {
      toast.success(await registerIdentity(parsed.data));
      const qs = new URLSearchParams({ phone: form.phone });
      if (next) qs.set("next", next);
      router.push(`/verify-phone?${qs.toString()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create your account.");
    } finally {
      setBusy(false);
    }
  }



  return (
    <AuthShell>
      <div className="mx-auto w-full max-w-[526px] lg:mx-0">
        {(
          <div className="flex flex-col gap-[18px]">
            <div>
              <h2 className="text-[24px] font-medium text-[#1b1b1b]">Create your account</h2>
              <p className="mt-[6px] text-[15px] text-[#666]">
                One account for everything. What you can do comes from your schools — not from
                signing up.
              </p>
            </div>

            <form className="mt-[14px] flex flex-col gap-[17px]" onSubmit={handleRegister}>
              <div className="grid grid-cols-1 gap-[17px] sm:grid-cols-2">
                <div className="flex flex-col gap-[6px]">
                  <label className={AUTH_LABEL}>First name</label>
                  <input className={AUTH_INPUT} placeholder="e.g. Ada" value={form.firstName} onChange={set("firstName")} />
                </div>
                <div className="flex flex-col gap-[6px]">
                  <label className={AUTH_LABEL}>Last name</label>
                  <input className={AUTH_INPUT} placeholder="e.g. Obi" value={form.lastName} onChange={set("lastName")} />
                </div>
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className={AUTH_LABEL}>
                  Middle name <span className="text-[#aaa]">(optional)</span>
                </label>
                <input className={AUTH_INPUT} value={form.middleName} onChange={set("middleName")} />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className={AUTH_LABEL}>Phone number</label>
                <input
                  className={AUTH_INPUT}
                  placeholder="e.g. 08012345678"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value.replace(/[^\d+]/g, "") }))
                  }
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className={AUTH_LABEL}>
                  Email <span className="text-[#aaa]">(optional)</span>
                </label>
                <input className={AUTH_INPUT} type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className={AUTH_LABEL}>Set your password</label>
                <input
                  className={AUTH_INPUT}
                  type="password"
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={set("password")}
                />
              </div>

              <button type="submit" disabled={busy} className={`mt-[10px] ${AUTH_BUTTON}`}>
                {busy ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creating…
                  </>
                ) : (
                  "Create account"
                )}
              </button>
            </form>

            <p className="mt-[6px] text-center text-[14px] text-[#666]">
              Already have an account?{" "}
              <Link href={loginHref} className="font-medium text-brand-green underline hover:opacity-80">
                Log in
              </Link>
            </p>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
