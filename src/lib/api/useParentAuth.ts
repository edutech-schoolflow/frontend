import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch } from "@/src/lib/store/hooks";
import { clearParentAuth } from "@/src/lib/store/parentAuthSlice";
import {
  forgotParentPassword,
  loginParent,
  logoutParent,
  registerParent,
  resendParentOtp,
  resetParentPassword,
  verifyParentPhone,
  type ParentLoginInput,
  type ParentRegisterInput,
  type ParentVerifyPhoneInput,
} from "./parentAuth";

// Legacy portal login (endpoint deleted) — kept only so the unmounted legacy form compiles.
export function useParentLogin() {
  return useMutation({
    mutationFn: (input: ParentLoginInput) => loginParent(input),
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


export function useParentLogout() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: logoutParent,
    onSettled: () => {
      dispatch(clearParentAuth());
      queryClient.clear();
    },
  });
}
