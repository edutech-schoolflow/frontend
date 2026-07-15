import { useQuery } from "@tanstack/react-query";
import { getClassLevels } from "./classLevels";

export const classLevelsKey = ["class-levels"] as const;

/** The standard class ladder from the backend. Long-lived — it rarely changes. */
export function useClassLevels() {
  return useQuery({
    queryKey: classLevelsKey,
    queryFn: getClassLevels,
    staleTime: 60 * 60 * 1000, // 1h — reference data
  });
}
