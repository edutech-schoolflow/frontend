import { Suspense } from "react";
import TeacherGradesPage from "@/src/components/teacher/grades/TeacherGradesPage";

export default function TeacherGradesRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-[80px]">
          <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      }
    >
      <TeacherGradesPage />
    </Suspense>
  );
}
