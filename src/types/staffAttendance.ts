export type StaffCheckInStatus = "present" | "late" | "absent";

export interface StaffCheckIn {
  id: string;
  staffId: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:MM 24h
  lat: number;
  lng: number;
  distanceMeters: number;
  status: StaffCheckInStatus;
  isManualOverride: boolean;
  overriddenBy?: string;
  createdAt: string;
}

export interface StaffAttendanceSettings {
  schoolLocation: { lat: number; lng: number };
  geofenceRadius: number; // meters
  checkInCutoff: string; // HH:MM — at or before = present, after = late
  workStartTime: string; // HH:MM display
}
