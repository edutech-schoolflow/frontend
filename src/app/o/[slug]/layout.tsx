"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { getWorkspace, type Workspace } from "@/src/lib/api/organizations";
import { WorkspaceProvider } from "@/src/context/WorkspaceContext";
import { ApiError } from "@/src/lib/api/client";

/**
 * FE-001 Phase 2 — the workspace shell. Resolves the slug against the signed-in identity (the
 * backend 404s if the slug is unknown or isn't theirs), then hands the workspace to every page
 * beneath it via WorkspaceProvider. Access control is the resolve call itself: no membership, no
 * workspace.
 */
type State = { status: "loading" } | { status: "ready"; workspace: Workspace };

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const slug = String(useParams().slug ?? "");
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;

    getWorkspace(slug)
      .then((workspace) => {
        if (!cancelled) setState({ status: "ready", workspace });
      })
      .catch((err) => {
        if (cancelled) return;
        const code = err instanceof ApiError ? err.statusCode : undefined;
        // 401 → not signed in (come back here after login); anything else (404 unknown/not-mine)
        // → let them pick a workspace they do belong to.
        if (code === 401) {
          router.replace(`/login?next=${encodeURIComponent(`/o/${slug}`)}`);
        } else {
          router.replace("/select-context");
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug, router]);

  if (state.status !== "ready") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <WorkspaceProvider workspace={state.workspace}>
      {children}
    </WorkspaceProvider>
  );
}
