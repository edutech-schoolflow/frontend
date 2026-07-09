"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell, { AUTH_INPUT, AUTH_LABEL, AUTH_BUTTON } from "@/src/components/auth/AuthShell";
import InviteAcceptFlow from "@/src/components/staff/auth/InviteAcceptFlow";

/**
 * FE-001: /join — enter with an invitation. A link lands here with ?token=…; otherwise the person
 * pastes the invitation link or code their school sent them.
 */
function Inner() {
  const router = useRouter();
  const tokenParam = useSearchParams().get("token");
  const [raw, setRaw] = useState("");

  if (tokenParam) {
    return <InviteAcceptFlow token={tokenParam} />;
  }

  function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    // Accept either the bare code or a pasted full link containing ?token=…
    let token = raw.trim();
    try {
      const url = new URL(token);
      token = url.searchParams.get("token") ?? token;
    } catch {
      /* not a URL — treat as the code itself */
    }
    if (token) router.push(`/join?token=${encodeURIComponent(token)}`);
  }

  return (
    <AuthShell>
      <div className="mx-auto w-full max-w-[526px] lg:mx-0">
        <div className="flex flex-col gap-[18px]">
          <div>
            <h2 className="text-[24px] font-medium text-[#1b1b1b]">Join a school</h2>
            <p className="mt-[6px] text-[15px] text-[#666]">
              Paste the invitation link or code your school sent you.
            </p>
          </div>

          <form className="mt-[14px] flex flex-col gap-[17px]" onSubmit={handleContinue}>
            <div className="flex flex-col gap-[6px]">
              <label className={AUTH_LABEL}>Invitation link or code</label>
              <input
                className={AUTH_INPUT}
                placeholder="https://… or the code itself"
                value={raw}
                onChange={(e) => setRaw(e.target.value)}
              />
            </div>
            <button type="submit" disabled={!raw.trim()} className={`mt-[10px] ${AUTH_BUTTON}`}>
              Continue
            </button>
          </form>
        </div>
      </div>
    </AuthShell>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
