export interface TeacherDashboardStats {
  classesToday: number;
  totalStudents: number;
  pendingTasks: number;
}

export interface TimetableSlot {
  period: string;
  time: string;
  subject: string;
  classArm: string;
}
