import client from "./client";

export type AttendanceStatus = "present" | "absent" | "late";

export interface AttendanceEntry {
  studentId: string;
  status: AttendanceStatus;
}

export const recordAttendance = async (
  classId: string,
  date: string,
  entries: AttendanceEntry[]
) => {
  const { data } = await client.post("/attendance/record", {
    classId,
    date,
    entries,
  });
  return data;
};

export const getClassAttendance = async (classId: string, date: string) => {
  const { data } = await client.get(`/attendance/class/${classId}`, {
    params: { date },
  });
  return data as AttendanceEntry[];
};
