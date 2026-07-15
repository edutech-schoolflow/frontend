"use client";

import { useQuery } from "@tanstack/react-query";
import { getIdentityMe, type IdentityMe } from "./identityAuth";

export const identityMeKey = ["identity", "me"] as const;

/**
 * The signed-in person, from GET /auth/me — the ONE source for names/greetings in every shell
 * (EDD-005: no mock identities, no per-portal user stores). Cached and shared across consumers.
 */
export function useIdentity() {
  return useQuery<IdentityMe>({
    queryKey: identityMeKey,
    queryFn: getIdentityMe,
    retry: false,
    staleTime: 60_000,
  });
}
