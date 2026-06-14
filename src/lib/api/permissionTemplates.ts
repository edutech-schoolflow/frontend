import { mockResponse } from "./mockClient";
import { MOCK_PERMISSION_TEMPLATES, MOCK_STAFF } from "./mock/schoolData";
import type { PermissionTemplate } from "@/src/types/permissionTemplate";
import type { StaffFeatures } from "@/src/types/staffFeatures";

export const getPermissionTemplates = async (): Promise<PermissionTemplate[]> =>
  mockResponse([...MOCK_PERMISSION_TEMPLATES]);

export const createPermissionTemplate = async (
  name: string,
  description: string,
  features: StaffFeatures
): Promise<PermissionTemplate> => {
  const tpl: PermissionTemplate = {
    id: `tpl-${Date.now()}`,
    name,
    description,
    features: { ...features },
    createdAt: new Date().toISOString(),
  };
  MOCK_PERMISSION_TEMPLATES.push(tpl);
  return mockResponse(tpl);
};

export const updatePermissionTemplate = async (
  id: string,
  patch: { name?: string; description?: string; features?: StaffFeatures }
): Promise<void> => {
  const tpl = MOCK_PERMISSION_TEMPLATES.find((t) => t.id === id);
  if (!tpl) return mockResponse(undefined);
  if (patch.name !== undefined) tpl.name = patch.name;
  if (patch.description !== undefined) tpl.description = patch.description;
  if (patch.features !== undefined) tpl.features = { ...patch.features };
  return mockResponse(undefined);
};

export const deletePermissionTemplate = async (
  id: string
): Promise<{ success: boolean; reason?: string }> => {
  const inUse = MOCK_STAFF.some((s) => s.permissionTemplateId === id);
  if (inUse) {
    return mockResponse({
      success: false,
      reason: "Template is assigned to one or more staff members.",
    });
  }
  const idx = MOCK_PERMISSION_TEMPLATES.findIndex((t) => t.id === id);
  if (idx !== -1) MOCK_PERMISSION_TEMPLATES.splice(idx, 1);
  return mockResponse({ success: true });
};

// Assign a template to a staff member. Pass null to remove the template.
export const assignStaffTemplate = async (
  staffId: string,
  templateId: string | null
): Promise<void> => {
  const staff = MOCK_STAFF.find((s) => s.id === staffId);
  if (!staff) return mockResponse(undefined);
  staff.permissionTemplateId = templateId ?? undefined;
  // Clear overrides when switching template so the new template is a clean base.
  staff.featureOverrides = {};
  return mockResponse(undefined);
};

// Set individual feature overrides on top of the staff member's template.
export const setStaffFeatureOverrides = async (
  staffId: string,
  overrides: Partial<StaffFeatures>
): Promise<void> => {
  const staff = MOCK_STAFF.find((s) => s.id === staffId);
  if (!staff) return mockResponse(undefined);
  staff.featureOverrides = { ...overrides };
  return mockResponse(undefined);
};

// Returns the count of active staff assigned to a given template.
export const getTemplateStaffCount = (templateId: string): number =>
  MOCK_STAFF.filter(
    (s) => s.status === "active" && s.permissionTemplateId === templateId
  ).length;
