import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/src/lib/store/hooks";
import { setSchoolUser } from "@/src/lib/store/authSlice";
import { getSchoolMe } from "./schoolAuth";
import { schoolMeKey } from "./useSchoolAuth";
import { getKycStatus, submitKyc, type KycInput } from "./schoolKyc";

export const kycStatusKey = ["school", "kyc"] as const;

export function useKycStatus(enabled = true) {
  return useQuery({
    queryKey: kycStatusKey,
    queryFn: getKycStatus,
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
  });
}

export function useSubmitKyc() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: ({ input, file }: { input: KycInput; file: File }) =>
      submitKyc(input, file),
    onSuccess: async (submission) => {
      queryClient.setQueryData(kycStatusKey, submission);
      // KYC moved to under_review → refresh /me so Redux reflects the new status.
      const user = await getSchoolMe();
      dispatch(setSchoolUser(user));
      queryClient.setQueryData(schoolMeKey, user);
    },
  });
}
