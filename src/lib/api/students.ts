import { mockResponse } from "./mockClient";
import {
  MOCK_STUDENTS,
  MOCK_CLASSES,
  MOCK_STUDENT_DOCUMENTS,
} from "./mock/schoolData";
import type {
  Student,
  Class,
  Guardian,
  StudentDocument,
} from "@/src/types/student";

export const getClasses = async (): Promise<Class[]> =>
  mockResponse(MOCK_CLASSES);

export const getStudents = async (_params?: {
  classId?: string;
  status?: "active" | "withdrawn" | "all";
  page?: number;
  limit?: number;
}) => mockResponse({ data: MOCK_STUDENTS, total: MOCK_STUDENTS.length });

export const getStudent = async (id: string): Promise<Student> => {
  const student = MOCK_STUDENTS.find((s) => s.id === id) ?? MOCK_STUDENTS[0];
  return mockResponse(student);
};

export const updateStudentContact = async (
  studentId: string,
  guardians: Guardian[]
): Promise<Student> => {
  const idx = MOCK_STUDENTS.findIndex((s) => s.id === studentId);
  if (idx < 0) throw new Error("Student not found");
  MOCK_STUDENTS[idx] = { ...MOCK_STUDENTS[idx], guardians };
  return mockResponse(MOCK_STUDENTS[idx]);
};

export const withdrawStudent = async (studentId: string): Promise<Student> => {
  const idx = MOCK_STUDENTS.findIndex((s) => s.id === studentId);
  if (idx < 0) throw new Error("Student not found");
  MOCK_STUDENTS[idx] = { ...MOCK_STUDENTS[idx], status: "withdrawn" };
  return mockResponse(MOCK_STUDENTS[idx]);
};

export const reAdmitStudent = async (studentId: string): Promise<Student> => {
  const idx = MOCK_STUDENTS.findIndex((s) => s.id === studentId);
  if (idx < 0) throw new Error("Student not found");
  MOCK_STUDENTS[idx] = { ...MOCK_STUDENTS[idx], status: "active" };
  return mockResponse(MOCK_STUDENTS[idx]);
};

export const transferStudent = async (
  studentId: string,
  newClassId: string
): Promise<Student> => {
  const idx = MOCK_STUDENTS.findIndex((s) => s.id === studentId);
  if (idx < 0) throw new Error("Student not found");
  MOCK_STUDENTS[idx] = { ...MOCK_STUDENTS[idx], classId: newClassId };
  return mockResponse(MOCK_STUDENTS[idx]);
};

export const getStudentDocuments = async (
  studentId: string
): Promise<StudentDocument[]> => {
  const docs = MOCK_STUDENT_DOCUMENTS.filter((d) => d.studentId === studentId);
  return mockResponse(docs);
};

export const verifyStudentDocument = async (
  docId: string,
  status: "verified" | "rejected",
  notes?: string
): Promise<StudentDocument> => {
  const idx = MOCK_STUDENT_DOCUMENTS.findIndex((d) => d.id === docId);
  if (idx < 0) throw new Error("Document not found");
  MOCK_STUDENT_DOCUMENTS[idx] = {
    ...MOCK_STUDENT_DOCUMENTS[idx],
    status,
    notes,
  };
  return mockResponse(MOCK_STUDENT_DOCUMENTS[idx]);
};

export const createStudent = async (
  payload: Omit<Student, "id" | "schoolId" | "createdAt">
): Promise<Student> =>
  mockResponse({
    ...payload,
    id: `std-${Date.now()}`,
    schoolId: "sch-001",
    admissionNumber: `GFA/2025/${String(MOCK_STUDENTS.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  });

export const getStudentEnrollments = async (_studentId: string) =>
  mockResponse([
    {
      id: "enr-001",
      studentId: "std-001",
      classId: "cls-001",
      termId: "term-001",
      academicYearId: "ay-001",
    },
  ]);

export const getImports = async () =>
  mockResponse([
    {
      id: "imp-001",
      studentName: "Tolu Adebayo",
      class: "Primary 1",
      parentPhone: "+234 809 111 2222",
      status: "pending",
    },
    {
      id: "imp-002",
      studentName: "Bisi Ogundimu",
      class: "JSS 1",
      parentPhone: "+234 808 333 4444",
      status: "pending",
    },
  ]);

export const approveImport = async (_importId: string) =>
  mockResponse({ message: "Import approved" });

export const rejectImport = async (_importId: string) =>
  mockResponse({ message: "Import rejected" });
