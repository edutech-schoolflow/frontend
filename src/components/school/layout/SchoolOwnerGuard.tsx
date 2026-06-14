"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/context/AuthContext";

export default function SchoolOwnerGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user?.isOwner) {
      router.replace("/school/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user?.isOwner) return null;

  return <>{children}</>;
}
