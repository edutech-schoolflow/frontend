"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParentMe } from "@/src/lib/api/useParentAuth";
import { useAppDispatch } from "@/src/lib/store/hooks";
import { setParentUser, clearParentAuth } from "@/src/lib/store/parentAuthSlice";

/**
 * Probes /parent/auth/me. On success it hydrates Redux; on a 401 (after the client's silent refresh
 * attempt) it redirects to login. Nothing renders until we know the parent is authenticated.
 */
export default function ParentAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isPending, isError } = useParentMe();

  useEffect(() => {
    if (data) dispatch(setParentUser(data));
  }, [data, dispatch]);

  useEffect(() => {
    if (isError) {
      dispatch(clearParentAuth());
      router.replace("/parent/login");
    }
  }, [isError, dispatch, router]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  if (isError || !data) return null;

  return <>{children}</>;
}
