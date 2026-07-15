import { redirect } from "next/navigation";

// Legacy portal entry — everyone now signs in through the unified door (EDD-001).
export default function LegacyRedirect() {
  redirect("/forgot-password");
}
