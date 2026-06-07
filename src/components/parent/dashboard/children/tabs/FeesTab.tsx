"use client";

import { useEffect, useState } from "react";
import { getParentFeeInvoice } from "@/src/lib/api/fees";
import type { Invoice } from "@/src/types/fee";
import Spinner from "./Spinner";

const STATUS_CLS: Record<string, string> = {
  paid: "text-[#1ca95c] bg-[#e8f8ef]",
  partial: "text-[#ff8d28] bg-[#fff3e8]",
  unpaid: "text-[#e53e3e] bg-[#fff5f5]",
};

export default function FeesTab({ studentId }: { studentId: string }) {
  const [invoice, setInvoice] = useState<Invoice | null | undefined>(undefined);

  useEffect(() => {
    getParentFeeInvoice(studentId).then((inv) => setInvoice(inv ?? null));
  }, [studentId]);

  if (invoice === undefined) return <Spinner />;
  if (!invoice)
    return (
      <p className="py-[48px] text-center text-[14px] text-[#888]">
        No fee invoice available.
      </p>
    );

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium text-[#1b1b1b]">
          {invoice.termName}
        </p>
        {invoice.dueDate && (
          <p className="text-[13px] text-[#888]">
            Due:{" "}
            {new Date(invoice.dueDate).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-[10px] border border-[#e0e0e0]">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-[#f9f9f9]">
              <th className="px-[16px] py-[12px] font-medium text-[#888]">
                Fee item
              </th>
              <th className="px-[16px] py-[12px] text-right font-medium text-[#888]">
                Amount
              </th>
              <th className="px-[16px] py-[12px] text-right font-medium text-[#888]">
                Paid
              </th>
              <th className="px-[16px] py-[12px] text-right font-medium text-[#888]">
                Balance
              </th>
              <th className="px-[16px] py-[12px] font-medium text-[#888]">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.lines.map((line) => (
              <tr key={line.feeTypeId} className="border-t border-[#f0f0f0]">
                <td className="px-[16px] py-[12px] text-[#1b1b1b]">
                  {line.feeTypeName}
                </td>
                <td className="px-[16px] py-[12px] text-right text-[#1b1b1b]">
                  ₦{line.amount.toLocaleString()}
                </td>
                <td className="px-[16px] py-[12px] text-right text-[#1ca95c]">
                  ₦{line.paid.toLocaleString()}
                </td>
                <td className="px-[16px] py-[12px] text-right font-medium text-[#1b1b1b]">
                  ₦{line.balance.toLocaleString()}
                </td>
                <td className="px-[16px] py-[12px]">
                  <span
                    className={`rounded-full px-[10px] py-[3px] text-[11px] font-medium capitalize ${STATUS_CLS[line.status] ?? ""}`}
                  >
                    {line.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-[8px] rounded-[10px] bg-[#f9f9f9] px-[20px] py-[16px]">
        <div className="flex justify-between text-[13px] text-[#666]">
          <span>Total billed</span>
          <span>₦{invoice.totalAmount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[13px] text-[#1ca95c]">
          <span>Total paid</span>
          <span>₦{invoice.totalPaid.toLocaleString()}</span>
        </div>
        <div className="my-[4px] h-px bg-[#e0e0e0]" />
        <div className="flex justify-between text-[15px] font-semibold text-[#1b1b1b]">
          <span>Outstanding</span>
          <span
            className={
              invoice.balance > 0 ? "text-[#e53e3e]" : "text-[#1ca95c]"
            }
          >
            ₦{invoice.balance.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
