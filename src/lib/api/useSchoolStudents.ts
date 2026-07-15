import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getStudents,
  createStudent,
  promoteStudents,
  withdrawStudent,
  reAdmitStudent,
  transferStudent,
  undoLastStudent,
} from "./schoolStudents";

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

export function useWithdrawStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => withdrawStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: studentsKey }),
  });
}

export function useReAdmitStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => reAdmitStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: studentsKey }),
  });
}

export function useTransferStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: string; classArmId: string }) =>
      transferStudent(vars.id, vars.classArmId),
    onSuccess: () => qc.invalidateQueries({ queryKey: studentsKey }),
  });
}

export function useUndoLastStudent() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => undoLastStudent(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: studentsKey }),
  });
}
