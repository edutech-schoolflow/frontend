import { redirect } from "next/navigation";

// FE-001 Phase 2: the staff workspace lives at /o/{slug}. This legacy address only survives for
// old bookmarks — the picker routes the person into the right workspace.
export default function LegacyStaffDashboardRedirect() {
  redirect("/select-context");
}
