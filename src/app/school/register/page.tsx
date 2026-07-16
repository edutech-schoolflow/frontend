import { redirect } from "next/navigation";

// Creating a school is ONBOARDING, not registration — the account comes first (/welcome).
export default function LegacySchoolRegisterRedirect() {
  redirect("/dashboard");
}
