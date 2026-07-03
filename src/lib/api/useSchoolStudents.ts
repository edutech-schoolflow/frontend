import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStudents, createStudent, promoteStudents } from "./schoolStudents";

export const studentsKey = ["school", "students"] as const;

export function useStudents(params?: { status?: "active" | "withdrawn" }) {
  return useQuery({
    queryKey: [...studentsKey, params?.status ?? "active"],
    queryFn: () =>
      getStudents({ status: params?.status ?? "active", limit: 500 }),
    staleTime: 30_000,
  });
}

export function useCreateStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createStudent,
    onSuccess: () => qc.invalidateQueries({ queryKey: studentsKey }),
  });
}

export function usePromoteStudents() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: promoteStudents,
    onSuccess: () => qc.invalidateQueries({ queryKey: studentsKey }),
  });
}
