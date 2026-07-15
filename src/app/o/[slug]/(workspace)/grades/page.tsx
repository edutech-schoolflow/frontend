"use client";

import { useWorkspace } from "@/src/context/WorkspaceContext";
import OwnerView from "@/src/views/school/grades/page";
import StaffView from "@/src/views/staff/grades/page";

// Shared workspace path — same URL, view depends on the caller's context.
export default function Page() {
  return useWorkspace().myContext.type === "staff" ? (
    <StaffView />
  ) : (
    <OwnerView />
  );
}
