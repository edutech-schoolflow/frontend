import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { StaffRole } from "@/src/types/staff";
import {
  getSchoolStaffList,
  updateStaffRole,
  deactivateStaff,
  reactivateStaff,
  resendStaffInvite,
} from "./schoolStaff";

export const staffDirectoryKey = ["school", "staff"] as const;

export function useStaffDirectory() {
  return useQuery({
    queryKey: staffDirectoryKey,
    queryFn: getSchoolStaffList,
    staleTime: 30_000,
  });
}

export function useUpdateStaffRole() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: {
      affiliationId: string;
      role: StaffRole;
      position: string;
    }) =>
      updateStaffRole(vars.affiliationId, {
        role: vars.role,
        position: vars.position,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: staffDirectoryKey }),
  });
}

export function useDeactivateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (affiliationId: string) => deactivateStaff(affiliationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: staffDirectoryKey }),
  });
}

export function useReactivateStaff() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (affiliationId: string) => reactivateStaff(affiliationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: staffDirectoryKey }),
  });
}

export function useResendStaffInvite() {
  return useMutation({
    mutationFn: (affiliationId: string) => resendStaffInvite(affiliationId),
  });
}

export function useInvalidateStaffDirectory() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: staffDirectoryKey });
}
