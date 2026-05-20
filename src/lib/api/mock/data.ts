import type { School } from "@/src/types/school";
import type { Student, Class, AcademicYear, Term } from "@/src/types/student";
import type { Staff } from "@/src/types/staff";
import type { Parent, ParentChild, PtaInvite } from "@/src/types/parent";
import type { Application } from "@/src/types/application";
import type { Subject, Grade, Report } from "@/src/types/grade";
import type { FeeType, Invoice, Payment, BursarSummary } from "@/src/types/fee";
import type { Notification } from "@/src/types/notification";

export const MOCK_SCHOOL: School = {
  id: "sch-001",
  name: "Greenfield Academy",
  subdomain: "greenfield",
  type: "combined",
  address: "Plot 45, Ademola Street",
  city: "Wuse 2",
  state: "FCT",
  phone: "+234 803 456 7890",
  email: "info@greenfieldacademy.com",
  logoUrl: "/images/png/profile-placeholder.png",
  status: "active",
  kycStatus: "approved",
  visibility: "public",
  paymentsEnabled: true,
  plan: "starter",
  createdAt: "2025-09-01T00:00:00Z",
};

export const MOCK_CLASSES: Class[] = [
  { id: "cls-001", schoolId: "sch-001", name: "Primary 1A", level: "Primary 1" },
  { id: "cls-002", schoolId: "sch-001", name: "Primary 2A", level: "Primary 2" },
  { id: "cls-003", schoolId: "sch-001", name: "JSS 1A", level: "JSS 1" },
  { id: "cls-004", schoolId: "sch-001", name: "JSS 2A", level: "JSS 2" },
];

export const MOCK_ACADEMIC_YEAR: AcademicYear = {
  id: "ay-001",
  schoolId: "sch-001",
  name: "2024/2025",
  isCurrent: true,
};

export const MOCK_TERM: Term = {
  id: "term-001",
  academicYearId: "ay-001",
  name: "second",
  startDate: "2025-01-10",
  endDate: "2025-03-28",
  isCurrent: true,
};

export const MOCK_STUDENTS: Student[] = [
  {
    id: "std-001",
    schoolId: "sch-001",
    firstName: "David",
    lastName: "Okafor",
    middleName: "Chukwuma",
    dateOfBirth: "2018-03-15",
    gender: "male",
    admissionNumber: "GFA/2025/001",
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "std-002",
    schoolId: "sch-001",
    firstName: "Grace",
    lastName: "Adaeze",
    dateOfBirth: "2017-07-22",
    gender: "female",
    admissionNumber: "GFA/2025/002",
    createdAt: "2025-01-16T00:00:00Z",
  },
  {
    id: "std-003",
    schoolId: "sch-001",
    firstName: "Emeka",
    lastName: "Nwachukwu",
    dateOfBirth: "2018-11-05",
    gender: "male",
    admissionNumber: "GFA/2025/003",
    createdAt: "2025-01-17T00:00:00Z",
  },
];

export const MOCK_STAFF: Staff[] = [
  {
    id: "stf-001",
    schoolId: "sch-001",
    userId: "usr-001",
    firstName: "John",
    lastName: "Okonkwo",
    email: "john@greenfieldacademy.com",
    phone: "+234 802 345 6789",
    role: "school_admin",
    position: "ICT Admin",
    status: "active",
    createdAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "stf-002",
    schoolId: "sch-001",
    userId: "usr-002",
    firstName: "Amaka",
    lastName: "Adeyemi",
    email: "amaka@greenfieldacademy.com",
    phone: "+234 803 567 8901",
    role: "teacher",
    position: "Class Teacher",
    classIds: ["cls-001"],
    status: "active",
    createdAt: "2025-01-02T00:00:00Z",
  },
];

export const MOCK_PARENTS: Parent[] = [
  {
    id: "par-001",
    firstName: "John",
    lastName: "Okafor",
    phone: "+234 801 234 5678",
    email: "john@example.com",
    status: "active",
    createdAt: "2025-01-20T00:00:00Z",
  },
  {
    id: "par-002",
    firstName: "Ada",
    lastName: "Okeke",
    phone: "+234 802 345 6789",
    status: "active",
    createdAt: "2025-01-21T00:00:00Z",
  },
];

export const MOCK_CHILDREN: ParentChild[] = [
  {
    studentId: "std-001",
    studentName: "David Okafor",
    schoolId: "sch-001",
    schoolName: "Greenfield Academy",
    className: "Primary 1A",
    outstandingFees: 75000,
    hasNewResult: true,
    hasNewMessage: false,
  },
  {
    studentId: "std-002",
    studentName: "Grace Okafor",
    schoolId: "sch-001",
    schoolName: "Greenfield Academy",
    className: "Primary 2A",
    outstandingFees: 0,
    hasNewResult: false,
    hasNewMessage: true,
  },
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: "app-001",
    referenceNumber: "GFA-2025-001",
    schoolId: "sch-001",
    schoolName: "Greenfield Academy",
    parentId: "par-001",
    parentName: "John Okafor",
    parentPhone: "+234 801 234 5678",
    childFirstName: "David",
    childLastName: "Okafor",
    childMiddleName: "Chukwuma",
    childDateOfBirth: "2018-03-15",
    childGender: "male",
    desiredClass: "Primary 1",
    previousSchool: "Rainbow Nursery",
    additionalGuardians: [
      { name: "Jane Okafor", phone: "+234 802 345 6789", relationship: "Mother" },
    ],
    status: "pending",
    applicationFeePaid: true,
    applicationFeeAmount: 10000,
    submittedAt: "2025-01-20T11:35:00Z",
    updatedAt: "2025-01-20T11:35:00Z",
  },
];

export const MOCK_PTA_INVITES: PtaInvite[] = [
  { parentId: "par-001", parentName: "John Okafor", parentPhone: "+234 801 234 5678", status: "in_group" },
  { parentId: "par-002", parentName: "Ada Okeke", parentPhone: "+234 802 345 6789", status: "invite_sent" },
  { parentId: "par-003", parentName: "Chidi Nwosu", parentPhone: "+234 803 456 7890", status: "not_invited" },
];

export const MOCK_SUBJECTS: Subject[] = [
  { id: "sub-001", classId: "cls-001", name: "Mathematics", maxCaScore: 40, maxExamScore: 60 },
  { id: "sub-002", classId: "cls-001", name: "English Language", maxCaScore: 40, maxExamScore: 60 },
  { id: "sub-003", classId: "cls-001", name: "Basic Science", maxCaScore: 40, maxExamScore: 60 },
  { id: "sub-004", classId: "cls-001", name: "Social Studies", maxCaScore: 40, maxExamScore: 60 },
  { id: "sub-005", classId: "cls-001", name: "CRK", maxCaScore: 40, maxExamScore: 60 },
];

export const MOCK_GRADES: Grade[] = [
  { id: "g-001", enrollmentId: "enr-001", subjectId: "sub-001", subjectName: "Mathematics", ca1: 18, ca2: 16, examScore: 52, totalScore: 86, grade: "A", position: 2 },
  { id: "g-002", enrollmentId: "enr-001", subjectId: "sub-002", subjectName: "English Language", ca1: 15, ca2: 17, examScore: 48, totalScore: 80, grade: "A", position: 3 },
  { id: "g-003", enrollmentId: "enr-001", subjectId: "sub-003", subjectName: "Basic Science", ca1: 14, ca2: 15, examScore: 45, totalScore: 74, grade: "B", position: 5 },
];

export const MOCK_REPORT: Report = {
  id: "rep-001",
  enrollmentId: "enr-001",
  studentName: "David Okafor",
  className: "Primary 1A",
  termName: "2nd Term",
  academicYear: "2024/2025",
  grades: MOCK_GRADES,
  overallAverage: 79.9,
  overallPosition: 2,
  totalStudentsInClass: 35,
  teacherComment: "David is a brilliant student who shows great enthusiasm for learning.",
  principalComment: "Excellent performance. Promoted to Primary 2.",
  behavioralRatings: [
    { trait: "punctuality", score: 5 },
    { trait: "attentiveness", score: 5 },
    { trait: "cooperation", score: 4 },
    { trait: "neatness", score: 3 },
    { trait: "politeness", score: 5 },
    { trait: "leadership", score: 4 },
  ],
  attendanceDays: 65,
  presentDays: 63,
  absentDays: 2,
  lateDays: 0,
  nextTermResumption: "2025-04-28",
  nextTermFees: 100000,
  status: "published",
  publishedAt: "2025-03-28T00:00:00Z",
};

export const MOCK_FEE_TYPES: FeeType[] = [
  { id: "ft-001", schoolId: "sch-001", termId: "term-001", name: "Tuition", amount: 50000, applicableClassIds: ["cls-001", "cls-002"], createdAt: "2025-01-01T00:00:00Z" },
  { id: "ft-002", schoolId: "sch-001", termId: "term-001", name: "Books", amount: 15000, applicableClassIds: ["cls-001", "cls-002"], createdAt: "2025-01-01T00:00:00Z" },
  { id: "ft-003", schoolId: "sch-001", termId: "term-001", name: "Uniform", amount: 10000, applicableClassIds: ["cls-001", "cls-002"], createdAt: "2025-01-01T00:00:00Z" },
];

export const MOCK_INVOICE: Invoice = {
  id: "inv-001",
  studentId: "std-001",
  studentName: "David Okafor",
  schoolId: "sch-001",
  termId: "term-001",
  termName: "2nd Term 2024/2025",
  lines: [
    { feeTypeId: "ft-001", feeTypeName: "Tuition", amount: 50000, paid: 0, balance: 50000, status: "unpaid" },
    { feeTypeId: "ft-002", feeTypeName: "Books", amount: 15000, paid: 0, balance: 15000, status: "unpaid" },
    { feeTypeId: "ft-003", feeTypeName: "Uniform", amount: 10000, paid: 0, balance: 10000, status: "unpaid" },
  ],
  totalAmount: 75000,
  totalPaid: 0,
  balance: 75000,
  dueDate: "2025-01-31",
  createdAt: "2025-01-10T00:00:00Z",
};

export const MOCK_BURSAR_SUMMARY: BursarSummary = {
  totalExpected: 3750000,
  totalCollected: 1200000,
  totalOutstanding: 2550000,
  fullPayers: 12,
  partialPayers: 8,
  zeroPayers: 30,
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-001",
    userId: "par-001",
    type: "fee_reminder",
    channel: "in_app",
    title: "Fee Reminder",
    body: "David's 2nd Term fees of ₦75,000 are due in 7 days.",
    status: "delivered",
    actionUrl: "/children/std-001/fees",
    createdAt: "2025-01-24T08:00:00Z",
  },
  {
    id: "notif-002",
    userId: "par-001",
    type: "result_released",
    channel: "in_app",
    title: "Results Ready!",
    body: "David's 2nd Term results are now available. Average: 79.9% (2nd position).",
    status: "read",
    readAt: "2025-03-28T10:00:00Z",
    actionUrl: "/children/std-001/results",
    createdAt: "2025-03-28T09:00:00Z",
  },
];

export const MOCK_PAYMENTS: Payment[] = [
  {
    id: "pay-001",
    invoiceId: "inv-001",
    parentId: "par-001",
    studentId: "std-001",
    studentName: "David Okafor",
    schoolId: "sch-001",
    amount: 65000,
    opayReference: "OPAY-20250121-001",
    paidAt: "2025-01-21T10:45:00Z",
  },
];
