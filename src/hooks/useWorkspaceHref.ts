"use client";

import { useCallback } from "react";
import { usePathname } from "next/navigation";

/**
 * FE-001 Phase 2 rename: dashboard views live at /o/{slug}/<subpath> and the legacy
 * /school/dashboard and /staff/dashboard routes are gone. Nav definitions still name paths in
 * their legacy form (a stable "route key"); this hook grafts them onto the current workspace at
 * render time: "/staff/dashboard/grades" → "/o/{slug}/grades". Outside a workspace it returns
 * the path unchanged (where the bookmark redirect will hand off to /select-context).
 */
export function useWorkspaceHref(): (path: string) => string {
  const pathname = usePathname();
  const base = pathname.match(/^\/o\/[^/]+/)?.[0];

  return useCallback(
    (path: string) =>
      base ? path.replace(/^\/(school|staff)\/dashboard/, base) : path,
    [base]
  );
}
