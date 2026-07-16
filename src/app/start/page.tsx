import { redirect } from "next/navigation";

// FE-001: the onboarding hub lives at /welcome.
export default function StartRedirect() {
  redirect("/dashboard");
}
