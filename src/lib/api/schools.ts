import { mockResponse } from "./mockClient";
import {
  MOCK_SCHOOL,
  MOCK_CLASSES,
  MOCK_ACADEMIC_YEAR,
  MOCK_TERM,
} from "./mock/data";
import type { School, KycSubmission, AdmissionsSettings } from "@/src/types/school";

export const getMySchool = async (): Promise<School> =>
  mockResponse(MOCK_SCHOOL);

export const searchSchools = async (_params: {
  name?: string;
  state?: string;
  type?: string;
}): Promise<School[]> => mockResponse([MOCK_SCHOOL]);

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

export const getCurrentAcademicYear = async () => mockResponse(MOCK_ACADEMIC_YEAR);

export const getOnboardingProgress = async () =>
  mockResponse({
    logoUploaded: true,
    classesConfigured: true,
    academicYearSet: true,
    proprietorInvited: false,
    completed: false,
  });
