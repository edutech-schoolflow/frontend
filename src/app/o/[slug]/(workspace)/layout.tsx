"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import SchoolSidebar from "@/src/components/school/layout/SchoolSidebar";
import SchoolTopbar from "@/src/components/school/layout/SchoolTopbar";
import StaffSidebar from "@/src/components/teacher/dashboard/layout/TeacherSidebar";
import StaffTopbar from "@/src/components/teacher/dashboard/layout/TeacherTopbar";
import ParentWorkspaceSidebar from "@/src/components/parent/workspace/ParentWorkspaceSidebar";
import { StaffFeaturesProvider } from "@/src/context/StaffFeaturesContext";
import { useWorkspace } from "@/src/context/WorkspaceContext";

/**
 * The workspace chrome (FE-001 Phase 2). The shell already resolved the org and proved membership;
 * this picks the sidebar/topbar for the caller's context — owner and staff share the same /o/{slug}
 * URLs, and each page renders the matching view. Owner-only rule: an unnamed org goes to setup first.
 */
export default function WorkspaceChromeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const ws = useWorkspace();
  const base = `/o/${ws.slug}`;
  const type = ws.myContext.type;

  const ownerNeedsSetup = type === "owner" && ws.name == null;
  const unsupported = type !== "owner" && type !== "staff" && type !== "parent";

  useEffect(() => {
    if (unsupported) router.replace("/select-context");
    else if (ownerNeedsSetup) router.replace(`${base}/setup`);
  }, [unsupported, ownerNeedsSetup, base, router]);

  if (unsupported || ownerNeedsSetup) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    );
  }

  if (type === "staff") {
    return (
      <StaffFeaturesProvider>
        <div className="flex h-screen overflow-hidden">
          <StaffSidebar basePath={base} />
          <div className="flex flex-1 flex-col overflow-hidden">
            <StaffTopbar basePath={base} />
            <main className="flex-1 overflow-y-auto bg-white">{children}</main>
          </div>
        </div>
      </StaffFeaturesProvider>
    );
  }

  if (type === "parent") {
    return (
      <div className="flex h-screen overflow-hidden">
        <ParentWorkspaceSidebar basePath={base} />
        <main className="flex-1 overflow-y-auto bg-surface-muted px-[32px] py-[28px]">
          {children}
        </main>
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
