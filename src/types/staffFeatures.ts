import type { StaffRole } from "./staff";

export interface StaffFeatures {
  can_mark_student_attendance: boolean;
  can_enter_grades: boolean;
  can_submit_exam_papers: boolean;
  can_view_my_classes: boolean;
  can_manage_fees: boolean;
  can_view_invoices: boolean;
  can_manage_admissions: boolean;
  can_view_student_records: boolean;
  can_view_school_overview: boolean;
  can_view_staff_attendance_board: boolean;
  can_manage_permissions: boolean;
  can_view_store: boolean;
  can_manage_store: boolean;
}

const NONE: StaffFeatures = {
  can_mark_student_attendance: false,
  can_enter_grades: false,
  can_submit_exam_papers: false,
  can_view_my_classes: false,
  can_manage_fees: false,
  can_view_invoices: false,
  can_manage_admissions: false,
  can_view_student_records: false,
  can_view_school_overview: false,
  can_view_staff_attendance_board: false,
  can_manage_permissions: false,
  can_view_store: false,
  can_manage_store: false,
};

export const SCHOOL_OWNER_FEATURES: StaffFeatures = {
  can_mark_student_attendance: true,
  can_enter_grades: true,
  can_submit_exam_papers: true,
  can_view_my_classes: true,
  can_manage_fees: true,
  can_view_invoices: true,
  can_manage_admissions: true,
  can_view_student_records: true,
  can_view_school_overview: true,
  can_view_staff_attendance_board: true,
  can_manage_permissions: true,
  can_view_store: true,
  can_manage_store: true,
};

const ALL: StaffFeatures = {
  can_mark_student_attendance: true,
  can_enter_grades: true,
  can_submit_exam_papers: true,
  can_view_my_classes: true,
  can_manage_fees: true,
  can_view_invoices: true,
  can_manage_admissions: true,
  can_view_student_records: true,
  can_view_school_overview: true,
  can_view_staff_attendance_board: true,
  can_manage_permissions: true,
  can_view_store: true,
  can_manage_store: true,
};

export const ROLE_FEATURES: Record<StaffRole, StaffFeatures> = {
  teacher: {
    ...NONE,
    can_mark_student_attendance: true,
    can_enter_grades: true,
    can_submit_exam_papers: true,
    can_view_my_classes: true,
  },

  // Principal oversees the whole school. Approves admissions (registrar
  // processes, principal signs off). Needs fee visibility to manage
  // defaulters before exams. Does not manage daily operations directly.
  principal: {
    ...NONE,
    can_view_school_overview: true,
    can_view_staff_attendance_board: true,
    can_view_student_records: true,
    can_manage_admissions: true,
    can_view_invoices: true,
    can_view_store: true,
  },

  // VP assists the principal. Typically handles academic scheduling,
  // exam coordination, and teacher supervision.
  vice_principal: {
    ...NONE,
    can_view_school_overview: true,
    can_view_staff_attendance_board: true,
    can_view_student_records: true,
    can_view_invoices: true,
    can_view_store: true,
  },

  // Bursar manages fees end-to-end: types, amounts, invoices, payments.
  // Needs student records to know who to bill. No access to grades or admissions.
  bursar: {
    ...NONE,
    can_view_school_overview: true,
    can_manage_fees: true,
    can_view_invoices: true,
    can_view_student_records: true,
    can_view_store: true,
    can_manage_store: true,
  },

  // Registrar handles the full admissions pipeline and student record
  // management (enroll, transfer, withdraw). No access to fees or grades.
  registrar: {
    ...NONE,
    can_manage_admissions: true,
    can_view_student_records: true,
    can_view_store: true,
  },

  // ICT / school admin manages the software. Broad view access for system
  // support, but does not perform operational roles (no fee management,
  // no marking registers). Teaching features are separate.
  school_admin: {
    ...NONE,
    can_view_staff_attendance_board: true,
    can_view_student_records: true,
    can_view_invoices: true,
    can_manage_permissions: true,
    can_view_store: true,
    can_manage_store: true,
  },

  super_admin: ALL,
};

export const DEFAULT_FEATURES: StaffFeatures = NONE;

export const FEATURE_LABELS: Record<keyof StaffFeatures, string> = {
  can_mark_student_attendance: "Mark student attendance",
  can_enter_grades: "Enter grades",
  can_submit_exam_papers: "Submit exam papers",
  can_view_my_classes: "View my classes",
  can_manage_fees: "Manage fees",
  can_view_invoices: "View invoices",
  can_manage_admissions: "Manage admissions",
  can_view_student_records: "View student records",
  can_view_school_overview: "View school overview",
  can_view_staff_attendance_board: "View staff attendance board",
  can_manage_permissions: "Manage staff permissions",
  can_view_store: "View school store",
  can_manage_store: "Manage school store",
};

// Plain-language descriptions shown next to each toggle in the permissions UI.
export const FEATURE_DESCRIPTIONS: Record<keyof StaffFeatures, string> = {
  can_mark_student_attendance:
    "Take the morning register for their assigned class",
  can_enter_grades:
    "Record CA scores and exam results for their assigned subjects",
  can_submit_exam_papers: "Upload exam questions for printing and distribution",
  can_view_my_classes: "See their assigned classes and student rosters",
  can_manage_fees:
    "Create fee types, set amounts per class, and generate invoices",
  can_view_invoices: "See who has paid, who owes, and full payment history",
  can_manage_admissions:
    "Review applications, schedule entrance exams, and admit students",
  can_view_student_records:
    "Access student profiles, documents, and school history",
  can_view_school_overview:
    "See school-wide statistics, performance, and daily snapshot",
  can_view_staff_attendance_board:
    "See daily staff check-in and check-out status",
  can_manage_permissions:
    "Create and edit permission templates, and assign permissions to individual staff members",
  can_view_store:
    "Browse the school store catalogue and view what materials have been assigned to students",
  can_manage_store:
    "Add items to the school store, set prices, and assign materials to students for billing",
};

// Feature groups for the permissions UI — one section per group.
// Keeps related toggles together so school admins can reason by role
// rather than reading raw feature names.
export interface FeatureGroup {
  label: string;
  hint: string; // one sentence explaining who this group is for
  keys: (keyof StaffFeatures)[];
}

export const FEATURE_GROUPS: FeatureGroup[] = [
  {
    label: "Teaching",
    hint: "For staff assigned to specific classes or subjects",
    keys: [
      "can_view_my_classes",
      "can_mark_student_attendance",
      "can_enter_grades",
      "can_submit_exam_papers",
    ],
  },
  {
    label: "Academic Oversight",
    hint: "For principals and vice principals managing school performance",
    keys: ["can_view_school_overview", "can_view_student_records"],
  },
  {
    label: "Admissions",
    hint: "For registrars and principals handling student intake",
    keys: ["can_manage_admissions"],
  },
  {
    label: "Finance",
    hint: "For bursars tracking fee collection and payments",
    keys: ["can_manage_fees", "can_view_invoices"],
  },
  {
    label: "Staff Management",
    hint: "For leadership monitoring staff punctuality and attendance",
    keys: ["can_view_staff_attendance_board", "can_manage_permissions"],
  },
  {
    label: "Store",
    hint: "Control who can browse or manage the school store",
    keys: ["can_view_store", "can_manage_store"],
  },
];
