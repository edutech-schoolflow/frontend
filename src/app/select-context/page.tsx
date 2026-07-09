"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import AuthShell from "@/src/components/auth/AuthShell";
import ContextPicker from "@/src/components/auth/ContextPicker";
import {
  getIdentityMe,
  selectContext,
  dashboardFor,
  type IdentityMe,
} from "@/src/lib/api/identityAuth";

/**
 * FE-001: the workspace chooser — reachable after login AND any time while signed in (switching).
 * One identity, many organizations; the backend re-mints the session for the chosen context.
 */
function Inner() {
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [me, setMe] = useState<IdentityMe | null | undefined>(undefined);
  const [enteringId, setEnteringId] = useState<string | null>(null);

  useEffect(() => {
    getIdentityMe()
      .then((m) => {
        if (m.contexts.length === 0) router.replace("/welcome");
        else setMe(m);
      })
      .catch(() => router.replace("/login?next=/select-context"));
  }, [router]);

  async function handleSelect(contextId: string) {
    setEnteringId(contextId);
    try {
      const outcome = await selectContext(contextId);
      toast.success(outcome.message);
      const selected = outcome.contexts.find((c) => c.id === outcome.selected);
      router.push(next ?? (selected ? dashboardFor(selected.type) : "/welcome"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not enter.");
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
          <div className="flex flex-col gap-[18px]">
            <div>
              <h2 className="text-[24px] font-medium text-[#1b1b1b]">Choose where to go</h2>
              <p className="mt-[6px] text-[15px] text-[#666]">
                Your account belongs to more than one place.
              </p>
            </div>
            <div className="mt-[10px]">
              <ContextPicker contexts={me.contexts} enteringId={enteringId} onSelect={(id) => void handleSelect(id)} />
            </div>

            <p className="mt-[6px] text-center text-[14px] text-[#666]">
              Looking for something new?{" "}
              <Link href="/welcome" className="font-medium text-brand-green underline hover:opacity-80">
                Create a school
              </Link>{" "}
              ·{" "}
              <Link href="/join" className="font-medium text-brand-green underline hover:opacity-80">
                Join with an invite
              </Link>
            </p>
          </div>
        )}
      </div>
    </AuthShell>
  );
}

export default function SelectContextPage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
