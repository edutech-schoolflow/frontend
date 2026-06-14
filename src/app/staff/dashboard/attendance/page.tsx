import { Suspense } from "react";
import StaffAttendancePage from "@/src/components/teacher/attendance/TeacherAttendancePage";

export default function StaffAttendanceRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-[80px]">
          <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      }
    >
      <StaffAttendancePage />
    </Suspense>
  );
}
