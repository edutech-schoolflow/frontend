import { redirect } from "next/navigation";

// /home is retired: the identity home is /parent/dashboard (EDD-002 — the parent dashboard IS the
// identity's home, guarded by the identity session). This redirect keeps any lingering links working.
export default function HomePage() {
  redirect("/parent/dashboard");
}
