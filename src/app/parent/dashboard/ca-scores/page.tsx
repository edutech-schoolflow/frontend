import { Suspense } from "react";
import ParentCaScores from "@/src/components/parent/dashboard/ca-scores/ParentCaScores";

export default function CaScoresPage() {
  return (
    <Suspense>
      <ParentCaScores />
    </Suspense>
  );
}
