"use client";

import { useWorkspace } from "@/src/context/WorkspaceContext";
import OwnerView from "@/src/views/school/page";
import StaffView from "@/src/views/staff/page";
import ParentView from "@/src/components/parent/workspace/ParentWorkspaceHome";

// Shared workspace path — same URL, view depends on the caller's context.
export default function Page() {
  const type = useWorkspace().myContext.type;
  if (type === "staff") return <StaffView />;
  if (type === "parent") return <ParentView />;
  return <OwnerView />;
}
