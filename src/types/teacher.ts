export interface TeacherDashboardStats {
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
