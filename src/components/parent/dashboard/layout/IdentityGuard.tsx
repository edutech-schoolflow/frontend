"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getIdentityMe, type IdentityMe } from "@/src/lib/api/identityAuth";

/**
 * Authorizes IDENTITY pages (the parent home, discovery, applications, account) with the identity
 * session — not a parent/workspace token (EDD-002 rule: identity pages ← Identity Session; org pages
 * ← Workspace Session). Probes GET /auth/me; a 401 (after the client's silent refresh) → login. The
 * home renders for any signed-in identity, with or without a parent relationship yet.
 */
export default function IdentityGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [me, setMe] = useState<IdentityMe | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    getIdentityMe()
      .then((m) => !cancelled && setMe(m))
      .catch(() => {
        if (!cancelled) {
          setMe(null);
          router.replace("/login");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (me === undefined) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  if (me === null) return null;

  return <>{children}</>;
}
