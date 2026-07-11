import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/src/lib/store/hooks";
import {
  setParentUser,
  clearParentAuth,
} from "@/src/lib/store/parentAuthSlice";
import {
  forgotParentPassword,
  getParentMe,
  loginParent,
  logoutParent,
  registerParent,
  resendParentOtp,
  resetParentPassword,
  setPaymentPin,
  verifyParentPhone,
  type ParentLoginInput,
  type ParentRegisterInput,
  type ParentVerifyPhoneInput,
} from "./parentAuth";

export const parentMeKey = ["parent", "me"] as const;

/** Probes /parent/auth/me. The query→Redux sync is done in the consuming guard via an effect. */
export function useParentMe() {
  return useQuery({
    queryKey: parentMeKey,
    queryFn: getParentMe,
    retry: false,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });
}

export function useParentLogin() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (input: ParentLoginInput) => loginParent(input),
    onSuccess: async () => {
      const user = await getParentMe();
      dispatch(setParentUser(user));
      queryClient.setQueryData(parentMeKey, user);
    },
  });
}

export function useParentRegister() {
  return useMutation({
    mutationFn: (input: ParentRegisterInput) => registerParent(input),
  });
}

export function useVerifyParentPhone() {
  return useMutation({
    mutationFn: (input: ParentVerifyPhoneInput) => verifyParentPhone(input),
  });
}

export function useResendParentOtp() {
  return useMutation({ mutationFn: (phone: string) => resendParentOtp(phone) });
}

export function useForgotParentPassword() {
  return useMutation({
    mutationFn: (phone: string) => forgotParentPassword(phone),
  });
}

export function useResetParentPassword() {
  return useMutation({
    mutationFn: (input: { phone: string; code: string; newPassword: string }) =>
      resetParentPassword(input),
  });
}

export function useSetPaymentPin() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: (pin: string) => setPaymentPin(pin),
    // Once a PIN exists, refresh /me so hasPaymentPin flips true everywhere.
    onSuccess: async () => {
      const user = await getParentMe();
      dispatch(setParentUser(user));
      queryClient.setQueryData(parentMeKey, user);
    },
  });
}

export function useParentLogout() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: logoutParent,
    onSettled: () => {
      dispatch(clearParentAuth());
      queryClient.removeQueries({ queryKey: parentMeKey });
    },
  });
}
