import { useQuery } from "@tanstack/react-query";
import { getSchoolClasses } from "./parentSchools";

/** A public school's offered classes (parent-facing), for the desired-class picker when applying. */
export function usePublicSchoolClasses(schoolId: string | undefined) {
  return useQuery({
    queryKey: ["parent", "schools", schoolId, "classes"] as const,
    queryFn: () => getSchoolClasses(schoolId as string),
    enabled: !!schoolId,
    staleTime: 5 * 60 * 1000,
  });
}
