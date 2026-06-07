"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { UserRound, ChevronLeft } from "lucide-react";
import { getParentFeeInvoice } from "@/src/lib/api/fees";
import type { InvoiceLine, Invoice, ParentFeeSummary } from "@/src/types/fee";
import {
  formatCurrency,
  formatDeadlineBanner,
  getSelectedTotal,
} from "./feeUtils";
import FeePaymentFlow from "./FeePaymentFlow";

export default function FeeDetail({
  summary,
  onBack,
}: {
  summary: ParentFeeSummary;
  onBack: () => void;
}) {
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [flowLines, setFlowLines] = useState<InvoiceLine[] | null>(null);

  useEffect(() => {
    getParentFeeInvoice(summary.studentId).then((inv) => {
      setInvoice(inv ?? null);
      setSelectedIds(new Set());
    });
  }, [summary.studentId]);

  const toggleLine = (feeTypeId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(feeTypeId)) {
        next.delete(feeTypeId);
      } else {
        next.add(feeTypeId);
      }
      return next;
    });
  };

  const unpaidLines = invoice?.lines.filter((l) => l.status !== "paid") ?? [];
  const selectedLines = unpaidLines.filter((l) => selectedIds.has(l.feeTypeId));
  const selectedTotal = invoice
    ? getSelectedTotal(invoice.lines, selectedIds)
    : 0;

  function openFlow(type: "all" | "selected") {
    setFlowLines(type === "all" ? unpaidLines : selectedLines);
  }

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
          <div className="relative h-[60px] w-[60px] overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
            {summary.photoUrl ? (
              <Image
                src={summary.photoUrl}
                alt={summary.studentName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <UserRound className="h-[28px] w-[28px] text-[#ccc]" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-[2px]">
            <p className="text-[16px] font-semibold text-[#1b1b1b]">
              {summary.studentName}
            </p>
            <p className="text-[13px] text-[#666]">{summary.schoolName}</p>
            <p className="text-[13px] text-[#666]">
              {summary.className} · {summary.termName}
            </p>
          </div>
        </div>

        {/* Loading */}
        {invoice === undefined && (
          <div className="flex h-[200px] items-center justify-center">
            <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#eee] border-t-[#1ca95c]" />
          </div>
        )}

        {/* Empty */}
        {invoice === null && (
          <div className="flex h-[200px] items-center justify-center">
            <p className="text-[14px] text-[#888]">
              No fee record found for this term.
            </p>
          </div>
        )}

        {invoice && (
          <div className="rounded-[10px] border border-[#ccc] bg-white px-[28px] py-[24px]">
            {/* Deadline banner */}
            {invoice.dueDate && invoice.balance > 0 && (
              <div className="mb-[20px] rounded-[6px] bg-[#fff0f0] px-[16px] py-[12px] text-center">
                <p className="text-[13px] font-medium text-[#e84040]">
                  {formatDeadlineBanner(invoice.dueDate)}
                </p>
              </div>
            )}

            {/* Table header */}
            <div className="mb-[8px] grid grid-cols-[40px_1fr_120px_80px] text-[13px] text-[#888]">
              <span />
              <span>Fees type</span>
              <span>Amount</span>
              <span>Status</span>
            </div>

            {/* Fee rows */}
            <div className="flex flex-col">
              {invoice.lines.map((line) => {
                const isPaid = line.status === "paid";
                const isChecked = selectedIds.has(line.feeTypeId);
                return (
                  <div
                    key={line.feeTypeId}
                    onClick={() => !isPaid && toggleLine(line.feeTypeId)}
                    className={`grid grid-cols-[40px_1fr_120px_80px] items-center border-b border-[#f0f0f0] py-[14px] last:border-0 ${!isPaid ? "cursor-pointer hover:bg-[#fafafa]" : ""} ${isChecked ? "bg-[#f6fff9]" : ""}`}
                  >
                    <div className="flex items-center">
                      {!isPaid && (
                        <div
                          className="flex h-[20px] w-[20px] items-center justify-center rounded-[4px] border-2 transition-colors"
                          style={{
                            borderColor: isChecked ? "#1ca95c" : "#ccc",
                            backgroundColor: isChecked
                              ? "#1ca95c"
                              : "transparent",
                          }}
                        >
                          {isChecked && (
                            <svg
                              viewBox="0 0 12 10"
                              fill="none"
                              className="h-[10px] w-[10px]"
                            >
                              <path
                                d="M1 5l3.5 3.5L11 1"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-[14px] text-[#1b1b1b]">
                      {line.feeTypeName}
                    </p>
                    <p className="text-[14px] text-[#1b1b1b]">
                      {formatCurrency(line.amount)}
                    </p>
                    <span
                      className={`w-fit rounded-[4px] px-[10px] py-[3px] text-[12px] font-medium ${
                        isPaid
                          ? "bg-[#daffeb] text-[#1ca95c]"
                          : "bg-[#fff4e5] text-[#ff8d28]"
                      }`}
                    >
                      {isPaid ? "Paid" : "Due"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="mt-[16px] flex flex-col gap-[8px] border-t border-[#eee] pt-[16px]">
              {invoice.balance > 0 && (
                <div className="flex items-center justify-between">
                  <p className="text-[14px] text-[#666]">Outstanding fees</p>
                  <p className="text-[15px] font-semibold text-[#1b1b1b]">
                    {formatCurrency(invoice.balance)}
                  </p>
                </div>
              )}
              <div className="flex items-center justify-between">
                <p className="text-[14px] text-[#666]">Total paid</p>
                <p className="text-[15px] font-semibold text-[#1b1b1b]">
                  {formatCurrency(invoice.totalPaid)}
                </p>
              </div>
            </div>

            {/* Payment buttons */}
            {invoice.balance > 0 && (
              <div className="mt-[24px] flex gap-[16px]">
                <button
                  type="button"
                  onClick={() => openFlow("all")}
                  className="flex h-[48px] flex-1 items-center justify-center rounded-[6px] bg-[#1ca95c] text-[14px] font-medium text-white transition-opacity hover:opacity-90"
                >
                  Pay all ({formatCurrency(invoice.balance)})
                </button>
                <button
                  type="button"
                  disabled={selectedIds.size === 0}
                  onClick={() => openFlow("selected")}
                  className="flex h-[48px] flex-1 items-center justify-center rounded-[6px] border border-[#1ca95c] text-[14px] font-medium text-[#1ca95c] transition-opacity hover:opacity-80 disabled:border-[#ccc] disabled:text-[#ccc]"
                >
                  {selectedIds.size > 0
                    ? `Pay selected (${formatCurrency(selectedTotal)})`
                    : "Pay selected"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment flow overlay */}
      {flowLines && invoice && (
        <FeePaymentFlow
          invoiceId={invoice.id}
          studentName={summary.studentName}
          lines={flowLines}
          total={flowLines.reduce((s, l) => s + l.balance, 0)}
          onClose={() => setFlowLines(null)}
        />
      )}
    </>
  );
}
