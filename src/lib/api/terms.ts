import { apiGet, apiPost, apiPut, apiDelete } from "./client";

export type TermName = "first" | "second" | "third";

export interface AcademicYear {
  id: string;
  name: string;
  startYear: number;
  endYear: number;
  isCurrent: boolean;
}

export interface Term {
  id: string;
  academicYearId: string;
  name: TermName;
  season?: string; // Winter | Spring | Summer (display label from backend)
  startDate?: string | null;
  endDate?: string | null;
  isCurrent: boolean;
}

interface TermResponse {
  id: string;
  academicYearId: string;
  name: TermName;
  season?: string;
  startDate?: string | null;
  endDate?: string | null;
  isCurrent: boolean;
}

const TERM_LABELS: Record<TermName, string> = {
  first: "First Term",
  second: "Second Term",
  third: "Third Term",
};

export function termLabel(name: TermName): string {
  return TERM_LABELS[name] ?? name;
}

export async function getTerms(academicYearId?: string): Promise<Term[]> {
  const qs = academicYearId ? `?academicYearId=${academicYearId}` : "";
  const { data } = await apiGet<TermResponse[]>(`/terms${qs}`);
  return data;
}

// ── academic years ──────────────────────────────────────────────────────────

export async function getAcademicYears(): Promise<AcademicYear[]> {
  const { data } = await apiGet<AcademicYear[]>("/academic-years");
  return data;
}

export async function createAcademicYear(
  startYear: number,
  endYear: number
): Promise<AcademicYear> {
  const { data } = await apiPost<AcademicYear>("/academic-years", {
    startYear,
    endYear,
  });
  return data;
}

export async function setCurrentYear(yearId: string): Promise<void> {
  await apiPut<null>(`/academic-years/${yearId}/current`, {});
}

export async function renameAcademicYear(
  yearId: string,
  startYear: number,
  endYear: number
): Promise<void> {
  await apiPut<null>(`/academic-years/${yearId}`, {
    startYear,
    endYear,
  });
}

export async function deleteAcademicYear(yearId: string): Promise<void> {
  await apiDelete<null>(`/academic-years/${yearId}`);
}

// ── term writes ─────────────────────────────────────────────────────────────

export interface CreateTermInput {
  academicYearId: string;
  name: TermName;
  startDate?: string | null;
  endDate?: string | null;
}

export async function createTerm(input: CreateTermInput): Promise<Term> {
  const { data } = await apiPost<TermResponse>("/terms", {
    academicYearId: input.academicYearId,
    name: input.name,
    startDate: input.startDate ?? null,
    endDate: input.endDate ?? null,
  });
  return data;
}

export async function setCurrentTerm(termId: string): Promise<void> {
  await apiPut<null>(`/terms/${termId}/current`, {});
}

export async function updateTermDates(
  termId: string,
  startDate: string | null,
  endDate: string | null
): Promise<void> {
  await apiPut<null>(`/terms/${termId}`, { startDate, endDate });
}

export async function deleteTerm(termId: string): Promise<void> {
  await apiDelete<null>(`/terms/${termId}`);
}
