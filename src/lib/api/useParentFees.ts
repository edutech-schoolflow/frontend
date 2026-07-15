import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getParentFees,
  payFee,
  getParentPayments,
  type PayFeeInput,
} from "./parentFees";

export const parentFeesKey = ["parent", "fees"] as const;
export const parentPaymentsKey = ["parent", "payments"] as const;

export function useParentFees() {
  return useQuery({
    queryKey: parentFeesKey,
    queryFn: getParentFees,
    staleTime: 15_000,
  });
}

export function usePayFee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: PayFeeInput) => payFee(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: parentFeesKey });
      qc.invalidateQueries({ queryKey: parentPaymentsKey });
    },
  });
}

export function useParentPayments() {
  return useQuery({
    queryKey: parentPaymentsKey,
    queryFn: getParentPayments,
    staleTime: 30_000,
  });
}
