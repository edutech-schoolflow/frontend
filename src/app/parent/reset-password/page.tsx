import { Suspense } from "react";
import ParentResetPassword from "@/src/components/parent/auth/ParentResetPassword";

export default function ParentResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ParentResetPassword />
    </Suspense>
  );
}
