import { useQuery } from "@tanstack/react-query";
import { getAuditLog } from "./audit";

export const auditKey = (entityType: string, limit: number) =>
  ["school", "audit-log", entityType, limit] as const;

export function useAuditLog(params: { entityType?: string; limit?: number }) {
  const entityType = params.entityType ?? "all";
  const limit = params.limit ?? 50;
  return useQuery({
    queryKey: auditKey(entityType, limit),
    queryFn: () =>
      getAuditLog({
        entityType: entityType === "all" ? undefined : entityType,
        page: 1,
        limit,
      }),
    staleTime: 10_000,
  });
}
