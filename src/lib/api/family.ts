import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiGet, apiPost } from "./client";


export interface FamilyProfile {
  hasProfile: boolean;
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  phoneVerified?: boolean;
  hasPaymentPin?: boolean;
}

export const familyProfileKey = ["family", "profile"] as const;

export async function getFamilyProfile(): Promise<FamilyProfile> {
  const { data } = await apiGet<FamilyProfile>("/family/profile");
  return data;
}

export function useFamilyProfile() {
  return useQuery({
    queryKey: familyProfileKey,
    queryFn: getFamilyProfile,
    retry: false,
    staleTime: 60_000,
  });
}

export async function setFamilyPaymentPin(pin: string): Promise<string> {
  const { message } = await apiPost<null>("/family/payment-pin", { pin });
  return message;
}

export function useSetFamilyPaymentPin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pin: string) => setFamilyPaymentPin(pin),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: familyProfileKey }),
  });
}
