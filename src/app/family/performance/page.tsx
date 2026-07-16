import { Suspense } from "react";
import ParentPerformance from "@/src/components/parent/dashboard/performance/ParentPerformance";

export default function PerformancePage() {
  return (
    <Suspense>
      <ParentPerformance />
    </Suspense>
  );
}
