"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import AuthShell, { AUTH_INPUT, AUTH_LABEL, AUTH_BUTTON } from "./AuthShell";
import {
  loginIdentity,
  dashboardFor,
  type AuthContext,
} from "@/src/lib/api/identityAuth";



/**
 * The ONE login (EDD-001). Phone + password authenticate the person; their organization
 * relationships decide where they land. One context → straight in; several → pick below.
 */
export default function UnifiedLogin() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  function routeAfter(outcome: { contexts: AuthContext[]; selected: string | null }) {
    const selected = outcome.contexts.find((c) => c.id === outcome.selected);
    // A pending destination (e.g. /welcome deep-link) wins over the context's home.
    router.push(next ?? (selected ? dashboardFor(selected.type) : "/welcome"));
  }

  async function handleLogin() {
    setBusy(true);
    try {
      const outcome = await loginIdentity({ phone, password });
      if (outcome.selected) {
        toast.success(outcome.message);
        routeAfter(outcome);
        return;
      }
      if (outcome.contexts.length === 0) {
        // Authenticated, no relationships yet — the identity session is set; onboard.
        router.push(next ?? "/welcome");
        return;
      }
      // Several — the identity session is set; the standalone chooser takes over (FE-001).
      router.push(next ? `/select-context?next=${encodeURIComponent(next)}` : "/select-context");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not log in.");
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
              <h2 className="text-[24px] font-medium text-[#1b1b1b]">Welcome back</h2>
              <p className="mt-[6px] text-[15px] text-[#666]">
                One account for everything — your school, your work, your children.
              </p>
            </div>

            <form
              className="mt-[14px] flex flex-col gap-[17px]"
              onSubmit={(e) => {
                e.preventDefault();
                void handleLogin();
              }}
            >
              <div className="flex flex-col gap-[6px]">
                <label className={AUTH_LABEL}>Phone number</label>
                <input
                  className={AUTH_INPUT}
                  placeholder="e.g. 08012345678"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ""))}
                />
              </div>

              <div className="flex flex-col gap-[6px]">
                <label className={AUTH_LABEL}>Password</label>
                <input
                  className={AUTH_INPUT}
                  placeholder="Type it here"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="flex justify-center">
                <Link
                  href="/forgot-password"
                  className="text-[14px] text-brand-green underline hover:opacity-80"
                >
                  I&apos;ve forgotten my password
                </Link>
              </div>

              <button type="submit" disabled={busy || !phone || !password} className={AUTH_BUTTON}>
                {busy ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Logging in…
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>


            <p className="mt-[10px] text-center text-[14px] text-[#666]">
              New to SchoolFlow?{" "}
              <Link href={next ? `/register?next=${encodeURIComponent(next)}` : "/register"} className="font-medium text-brand-green underline hover:opacity-80">
                Create an account
              </Link>
            </p>
          </div>
        )}
      </div>
    </AuthShell>
  );
}
