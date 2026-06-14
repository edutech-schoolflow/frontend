import { mockResponse } from "./mockClient";
import {
  MOCK_STAFF,
  MOCK_PERMISSION_TEMPLATES,
  MOCK_SCHOOLS,
} from "./mock/schoolData";
import { ROLE_FEATURES, DEFAULT_FEATURES } from "@/src/types/staffFeatures";
import type { Staff } from "@/src/types/staff";
import type { School } from "@/src/types/school";
import type { StaffFeatures } from "@/src/types/staffFeatures";

export interface MyStaffProfile {
  staff: Staff;
  features: StaffFeatures;
  isSchoolAdmin: boolean;
}

export interface StaffWithPermissions {
  staff: Staff;
  features: StaffFeatures;
}

export interface StaffSchoolEntry {
  staff: Staff;
  school: School;
}

function computeFeatures(staff: Staff): StaffFeatures {
  const template = MOCK_PERMISSION_TEMPLATES.find(
    (t) => t.id === staff.permissionTemplateId
  );
  const base: StaffFeatures =
    template?.features ?? ROLE_FEATURES[staff.role] ?? DEFAULT_FEATURES;
  return { ...base, ...(staff.featureOverrides ?? {}) };
}

// Returns the staff profile for a given user, scoped to a specific school.
// For part-time staff with records at multiple schools, activeSchoolId picks
// which record to load. Falls back to the first record if not specified.
export const getMyStaffProfile = async (
  userId: string | undefined,
  activeSchoolId?: string | null
): Promise<MyStaffProfile | null> => {
  if (!userId) return mockResponse(null);

  const records = MOCK_STAFF.filter(
    (s) => s.userId === userId && s.status === "active"
  );
  if (!records.length) return mockResponse(null);

  const staff =
    (activeSchoolId && records.find((s) => s.schoolId === activeSchoolId)) ||
    records[0];

  return mockResponse({
    staff,
    features: computeFeatures(staff),
    // Only the school portal account holder (isOwner) gets redirected to
    // the school portal. Staff with school_admin role are not the same thing.
    isSchoolAdmin: staff.isOwner === true,
  });
};

// Returns every school a staff member belongs to, with their staff record for
// each school. Used by the My Schools page and the school switcher.
export const getMySchools = async (
  userId: string | undefined
): Promise<StaffSchoolEntry[]> => {
  if (!userId) return mockResponse([]);

  const records = MOCK_STAFF.filter(
    (s) => s.userId === userId && s.status === "active"
  );

  const entries: StaffSchoolEntry[] = records
    .map((staff) => {
      const school = MOCK_SCHOOLS.find((sc) => sc.id === staff.schoolId);
      return school ? { staff, school } : null;
    })
    .filter((e): e is StaffSchoolEntry => e !== null);

  return mockResponse(entries);
};

// Returns every active staff member with their computed effective permissions.
export const getStaffWithPermissions = async (): Promise<
  StaffWithPermissions[]
> => {
  const list = MOCK_STAFF.filter(
    (s) => s.status === "active" && !!s.userId && s.schoolId === "sch-001"
  ).map((s) => ({ staff: s, features: computeFeatures(s) }));
  return mockResponse(list);
};
