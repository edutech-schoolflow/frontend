import { mockResponse } from "./mockClient";
import { MOCK_STUDENTS } from "./mock/data";
import type { Student } from "@/src/types/student";

export const getStudents = async (_params?: {
  classId?: string;
  page?: number;
  limit?: number;
}) => mockResponse({ data: MOCK_STUDENTS, total: MOCK_STUDENTS.length });

export const getStudent = async (id: string): Promise<Student> => {
  const student = MOCK_STUDENTS.find((s) => s.id === id) ?? MOCK_STUDENTS[0];
  return mockResponse(student);
};

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
