import type { Metadata } from "next";
import { Suspense } from "react";
import UnifiedRegister from "@/src/components/auth/UnifiedRegister";

export const metadata: Metadata = {
  title: "Create your account — SchoolFlow",
  description: "One registration for everyone. Roles come from your schools.",
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <UnifiedRegister />
    </Suspense>
  );
}
