"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSchoolMe } from "@/src/lib/api/useSchoolAuth";
import { useAppDispatch } from "@/src/lib/store/hooks";
import { setSchoolUser, clearAuth } from "@/src/lib/store/authSlice";

export default function SchoolOwnerGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: user, isPending, isError } = useSchoolMe();

  // Mirror the server session into Redux so the rest of the portal reads it from the store.
  useEffect(() => {
    if (user) dispatch(setSchoolUser(user));
  }, [user, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(clearAuth());
      router.replace("/login");
    }
  }, [isError, dispatch, router]);

  if (isPending || isError || !user) return null;

  return <>{children}</>;
}
