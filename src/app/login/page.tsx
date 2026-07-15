import type { Metadata } from "next";
import { Suspense } from "react";
import UnifiedLogin from "@/src/components/auth/UnifiedLogin";

export const metadata: Metadata = {
  title: "Log in — SchoolFlow",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <UnifiedLogin />
    </Suspense>
  );
}
