export interface StaffDashboardStats {
  armsCount: number;
  totalStudents: number;
  examsSubmitted: number;
  attendanceMarkedToday: boolean;
}

export interface TimetableSlot {
  period: string;
  time: string;
  subject: string;
  classArm: string;
}
