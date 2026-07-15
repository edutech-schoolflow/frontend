import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/src/lib/store/hooks";
import { setSchoolUser, clearAuth } from "@/src/lib/store/authSlice";
import {
  forgotPassword,
  getSchoolMe,
  loginSchool,
  logout,
  registerSchool,
  resendOtp,
  resetPassword,
  verifyPhone,
  type SchoolLoginInput,
  type SchoolRegisterInput,
  type VerifyPhoneInput,
} from "./schoolAuth";

export const schoolMeKey = ["school", "me"] as const;

/**
 * Probes /school/auth/me. The query→Redux sync (v5 has no useQuery onSuccess) is done
 * in the consuming guard via an effect. `retry: false` so an unauthenticated 401 resolves
 * straight to a redirect instead of retrying.
 */
export function useSchoolMe() {
  return useQuery({
    queryKey: schoolMeKey,
    queryFn: getSchoolMe,
    retry: false,
    // Re-validate when the tab regains focus: if the access token expired while away, this
    // 401s → the client silently refreshes → the session self-heals instead of forcing a re-login.
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });
}

export function useSchoolLogin() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (input: SchoolLoginInput) => loginSchool(input),
    onSuccess: async () => {
      const user = await getSchoolMe();
      dispatch(setSchoolUser(user));
      queryClient.setQueryData(schoolMeKey, user);
    },
  });
}

export function useSchoolRegister() {
  return useMutation({
    mutationFn: (input: SchoolRegisterInput) => registerSchool(input),
  });
}

export function useVerifyPhone() {
  return useMutation({
    mutationFn: (input: VerifyPhoneInput) => verifyPhone(input),
  });
}

export function useResendOtp() {
  return useMutation({ mutationFn: (phone: string) => resendOtp(phone) });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: (phone: string) => forgotPassword(phone) });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (input: { phone: string; code: string; newPassword: string }) =>
      resetPassword(input),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: logout,
    onSettled: () => {
      dispatch(clearAuth());
      queryClient.removeQueries({ queryKey: schoolMeKey });
    },
  });
}
