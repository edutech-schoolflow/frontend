import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getTerms,
  getAcademicYears,
  createAcademicYear,
  setCurrentYear,
  renameAcademicYear,
  deleteAcademicYear,
  createTerm,
  setCurrentTerm,
  updateTermDates,
  deleteTerm,
  type CreateTermInput,
} from "./terms";

export const termsKey = ["school", "terms"] as const;
export const academicYearsKey = ["school", "academic-years"] as const;

export function useTerms(academicYearId?: string) {
  return useQuery({
    queryKey: [...termsKey, academicYearId ?? "all"],
    queryFn: () => getTerms(academicYearId),
    staleTime: 60_000,
  });
}

export function useAcademicYears() {
  return useQuery({
    queryKey: academicYearsKey,
    queryFn: getAcademicYears,
    staleTime: 60_000,
  });
}

// Any calendar change can flip the current year/term, so refresh both lists.
function useCalendarMutation<TVars>(fn: (vars: TVars) => Promise<unknown>) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: academicYearsKey });
      qc.invalidateQueries({ queryKey: termsKey });
    },
  });
}

export function useCreateAcademicYear() {
  return useCalendarMutation((vars: {
    startYear: number;
    endYear: number;
  }) => createAcademicYear(vars.startYear, vars.endYear));
}

export function useSetCurrentYear() {
  return useCalendarMutation((yearId: string) => setCurrentYear(yearId));
}

export function useCreateTerm() {
  return useCalendarMutation((input: CreateTermInput) => createTerm(input));
}

export function useSetCurrentTerm() {
  return useCalendarMutation((termId: string) => setCurrentTerm(termId));
}

export function useRenameAcademicYear() {
  return useCalendarMutation((vars: {
    yearId: string;
    startYear: number;
    endYear: number;
  }) => renameAcademicYear(vars.yearId, vars.startYear, vars.endYear));
}

export function useDeleteAcademicYear() {
  return useCalendarMutation((yearId: string) => deleteAcademicYear(yearId));
}

export function useUpdateTermDates() {
  return useCalendarMutation(
    (vars: {
      termId: string;
      startDate: string | null;
      endDate: string | null;
    }) => updateTermDates(vars.termId, vars.startDate, vars.endDate)
  );
}

export function useDeleteTerm() {
  return useCalendarMutation((termId: string) => deleteTerm(termId));
}
