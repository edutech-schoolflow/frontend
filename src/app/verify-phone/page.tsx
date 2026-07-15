"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import VerifyPhone from "@/src/components/auth/VerifyPhone";

function Inner() {
  const params = useSearchParams();
  return (
    <VerifyPhone phone={params.get("phone") ?? ""} next={params.get("next")} />
  );
}

export default function VerifyPhonePage() {
  return (
    <Suspense fallback={null}>
      <Inner />
    </Suspense>
  );
}
