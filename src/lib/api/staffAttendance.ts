import { apiGet, apiPost, apiPut } from "./client";
import type {
  StaffCheckIn,
  StaffCheckInStatus,
  StaffAttendanceSettings,
} from "@/src/types/staffAttendance";

// LIVE — /api/v1/staff-attendance (Workforce). "staffId" everywhere is the AFFILIATION id (the
// per-school employment record), the same id the staff directory returns — one key for both.

interface CheckInDto {
  id: string;
  staffId: string;
  date: string;
  checkInTime: string;
  lat?: number | null;
  lng?: number | null;
  distanceMeters: number;
  status: StaffCheckInStatus;
  isManualOverride: boolean;
  createdAt: string;
}

const toCheckIn = (d: CheckInDto): StaffCheckIn => ({
  id: d.id,
  staffId: d.staffId,
  date: d.date,
  checkInTime: d.checkInTime,
  lat: d.lat ?? 0,
  lng: d.lng ?? 0,
  distanceMeters: d.distanceMeters,
  status: d.status,
  isManualOverride: d.isManualOverride,
  createdAt: d.createdAt,
});

const toMap = (rows: CheckInDto[]): Record<string, StaffCheckIn> => {
  const map: Record<string, StaffCheckIn> = {};
  for (const r of rows) map[r.staffId] = toCheckIn(r);
  return map;
};

export const getStaffAttendanceSettings =
  async (): Promise<StaffAttendanceSettings> => {
    const { data } = await apiGet<{
      schoolLocation?: { lat: number; lng: number } | null;
      geofenceRadius: number;
      checkInCutoff: string;
      workStartTime: string;
    }>("/staff-attendance/settings");
    return {
      schoolLocation: data.schoolLocation ?? { lat: 0, lng: 0 },
      geofenceRadius: data.geofenceRadius,
      checkInCutoff: data.checkInCutoff,
      workStartTime: data.workStartTime,
    };
  };

export const getTodayStaffAttendance = async (): Promise<
  Record<string, StaffCheckIn>
> => {
  const { data } = await apiGet<CheckInDto[]>("/staff-attendance");
  return toMap(data);
};

export const getStaffAttendanceForDate = async (
  date: string
): Promise<Record<string, StaffCheckIn>> => {
  const { data } = await apiGet<CheckInDto[]>(
    `/staff-attendance?date=${encodeURIComponent(date)}`
  );
  return toMap(data);
};

// The backend derives WHO is checking in from the session (affiliation claim) — the staffId
// argument survives only for call-site compatibility.
export const staffCheckIn = async (
  coords: { lat: number; lng: number },
  _staffId?: string
): Promise<StaffCheckIn> => {
  const { data } = await apiPost<CheckInDto>("/staff-attendance/check-in", coords);
  return toCheckIn(data);
};

export const getMyCheckInStatus = async (
  _userId?: string | undefined
): Promise<StaffCheckIn | null> => {
  const { data } = await apiGet<CheckInDto | null>("/staff-attendance/me/today");
  return data ? toCheckIn(data) : null;
};

export interface MonthlyAttendanceSummary {
  month: string; // "2026-06"
  label: string; // "June 2026"
  present: number;
  late: number;
  absent: number;
}

export const getMyMonthlyAttendanceSummary = async (
  _userId?: string | undefined,
  _activeSchoolId?: string | null
): Promise<MonthlyAttendanceSummary[]> => {
  const { data } = await apiGet<MonthlyAttendanceSummary[]>(
    "/staff-attendance/me/summary"
  );
  return data;
};

export const overrideStaffAttendance = async (
  staffId: string,
  date: string,
  status: StaffCheckInStatus
): Promise<StaffCheckIn> => {
  const { data } = await apiPut<CheckInDto>("/staff-attendance/override", {
    staffId,
    date,
    status,
  });
  return toCheckIn(data);
};
