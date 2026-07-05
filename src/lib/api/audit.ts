import { apiGet } from "./client";

export interface AuditEntry {
  id: string;
  actorUserId?: string | null;
  actorType?: string | null; // school | staff | system
  action: string; // dotted, e.g. application.admitted
  entityType?: string | null; // application | student | ...
  entityId?: string | null;
  summary: string;
  createdAt: string;
}

export async function getAuditLog(params: {
  entityType?: string;
  page?: number;
  limit?: number;
}): Promise<AuditEntry[]> {
  const qs = new URLSearchParams();
  if (params.entityType) qs.set("entityType", params.entityType);
  qs.set("page", String(params.page ?? 1));
  qs.set("limit", String(params.limit ?? 50));
  const { data } = await apiGet<AuditEntry[]>(`/school/audit-log?${qs.toString()}`);
  return data;
}
