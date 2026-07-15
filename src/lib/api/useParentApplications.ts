import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMyApplications,
  getApplication,
  submitApplication,
  payApplicationFee,
  type SubmitApplicationInput,
} from "./parentApplications";

export const myApplicationsKey = ["parent", "applications"] as const;

export function useMyApplications() {
  return useQuery({
    queryKey: myApplicationsKey,
    queryFn: getMyApplications,
    staleTime: 30_000,
  });
}

export function useApplication(id: string | undefined) {
  return useQuery({
    queryKey: ["parent", "applications", id] as const,
    queryFn: () => getApplication(id as string),
    enabled: !!id,
  });
}

export function useSubmitApplication() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitApplicationInput) => submitApplication(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: myApplicationsKey }),
  });
}

export function usePayApplicationFee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (applicationId: string) => payApplicationFee(applicationId),
    onSuccess: () => qc.invalidateQueries({ queryKey: myApplicationsKey }),
  });
}
