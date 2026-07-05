import { useQuery } from "@tanstack/react-query";
import {
  getMyChildren,
  getChildProfile,
  getChildReportCards,
  getChildCaScores,
  getChildAttendanceSummary,
} from "./parentChildren";

export const myChildrenKey = ["parent", "children"] as const;

/** The parent's enrolled children (linked via parent_children by the school). */
export function useMyChildren() {
  return useQuery({
    queryKey: myChildrenKey,
    queryFn: getMyChildren,
    staleTime: 30_000,
  });
}

export function useChildProfile(childProfileId: string | undefined) {
  return useQuery({
    queryKey: ["parent", "children", childProfileId, "profile"] as const,
    queryFn: () => getChildProfile(childProfileId as string),
    enabled: !!childProfileId,
  });
}

export function useChildReportCards(childProfileId: string | undefined) {
  return useQuery({
    queryKey: ["parent", "children", childProfileId, "report-cards"] as const,
    queryFn: () => getChildReportCards(childProfileId as string),
    enabled: !!childProfileId,
  });
}

export function useChildCaScores(
  childProfileId: string | undefined,
  termId?: string
) {
  return useQuery({
    queryKey: ["parent", "children", childProfileId, "ca-scores", termId ?? null] as const,
    queryFn: () => getChildCaScores(childProfileId as string, termId),
    enabled: !!childProfileId,
  });
}

export function useChildAttendance(childProfileId: string | undefined) {
  return useQuery({
    queryKey: ["parent", "children", childProfileId, "attendance"] as const,
    queryFn: () => getChildAttendanceSummary(childProfileId as string),
    enabled: !!childProfileId,
  });
}
