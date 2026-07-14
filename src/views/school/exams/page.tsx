import { Suspense } from "react";
import SchoolExamsPage from "@/src/components/school/exams/SchoolExamsPage";

export default function SchoolExamsRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-[80px]">
          <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
        </div>
      }
    >
      <SchoolExamsPage />
    </Suspense>
  );
}
