"use client";

import { useEffect, useState } from "react";
import { getPaymentHistory } from "@/src/lib/api/payments";
import type { PaymentHistoryRecord } from "@/src/types/fee";
import { formatCurrency } from "../fees/feeUtils";
import { groupByMonth } from "./paymentUtils";
import MonthGroup from "./MonthGroup";

const STATUS_TABS: { key: "all" | "successful" | "failed"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "successful", label: "Successful" },
  { key: "failed", label: "Failed" },
];

export default function ParentPaymentHistory() {
  const [records, setRecords] = useState<PaymentHistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "successful" | "failed"
  >("all");

  useEffect(() => {
    getPaymentHistory().then((data) => {
      setRecords(data);
      setLoading(false);
    });
  }, []);

  const children = Array.from(
    new Map(
      records.map((r) => [r.studentId, r.studentName.split(" ")[0]])
    ).entries()
  );

  const filtered = records
    .filter((r) => selectedChild === "all" || r.studentId === selectedChild)
    .filter((r) => selectedStatus === "all" || r.status === selectedStatus);

  const grouped = groupByMonth(filtered);
  const totalPaid = records
    .filter((r) => r.status === "successful")
    .reduce((s, r) => s + r.amount, 0);
  const totalTransactions = records.filter(
    (r) => r.status === "successful"
  ).length;

  if (loading)
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#eee] border-t-[#1ca95c]" />
      </div>
    );

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <h1 className="mb-[24px] text-[24px] font-medium text-[#1b1b1b]">
        Payment history
      </h1>

      <div className="mb-[28px] flex gap-[16px]">
        {[
          { label: "Total paid", value: formatCurrency(totalPaid) },
          { label: "Transactions", value: String(totalTransactions) },
          { label: "Children", value: String(children.length) },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-1 flex-col gap-[4px] rounded-[10px] border border-[#ccc] bg-white px-[20px] py-[16px]"
          >
            <p className="text-[12px] text-[#888]">{label}</p>
            <p className="text-[22px] font-semibold text-[#1b1b1b]">{value}</p>
          </div>
        ))}
      </div>

      <div className="mb-[20px] flex items-center gap-[16px]">
        <select
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
          className="h-[36px] rounded-[6px] border border-[#ccc] bg-white px-[12px] text-[13px] text-[#1b1b1b] focus:outline-none"
        >
          <option value="all">All children</option>
          {children.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
        <div className="flex rounded-[6px] border border-[#ccc] bg-white p-[3px]">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedStatus(tab.key)}
              className={`rounded-[4px] px-[14px] py-[5px] text-[13px] transition-colors ${
                selectedStatus === tab.key
                  ? "bg-[#1ca95c] text-white"
                  : "text-[#666] hover:text-[#1b1b1b]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="flex h-[200px] items-center justify-center rounded-[10px] border border-[#ccc] bg-white">
          <p className="text-[14px] text-[#888]">No transactions found.</p>
        </div>
      ) : (
        grouped.map((g) => (
          <MonthGroup key={g.month} month={g.month} records={g.records} />
        ))
      )}
    </div>
  );
}
