export interface Guardian {
  name: string;
  phone: string;
  relationship: string;
  email?: string;
}

export interface Student {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: "male" | "female";
  photoUrl?: string;
  previousSchool?: string;
  medicalNotes?: string;
  admissionNumber?: string;
  classId?: string;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  studentId: string;
  classId: string;
  termId: string;
  academicYearId: string;
  student?: Student;
}

export interface Class {
  id: string;
  schoolId: string;
  name: string;
  level: string;
  teacherId?: string;
}

export interface AcademicYear {
  id: string;
  schoolId: string;
  name: string;
  isCurrent: boolean;
}

export interface Term {
  id: string;
  academicYearId: string;
  name: "first" | "second" | "third";
  startDate: string;
  endDate: string;
  isCurrent: boolean;
}
