"use client";

import { useEffect, useState } from "react";
import { getParentFeeSummaries } from "@/src/lib/api/fees";
import type { ParentFeeSummary } from "@/src/types/fee";
import FeeCard from "./FeeCard";
import FeeDetail from "./FeeDetail";

export default function ParentFees() {
  const [summaries, setSummaries] = useState<ParentFeeSummary[]>([]);
  const [selected, setSelected] = useState<ParentFeeSummary | null>(null);

  useEffect(() => {
    getParentFeeSummaries().then(setSummaries);
  }, []);

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      {selected ? (
        <FeeDetail
          key={selected.studentId}
          summary={selected}
          onBack={() => setSelected(null)}
        />
      ) : (
        <>
          <h1 className="mb-[24px] text-[24px] font-medium text-[#1b1b1b]">
            School fees
          </h1>
          <div className="grid grid-cols-3 gap-[20px]">
            {summaries.map((s) => (
              <FeeCard
                key={s.studentId}
                summary={s}
                onViewAll={() => setSelected(s)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
