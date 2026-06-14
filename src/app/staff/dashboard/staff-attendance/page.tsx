import StaffAttendanceBoard from "@/src/components/school/staff/StaffAttendanceBoard";

export default function StaffAttendancePage() {
  return (
    <div className="p-[30px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Staff Attendance
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          View daily check-in records for all school staff.
        </p>
      </div>
      <StaffAttendanceBoard />
    </div>
  );
}
