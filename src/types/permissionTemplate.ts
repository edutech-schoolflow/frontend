import type { StaffFeatures } from "./staffFeatures";

export interface PermissionTemplate {
  id: string;
  name: string;
  description: string;
  features: StaffFeatures;
  createdAt: string;
}
