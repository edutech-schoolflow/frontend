import { redirect } from "next/navigation";

// One registration for everyone — roles come from relationships, not from the sign-up page.
export default function LegacyRegisterRedirect() {
  redirect("/register");
}
