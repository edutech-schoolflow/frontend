import { mockResponse } from "./mockClient";
import {
  MOCK_SCHOOL,
  MOCK_CLASSES,
  MOCK_ACADEMIC_YEAR,
  MOCK_TERM,
} from "./mock/schoolData";
import { MOCK_SCHOOL_LISTINGS } from "./mock/parentData";
import type {
  School,
  SchoolListing,
  KycSubmission,
  AdmissionsSettings,
} from "@/src/types/school";

export const getMySchool = async (): Promise<School> =>
  mockResponse(MOCK_SCHOOL);

export const searchSchools = async (_params?: {
  query?: string;
  state?: string;
  type?: string;
}): Promise<SchoolListing[]> => mockResponse(MOCK_SCHOOL_LISTINGS);

export const getSchoolListingById = async (
  id: string
): Promise<SchoolListing | undefined> =>
  mockResponse(MOCK_SCHOOL_LISTINGS.find((s) => s.id === id));

export const getSchoolProfile = async (_subdomain: string): Promise<School> =>
  mockResponse(MOCK_SCHOOL);

export const submitKyc = async (_payload: FormData): Promise<KycSubmission> =>
  mockResponse({
    id: "kyc-001",
    schoolId: "sch-001",
    status: "under_review" as const,
    submittedAt: new Date().toISOString(),
    documents: [],
    proprietorName: "Mrs. Grace Okafor",
    proprietorIdType: "national_id",
    proprietorIdNumber: "12345678901",
    proprietorPhone: "+234 801 234 5678",
    proprietorEmail: "grace@greenfieldacademy.com",
    bankName: "Access Bank",
    accountNumber: "0123456789",
    accountName: "Greenfield Academy",
    accountType: "savings" as const,
  });

export const getKycStatus = async (): Promise<KycSubmission> =>
  mockResponse({
    id: "kyc-001",
    schoolId: "sch-001",
    status: "approved" as const,
    submittedAt: "2025-01-05T00:00:00Z",
    reviewedAt: "2025-01-07T00:00:00Z",
    documents: [],
    proprietorName: "Mrs. Grace Okafor",
    proprietorIdType: "national_id",
    proprietorIdNumber: "12345678901",
    proprietorPhone: "+234 801 234 5678",
    proprietorEmail: "grace@greenfieldacademy.com",
    bankName: "Access Bank",
    accountNumber: "0123456789",
    accountName: "Greenfield Academy",
    accountType: "savings" as const,
  });

export const uploadLogo = async (_file: File): Promise<string> =>
  mockResponse("/images/png/profile-placeholder.png");

export const getAdmissionsSettings = async (): Promise<AdmissionsSettings> =>
  mockResponse({
    admissionsOpen: true,
    applicationFee: 10000,
    availableClassIds: ["cls-001", "cls-002"],
  });

export const updateAdmissionsSettings = async (payload: AdmissionsSettings) =>
  mockResponse(payload);

export const getClasses = async () => mockResponse(MOCK_CLASSES);

export const getCurrentTerm = async () => mockResponse(MOCK_TERM);

export const getCurrentAcademicYear = async () =>
  mockResponse(MOCK_ACADEMIC_YEAR);

export const getOnboardingProgress = async () =>
  mockResponse({
    logoUploaded: true,
    classesConfigured: true,
    academicYearSet: true,
    proprietorInvited: false,
    completed: false,
  });

export const saveOnboardingClasses = async (_levels: string[]) =>
  mockResponse({ message: "Classes saved." });

export const saveAcademicCalendar = async (_payload: {
  academicYear: string;
  term: "first" | "second" | "third";
  startDate: string;
  endDate: string;
}) => mockResponse({ message: "Calendar saved." });

export const inviteProprietor = async (_payload: {
  name: string;
  email: string;
  phone: string;
}) => mockResponse({ message: "Invitation sent." });

import type {
  DashboardStats,
  ActivityItem,
  DashboardApplication,
  SchoolClass,
  ClassArm,
  CreateClassPayload,
} from "@/src/types/school";
import {
  MOCK_DASHBOARD_STATS,
  MOCK_RECENT_APPLICATIONS,
  MOCK_RECENT_ACTIVITY,
  MOCK_SCHOOL_CLASSES,
  MOCK_CLASS_ARMS,
  MOCK_STAFF,
} from "./mock/schoolData";

export const getSchoolDashboard = async (): Promise<{
  stats: DashboardStats;
  recentApplications: DashboardApplication[];
  recentActivity: ActivityItem[];
}> =>
  mockResponse({
    stats: MOCK_DASHBOARD_STATS,
    recentApplications: MOCK_RECENT_APPLICATIONS,
    recentActivity: MOCK_RECENT_ACTIVITY,
  });

// ─── Classes & Arms ────────────────────────────────────────────────────────────

export const getSchoolClasses = async (): Promise<SchoolClass[]> =>
  mockResponse(MOCK_SCHOOL_CLASSES);

export const getClassArms = async (_classId: string): Promise<ClassArm[]> =>
  mockResponse(MOCK_CLASS_ARMS[_classId] ?? []);

export const createSchoolClass = async (
  _payload: CreateClassPayload
): Promise<SchoolClass> =>
  mockResponse({
    id: `cls-${Date.now()}`,
    name: _payload.name,
    level: _payload.level,
    order: 0,
    armsCount: _payload.arms.length,
    studentsCount: 0,
  });

export const deleteSchoolClass = async (_classId: string): Promise<void> =>
  mockResponse(undefined);

export const assignClassTeacher = async (
  armId: string,
  staffId: string | null
): Promise<ClassArm> => {
  const staff = staffId
    ? (MOCK_STAFF.find((s) => s.id === staffId) ?? null)
    : null;
  const classTeacher = staff
    ? { id: staff.id, name: `${staff.firstName} ${staff.lastName}` }
    : null;

  for (const arms of Object.values(MOCK_CLASS_ARMS)) {
    const idx = arms.findIndex((a) => a.id === armId);
    if (idx >= 0) {
      arms[idx] = { ...arms[idx], classTeacher };
      return mockResponse(arms[idx]);
    }
  }

  // Arm was created locally but not yet in mock store — return a patched shell
  return mockResponse({
    id: armId,
    classId: "",
    className: "",
    arm: "",
    fullName: "",
    classTeacher,
    studentsCount: 0,
    subjectTeachers: [],
  });
};

export const getSchoolTeachers = async (): Promise<
  { id: string; name: string }[]
> => {
  const teachers = MOCK_STAFF.filter(
    (s) => s.role === "teacher" && s.status === "active"
  ).map((s) => ({ id: s.id, name: `${s.firstName} ${s.lastName}` }));
  return mockResponse(teachers);
};
