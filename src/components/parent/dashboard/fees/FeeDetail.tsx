"use client";

import { useState } from "react";
import { UserRound, ChevronLeft } from "lucide-react";
import type { ChildFees, ChildFeeItem } from "@/src/lib/api/parentFees";
import { formatCurrency } from "./feeUtils";
import FeePaymentFlow from "./FeePaymentFlow";

export default function FeeDetail({
  child,
  onBack,
}: {
  child: ChildFees;
  onBack: () => void;
}) {
  const [paying, setPaying] = useState<ChildFeeItem | null>(null);

  const totalPaid = child.fees.reduce((s, f) => s + f.paid, 0);

  return (
    <>
      <div>
        <button
          type="button"
          onClick={onBack}
          className="mb-[20px] flex items-center gap-[6px] text-[14px] text-[#666] transition-colors hover:text-[#1b1b1b]"
        >
          <ChevronLeft className="h-[16px] w-[16px]" />
          Back
        </button>

        <h1 className="mb-[20px] text-[24px] font-medium text-[#1b1b1b]">
          All fees
        </h1>

        {/* Child header */}
        <div className="mb-[24px] flex items-center gap-[16px]">
          <div className="flex h-[60px] w-[60px] items-center justify-center overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
            <UserRound className="h-[28px] w-[28px] text-[#ccc]" />
          </div>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[16px] font-semibold text-[#1b1b1b]">
              {child.studentName}
            </p>
            <p className="text-[13px] text-[#666]">{child.schoolName}</p>
            <p className="text-[13px] text-[#666]">
              {child.className}
              {child.termName ? ` · ${child.termName}` : ""}
            </p>
          </div>
        </div>

        {child.fees.length === 0 ? (
          <div className="flex h-[160px] items-center justify-center rounded-[10px] border border-[#eee] bg-white">
            <p className="text-[14px] text-[#888]">
              No fees published for this term yet.
            </p>
          </div>
        ) : (
          <div className="rounded-[10px] border border-[#ccc] bg-white px-[28px] py-[24px]">
            {/* Table header */}
            <div className="mb-[8px] grid grid-cols-[1fr_120px_110px_120px] text-[13px] text-[#888]">
              <span>Fee type</span>
              <span>Amount</span>
              <span>Status</span>
              <span />
            </div>

            {/* Fee rows */}
            <div className="flex flex-col">
              {child.fees.map((fee) => {
                const fullyPaid = fee.balance <= 0 && fee.subscribed;
                const isOptional = fee.category === "optional";
                const canPay =
                  fee.balance > 0 || (isOptional && !fee.subscribed);
                return (
                  <div
                    key={fee.feeTypeId}
                    className="grid grid-cols-[1fr_120px_110px_120px] items-center border-b border-[#f0f0f0] py-[14px] last:border-0"
                  >
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] text-[#1b1b1b]">{fee.name}</p>
                      {isOptional && (
                        <span className="rounded-[4px] bg-[#eff6ff] px-[6px] py-[2px] text-[10px] font-medium text-[#2563eb]">
                          Optional
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="text-[14px] text-[#1b1b1b]">
                        {formatCurrency(fee.amount)}
                      </p>
                      {fee.paid > 0 && fee.balance > 0 && (
                        <p className="text-[11px] text-[#888]">
                          {formatCurrency(fee.paid)} paid
                        </p>
                      )}
                    </div>
                    <span
                      className={`w-fit rounded-[4px] px-[10px] py-[3px] text-[12px] font-medium ${
                        fullyPaid
                          ? "bg-[#daffeb] text-[#1ca95c]"
                          : isOptional && !fee.subscribed
                            ? "bg-[#eff6ff] text-[#2563eb]"
                            : "bg-[#fff4e5] text-[#ff8d28]"
                      }`}
                    >
                      {fullyPaid
                        ? "Paid"
                        : isOptional && !fee.subscribed
                          ? "Available"
                          : "Due"}
                    </span>
                    <div className="flex justify-end">
                      {canPay && (
                        <button
                          type="button"
                          onClick={() => setPaying(fee)}
                          className="rounded-[6px] bg-[#1ca95c] px-[16px] py-[8px] text-[12px] font-medium text-white transition-opacity hover:opacity-90"
                        >
                          {isOptional && !fee.subscribed ? "Subscribe" : "Pay"}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-[16px] flex flex-col gap-[8px] border-t border-[#eee] pt-[16px]">
              <div className="flex items-center justify-between">
                <p className="text-[14px] text-[#666]">
                  Outstanding (compulsory)
                </p>
                <p className="text-[15px] font-semibold text-[#1b1b1b]">
                  {formatCurrency(child.outstandingCompulsory)}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[14px] text-[#666]">Total paid</p>
                <p className="text-[15px] font-semibold text-[#1b1b1b]">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Single-fee payment flow */}
      {paying && (
        <FeePaymentFlow
          studentId={child.studentId}
          studentName={child.studentName}
          fee={paying}
          onClose={() => setPaying(null)}
        />
      )}
    </>
  );
}
