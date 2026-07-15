"use client";

import { useState } from "react";
import { useParentFees } from "@/src/lib/api/useParentFees";
import type { ChildFees } from "@/src/lib/api/parentFees";
import FeeCard from "./FeeCard";
import FeeDetail from "./FeeDetail";

export default function ParentFees() {
  const { data: children = [], isPending } = useParentFees();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = children.find((c) => c.studentId === selectedId) ?? null;

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      {selected ? (
        <FeeDetail
          key={selected.studentId}
          child={selected}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <>
          <h1 className="mb-[24px] text-[24px] font-medium text-[#1b1b1b]">
            School fees
          </h1>

          {isPending ? (
            <div className="flex h-[200px] items-center justify-center">
              <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#eee] border-t-[#1ca95c]" />
            </div>
          ) : children.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-[14px] text-[#888]">
                No fees yet. Once your child is enrolled and the school
                publishes fees, they appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-[20px]">
              {children.map((c: ChildFees) => (
                <FeeCard
                  key={c.studentId}
                  child={c}
                  onViewAll={() => setSelectedId(c.studentId)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
