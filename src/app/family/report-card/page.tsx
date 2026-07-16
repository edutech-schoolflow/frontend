import { Suspense } from "react";
import ParentReportCard from "@/src/components/parent/dashboard/report/ParentReportCard";

export default function ReportCardPage() {
  return (
    <Suspense>
      <ParentReportCard />
    </Suspense>
  );
}
