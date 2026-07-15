import { apiGet } from "./client";

export type ClassStage =
  | "nursery"
  | "primary"
  | "junior_secondary"
  | "senior_secondary"
  | "pre_school";

export interface ClassLevel {
  name: string;
  stage: ClassStage;
  order: number;
}

/** The platform's standard 6-3-3 class ladder — reference data, not hardcoded on the client. */
export async function getClassLevels(): Promise<ClassLevel[]> {
  const { data } = await apiGet<ClassLevel[]>("/class-levels");
  return data ?? [];
}
