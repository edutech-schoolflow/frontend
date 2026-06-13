import { mockResponse } from "./mockClient";
import { MOCK_TEACHER_STATS, MOCK_TODAY_SCHEDULE } from "./mock/teacherData";
import type { TeacherDashboardStats, TimetableSlot } from "@/src/types/teacher";

export const getTeacherDashboardStats =
  async (): Promise<TeacherDashboardStats> => mockResponse(MOCK_TEACHER_STATS);

export const getTeacherTodaySchedule = async (): Promise<TimetableSlot[]> =>
  mockResponse(MOCK_TODAY_SCHEDULE);
