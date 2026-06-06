"use client";

import Image from "next/image";
import { UserRound } from "lucide-react";
import type { ParentFeeSummary } from "@/src/types/fee";
import { formatCurrency } from "./feeUtils";

export default function FeeCard({
  summary,
  onViewAll,
}: {
  summary: ParentFeeSummary;
  onViewAll: () => void;
}) {
  const isPaid = summary.outstandingFees === 0;

  return (
    <div className="flex flex-col gap-[16px] rounded-[10px] border border-[#ccc] bg-white px-[20px] py-[18px]">
      {/* Top row: photo + amount/status */}
      <div className="flex items-start justify-between">
        <div className="relative h-[52px] w-[52px] overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
          {summary.photoUrl ? (
            <Image
              src={summary.photoUrl}
              alt={summary.studentName}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserRound className="h-[24px] w-[24px] text-[#ccc]" />
            </div>
          )}
        </div>
        <div className="text-right">
          {isPaid ? (
            <p className="text-[18px] font-semibold text-[#1ca95c]">
              Fees paid
            </p>
          ) : (
            <>
              <p className="text-[18px] font-semibold text-[#1b1b1b]">
                {formatCurrency(summary.outstandingFees)}
              </p>
              <p className="text-[12px] text-[#888]">Outstanding fee</p>
            </>
          )}
        </div>
      </div>

      {/* Child info */}
      <div className="flex flex-col gap-[3px]">
        <p className="text-[15px] font-medium text-[#1b1b1b]">
          {summary.studentName}
        </p>
        <p className="text-[13px] text-[#666]">{summary.schoolName}</p>
        <p className="text-[13px] text-[#666]">
          {summary.className} · {summary.termName}
        </p>
      </div>

      {/* Actions */}
      {isPaid ? (
        <button
          type="button"
          onClick={onViewAll}
          className="flex h-[40px] w-full items-center justify-center rounded-[6px] bg-[#1ca95c] text-[13px] text-white transition-opacity hover:opacity-90"
        >
          View breakdown
        </button>
      ) : (
        <div className="flex gap-[10px]">
          <button
            type="button"
            onClick={onViewAll}
            className="flex h-[40px] flex-1 items-center justify-center rounded-[6px] bg-[#1ca95c] text-[13px] text-white transition-opacity hover:opacity-90"
          >
            Pay fee
          </button>
          <button
            type="button"
            onClick={onViewAll}
            className="flex h-[40px] flex-1 items-center justify-center rounded-[6px] border border-[#1ca95c] text-[13px] text-[#1ca95c] transition-opacity hover:opacity-80"
          >
            View all fees
          </button>
        </div>
      )}
    </div>
  );
}
