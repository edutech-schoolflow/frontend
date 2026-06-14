import { Suspense } from "react";
import TeacherExamsList from "@/src/components/teacher/exams/TeacherExamsList";

export default function TeacherExamsRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-[80px]">
          <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      }
    >
      <TeacherExamsList />
    </Suspense>
  );
}
