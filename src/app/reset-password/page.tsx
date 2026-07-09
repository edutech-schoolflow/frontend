"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UnifiedResetPassword } from "@/src/components/auth/UnifiedPasswordReset";

function ResetInner() {
  const phone = useSearchParams().get("phone") ?? "";
  return <UnifiedResetPassword phone={phone} />;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetInner />
    </Suspense>
  );
}
