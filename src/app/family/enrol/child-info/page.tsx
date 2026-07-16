import { Suspense } from "react";
import EnrolStep2 from "@/src/components/parent/dashboard/enrol/EnrolStep2";

export default function EnrolChildInfoPage() {
  return (
    <Suspense>
      <EnrolStep2 />
    </Suspense>
  );
}
