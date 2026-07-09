"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, KeyRound, ArrowRight } from "lucide-react";
import AuthShell from "@/src/components/auth/AuthShell";
import ContextPicker from "@/src/components/auth/ContextPicker";
import { getIdentityMe, selectContext, dashboardFor, type IdentityMe } from "@/src/lib/api/identityAuth";

/**
 * FE-001: IDENTITY settings — global, organization-independent (name, phone, credentials).
 * Organization settings live inside each workspace. MFA/devices/sessions arrive post-MVP.
 */
export default function IdentitySettingsPage() {
  const router = useRouter();
  const [me, setMe] = useState<IdentityMe | null | undefined>(undefined);
  const [enteringId, setEnteringId] = useState<string | null>(null);

  useEffect(() => {
    getIdentityMe()
      .then(setMe)
      .catch(() => router.replace("/login?next=/settings"));
  }, [router]);

  async function handleSelect(contextId: string) {
    setEnteringId(contextId);
    const outcome = await selectContext(contextId).catch(() => null);
    if (outcome) {
      const selected = outcome.contexts.find((c) => c.id === outcome.selected);
      router.push(selected ? dashboardFor(selected.type) : "/welcome");
    } else {
      setEnteringId(null);
    }
  }

  return (
    <AuthShell>
      <div className="mx-auto w-full max-w-[526px] lg:mx-0">
        {me == null ? (
          <div className="flex justify-center py-[80px]">
            <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
          </div>
        ) : (
          <div className="flex flex-col gap-[24px]">
            <div>
              <h2 className="text-[24px] font-medium text-[#1b1b1b]">Account settings</h2>
              <p className="mt-[6px] text-[15px] text-[#666]">
                Your identity — the same everywhere, whichever school you&apos;re in.
              </p>
            </div>

            <div className="rounded-[12px] border border-[#e0e0e0] px-[20px] py-[18px]">
              <p className="text-[16px] font-medium text-[#1b1b1b]">{me.fullName}</p>
              <p className="mt-[4px] text-[14px] text-[#666]">{me.phone}</p>
              {me.email && <p className="text-[14px] text-[#666]">{me.email}</p>}
              <p className="mt-[6px] text-[12px] text-[#888]">
                Phone {me.phoneVerified ? "verified" : "not verified"}
                {me.profiles.length > 0 && ` · Profiles: ${me.profiles.join(", ")}`}
              </p>
            </div>

            <Link
              href="/forgot-password"
              className="flex items-center gap-[14px] rounded-[12px] border border-[#e0e0e0] px-[20px] py-[16px] transition-colors hover:border-brand-green hover:bg-[#f7fdf9]"
            >
              <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#e8f5ee]">
                <KeyRound className="h-[20px] w-[20px] text-brand-green" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-medium text-[#1b1b1b]">Change password</span>
                <span className="block text-[13px] text-[#888]">
                  We&apos;ll text a confirmation code to your phone.
                </span>
              </span>
              <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
            </Link>

            {me.contexts.length > 0 && (
              <div className="flex flex-col gap-[10px]">
                <p className="text-[14px] font-medium text-[#1b1b1b]">Your organizations</p>
                <ContextPicker
                  contexts={me.contexts}
                  enteringId={enteringId}
                  onSelect={(id) => void handleSelect(id)}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </AuthShell>
  );
}
