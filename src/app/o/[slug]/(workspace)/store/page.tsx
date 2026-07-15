"use client";

import { useWorkspace } from "@/src/context/WorkspaceContext";
import OwnerView from "@/src/views/school/store/page";
import StaffView from "@/src/views/staff/store/page";

// Shared workspace path — same URL, view depends on the caller's context.
export default function Page() {
  return useWorkspace().myContext.type === "staff" ? (
    <StaffView />
  ) : (
    <OwnerView />
  );
}
