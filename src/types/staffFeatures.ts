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
};

export const ROLE_FEATURES: Record<StaffRole, StaffFeatures> = {
  teacher: {
    ...NONE,
    can_mark_student_attendance: true,
    can_enter_grades: true,
    can_submit_exam_papers: true,
    can_view_my_classes: true,
  },
  principal: {
    ...NONE,
    can_view_school_overview: true,
    can_view_staff_attendance_board: true,
  },
  vice_principal: {
    ...NONE,
    can_view_school_overview: true,
    can_view_staff_attendance_board: true,
  },
  bursar: {
    ...NONE,
    can_manage_fees: true,
    can_view_invoices: true,
  },
  registrar: {
    ...NONE,
    can_manage_admissions: true,
    can_view_student_records: true,
  },
  school_admin: ALL,
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
};
