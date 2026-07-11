"use client";

import { useWorkspace } from "@/src/context/WorkspaceContext";
import OwnerView from "@/src/app/school/dashboard/classes/page";
import StaffView from "@/src/app/staff/dashboard/classes/page";

// Shared workspace path — same URL, view depends on the caller's context.
export default function Page() {
  return useWorkspace().myContext.type === "staff" ? (
    <StaffView />
  ) : (
    <OwnerView />
  );
}
