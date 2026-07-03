"use client";

import { UserRound } from "lucide-react";
import type { ChildFees } from "@/src/lib/api/parentFees";
import { formatCurrency } from "./feeUtils";

export default function FeeCard({
  child,
  onViewAll,
}: {
  child: ChildFees;
  onViewAll: () => void;
}) {
  const isPaid = child.outstandingCompulsory === 0;
  const optionalAvailable = child.fees.some(
    (f) => f.category === "optional" && !f.subscribed
  );

  return (
    <div className="flex flex-col gap-[16px] rounded-[10px] border border-[#ccc] bg-white px-[20px] py-[18px]">
      {/* Top row: avatar + amount/status */}
      <div className="flex items-start justify-between">
        <div className="flex h-[52px] w-[52px] items-center justify-center overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
          <UserRound className="h-[24px] w-[24px] text-[#ccc]" />
        </div>
        <div className="text-right">
          {isPaid ? (
            <p className="text-[18px] font-semibold text-[#1ca95c]">
              Fees paid
            </p>
          ) : (
            <>
              <p className="text-[18px] font-semibold text-[#1b1b1b]">
                {formatCurrency(child.outstandingCompulsory)}
              </p>
              <p className="text-[12px] text-[#888]">Outstanding fee</p>
            </>
          )}
        </div>
      </div>

      {/* Child info */}
      <div className="flex flex-col gap-[3px]">
        <p className="text-[15px] font-medium text-[#1b1b1b]">
          {child.studentName}
        </p>
        <p className="text-[13px] text-[#666]">{child.schoolName}</p>
        <p className="text-[13px] text-[#666]">
          {child.className}
          {child.termName ? ` · ${child.termName}` : ""}
        </p>
        {isPaid && optionalAvailable && (
          <p className="mt-1 text-[12px] text-[#2563eb]">
            Optional fees available
          </p>
        )}
      </div>

      {/* Action */}
      <button
        type="button"
        onClick={onViewAll}
        className="flex h-[40px] w-full items-center justify-center rounded-[6px] bg-[#1ca95c] text-[13px] text-white transition-opacity hover:opacity-90"
      >
        {isPaid ? "View breakdown" : "View & pay fees"}
      </button>
    </div>
  );
}
