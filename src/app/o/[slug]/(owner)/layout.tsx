"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import SchoolSidebar from "@/src/components/school/layout/SchoolSidebar";
import SchoolTopbar from "@/src/components/school/layout/SchoolTopbar";
import { useWorkspace } from "@/src/context/WorkspaceContext";

/**
 * The owner workspace chrome (FE-001 Phase 2). The parent shell already resolved the org and proved
 * membership, so this adds the owner sidebar/topbar (pointed at /o/{slug}) and enforces two rules:
 * only the owner context belongs here, and an unnamed org is sent to the setup wizard first.
 */
export default function OwnerWorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const ws = useWorkspace();
  const base = `/o/${ws.slug}`;

  const isOwner = ws.myContext.type === "owner";
  const needsSetup = ws.name == null;

  useEffect(() => {
    if (!isOwner) router.replace("/select-context");
    else if (needsSetup) router.replace(`${base}/setup`);
  }, [isOwner, needsSetup, base, router]);

  if (!isOwner || needsSetup) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <SchoolSidebar basePath={base} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <SchoolTopbar basePath={base} />
        <main className="flex-1 overflow-y-auto bg-surface-muted px-[32px] py-[28px]">
          {children}
        </main>
      </div>
    </div>
  );
}
