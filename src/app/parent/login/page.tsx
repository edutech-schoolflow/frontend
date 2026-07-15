import { redirect } from "next/navigation";

// Identity-first routing (EDD-001): nobody is a school/staff/parent until AFTER they have an
// identity — so there is exactly one login. This legacy address just forwards to it.
export default function LegacyLoginRedirect() {
  redirect("/login");
}
