import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTransition, confirmTransition } from "./transition";
import { termsKey, academicYearsKey } from "./useTerms";

export const transitionKey = ["school", "academics", "transition"] as const;

export function useTransition() {
  return useQuery({
    queryKey: transitionKey,
    queryFn: getTransition,
    staleTime: 60_000,
  });
}

export function useConfirmTransition() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: confirmTransition,
    onSuccess: () => {
      // Confirming moves the current term/session, so refresh the calendar and the proposal.
      qc.invalidateQueries({ queryKey: transitionKey });
      qc.invalidateQueries({ queryKey: termsKey });
      qc.invalidateQueries({ queryKey: academicYearsKey });
    },
  });
}
