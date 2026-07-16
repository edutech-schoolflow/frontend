import { redirect } from "next/navigation";

// The onboarding hub grew into the Platform Home — /dashboard renders it from GET /identity/home.
export default function WelcomeRedirect() {
  redirect("/dashboard");
}
