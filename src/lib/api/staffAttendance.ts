import { mockResponse } from "./mockClient";
import {
  MOCK_STAFF,
  MOCK_STAFF_CHECKINS,
  MOCK_ATTENDANCE_SETTINGS,
} from "./mock/schoolData";
import type {
  StaffCheckIn,
  StaffCheckInStatus,
} from "@/src/types/staffAttendance";

function haversine(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export const getStaffAttendanceSettings = async () =>
  mockResponse(MOCK_ATTENDANCE_SETTINGS);

export const getTodayStaffAttendance = async (): Promise<
  Record<string, StaffCheckIn>
> => {
  const today = todayIso();
  const map: Record<string, StaffCheckIn> = {};
  for (const c of MOCK_STAFF_CHECKINS) {
    if (c.date === today) map[c.staffId] = c;
  }
  return mockResponse(map);
};

export const getStaffAttendanceForDate = async (
  date: string
): Promise<Record<string, StaffCheckIn>> => {
  const map: Record<string, StaffCheckIn> = {};
  for (const c of MOCK_STAFF_CHECKINS) {
    if (c.date === date) map[c.staffId] = c;
  }
  return mockResponse(map);
};

// In a real implementation this validates distance against geofenceRadius.
// In the mock we accept any location and simulate being within the fence.
export const staffCheckIn = async (
  coords: { lat: number; lng: number },
  staffId: string
): Promise<StaffCheckIn> => {
  const { schoolLocation } = MOCK_ATTENDANCE_SETTINGS;
  const distanceMeters = Math.round(
    haversine(coords.lat, coords.lng, schoolLocation.lat, schoolLocation.lng)
  );
  const time = nowHHMM();
  const status: StaffCheckInStatus =
    time <= MOCK_ATTENDANCE_SETTINGS.checkInCutoff ? "present" : "late";

  const existing = MOCK_STAFF_CHECKINS.findIndex(
    (c) => c.staffId === staffId && c.date === todayIso()
  );

  const record: StaffCheckIn = {
    id: existing >= 0 ? MOCK_STAFF_CHECKINS[existing].id : `chk-${Date.now()}`,
    staffId,
    date: todayIso(),
    checkInTime: time,
    lat: coords.lat,
    lng: coords.lng,
    distanceMeters,
    status,
    isManualOverride: false,
    createdAt: new Date().toISOString(),
  };

  if (existing >= 0) {
    MOCK_STAFF_CHECKINS[existing] = record;
  } else {
    MOCK_STAFF_CHECKINS.push(record);
  }

  return mockResponse(record);
};

export const getMyCheckInStatus = async (
  userId: string | undefined
): Promise<StaffCheckIn | null> => {
  const staff = MOCK_STAFF.find((s) => s.userId === userId);
  if (!staff) return mockResponse(null);
  const today = todayIso();
  const record =
    MOCK_STAFF_CHECKINS.find(
      (c) => c.staffId === staff.id && c.date === today
    ) ?? null;
  return mockResponse(record);
};

export interface MonthlyAttendanceSummary {
  month: string; // "2026-06"
  label: string; // "June 2026"
  present: number;
  late: number;
  absent: number;
}

// Returns per-month attendance totals for a staff member, newest month first.
export const getMyMonthlyAttendanceSummary = async (
  userId: string | undefined,
  activeSchoolId?: string | null
): Promise<MonthlyAttendanceSummary[]> => {
  if (!userId) return mockResponse([]);
  const records = MOCK_STAFF.filter(
    (s) => s.userId === userId && s.status === "active"
  );
  if (!records.length) return mockResponse([]);
  const staff =
    (activeSchoolId && records.find((s) => s.schoolId === activeSchoolId)) ||
    records[0];

  const staffCheckins = MOCK_STAFF_CHECKINS.filter(
    (c) => c.staffId === staff.id
  );

  const byMonth: Record<string, MonthlyAttendanceSummary> = {};
  for (const c of staffCheckins) {
    const month = c.date.slice(0, 7); // "2026-06"
    if (!byMonth[month]) {
      const [year, mo] = month.split("-");
      const label = new Date(
        Number(year),
        Number(mo) - 1,
        1
      ).toLocaleDateString("en-NG", { month: "long", year: "numeric" });
      byMonth[month] = { month, label, present: 0, late: 0, absent: 0 };
    }
    byMonth[month][c.status]++;
  }

  return mockResponse(
    Object.values(byMonth).sort((a, b) => b.month.localeCompare(a.month))
  );
};

export const overrideStaffAttendance = async (
  staffId: string,
  date: string,
  status: StaffCheckInStatus
): Promise<StaffCheckIn> => {
  const existing = MOCK_STAFF_CHECKINS.findIndex(
    (c) => c.staffId === staffId && c.date === date
  );

  if (existing >= 0) {
    MOCK_STAFF_CHECKINS[existing] = {
      ...MOCK_STAFF_CHECKINS[existing],
      status,
      isManualOverride: true,
    };
    return mockResponse(MOCK_STAFF_CHECKINS[existing]);
  }

  // Absent override — no check-in record exists
  const record: StaffCheckIn = {
    id: `chk-ovr-${Date.now()}`,
    staffId,
    date,
    checkInTime: "--:--",
    lat: 0,
    lng: 0,
    distanceMeters: 0,
    status,
    isManualOverride: true,
    createdAt: new Date().toISOString(),
  };
  MOCK_STAFF_CHECKINS.push(record);
  return mockResponse(record);
};
