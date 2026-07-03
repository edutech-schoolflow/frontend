import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFeeTypes,
  createFeeType,
  updateFeeType,
  approveFeeType,
  rejectFeeType,
  deleteFeeType,
  getCollections,
  type ListFeeTypesParams,
  type CreateFeeTypeInput,
  type UpdateFeeTypeInput,
} from "./schoolFees";

export const feeTypesKey = (params: ListFeeTypesParams = {}) =>
  [
    "school",
    "fee-types",
    params.termId ?? "all",
    params.status ?? "all",
    params.category ?? "all",
  ] as const;

const FEE_TYPES_ROOT = ["school", "fee-types"] as const;

export function useFeeTypes(params: ListFeeTypesParams = {}) {
  return useQuery({
    queryKey: feeTypesKey(params),
    queryFn: () => getFeeTypes(params),
    enabled: params.termId !== undefined ? !!params.termId : true,
    staleTime: 15_000,
  });
}

function useInvalidatingMutation<TVars, TResult>(
  fn: (vars: TVars) => Promise<TResult>
) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => qc.invalidateQueries({ queryKey: FEE_TYPES_ROOT }),
  });
}

export function useCreateFeeType() {
  return useInvalidatingMutation((input: CreateFeeTypeInput) =>
    createFeeType(input)
  );
}

export function useUpdateFeeType() {
  return useInvalidatingMutation(
    (vars: { id: string; input: UpdateFeeTypeInput }) =>
      updateFeeType(vars.id, vars.input)
  );
}

export function useApproveFeeType() {
  return useInvalidatingMutation((id: string) => approveFeeType(id));
}

export function useRejectFeeType() {
  return useInvalidatingMutation((vars: { id: string; reason?: string }) =>
    rejectFeeType(vars.id, vars.reason)
  );
}

export function useDeleteFeeType() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFeeType(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: FEE_TYPES_ROOT }),
  });
}

export const collectionsKey = (termId: string) =>
  ["school", "collections", termId] as const;

export function useCollections(termId: string) {
  return useQuery({
    queryKey: collectionsKey(termId),
    queryFn: () => getCollections(termId),
    enabled: !!termId,
    staleTime: 15_000,
  });
}
