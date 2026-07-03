import { useMutation, useQuery } from "@tanstack/react-query";
import {
  acceptInvite,
  inviteStaff,
  sendInviteOtp,
  validateInvite,
  type InviteStaffInput,
} from "./staffInvite";

/** Owner: invite a staff member. */
export function useInviteStaff() {
  return useMutation({
    mutationFn: (input: InviteStaffInput) => inviteStaff(input),
  });
}

/** Staff: validate the invite token on the accept screen. */
export function useValidateInvite(token: string) {
  return useQuery({
    queryKey: ["staff", "invite", token],
    queryFn: () => validateInvite(token),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!token,
  });
}

export function useSendInviteOtp() {
  return useMutation({ mutationFn: (token: string) => sendInviteOtp(token) });
}

export function useAcceptInvite() {
  return useMutation({
    mutationFn: (input: { token: string; password: string; code: string }) =>
      acceptInvite(input),
  });
}
