import { apiGet } from "./client";
import type { SchoolListing } from "@/src/types/school";

// ── backend shape (api/v1/family/schools) ──────────────────────────────────────

interface SchoolDirectoryItem {
  id: string;
  name: string;
  type?: string | null;
  location?: string | null;
  verified: boolean;
  applicationFee: number;
}

/** Public, listed schools a parent can apply to. */
export async function searchSchools(params?: {
  query?: string;
  type?: string;
}): Promise<SchoolListing[]> {
  const qs = new URLSearchParams();
  if (params?.query) qs.set("query", params.query);
  if (params?.type) qs.set("type", params.type);
  const suffix = qs.toString() ? `?${qs.toString()}` : "";

  const { data } = await apiGet<SchoolDirectoryItem[]>(
    `/family/schools${suffix}`
  );
  return (data ?? []).map(toListing);
}

function toListing(s: SchoolDirectoryItem): SchoolListing {
  return {
    id: s.id,
    name: s.name,
    location: s.location ?? "",
    type: s.type ?? "",
    applicationFee: s.applicationFee,
    rating: "—",
    verified: s.verified,
    isRecommended: false,
  };
}

/** A single public school's profile, or null if it isn't listed. */
export async function getSchoolById(id: string): Promise<SchoolListing | null> {
  try {
    const { data } = await apiGet<SchoolDirectoryItem>(`/family/schools/${id}`);
    return toListing(data);
  } catch {
    return null;
  }
}

export interface SchoolClass {
  name: string;
  stage: string; // snake_case level
  order: number;
}

/** The classes a public school offers (in ladder order) — the desired-class options when applying. */
export async function getSchoolClasses(id: string): Promise<SchoolClass[]> {
  const { data } = await apiGet<SchoolClass[]>(`/family/schools/${id}/classes`);
  return data ?? [];
}
