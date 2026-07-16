import { redirect } from "next/navigation";

// The "parent portal" is gone (FE-001 Phase 2.5): the family shell lives at /family and the
// identity launcher at /dashboard. This address survives only for stale bookmarks.
export default function LegacyParentRedirect() {
  redirect("/dashboard");
}
