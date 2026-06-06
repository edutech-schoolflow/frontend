"use client";

import { useEffect, useState } from "react";
import { UserRound } from "lucide-react";
import { getPaymentHistory } from "@/src/lib/api/payments";
import type { PaymentHistoryRecord } from "@/src/types/fee";
import { formatCurrency } from "../fees/feeUtils";

// ─── helpers ──────────────────────────────────────────────────────────────────

function monthKey(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function shortDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function methodLabel(method: PaymentHistoryRecord["method"]) {
  const map: Record<PaymentHistoryRecord["method"], string> = {
    card: "Card",
    bank_transfer: "Bank transfer",
    ussd: "USSD",
    wallet: "Wallet",
  };
  return map[method];
}

function groupByMonth(records: PaymentHistoryRecord[]) {
  const order: string[] = [];
  const map: Record<string, PaymentHistoryRecord[]> = {};
  for (const r of records) {
    const key = monthKey(r.paidAt);
    if (!map[key]) {
      map[key] = [];
      order.push(key);
    }
    map[key].push(r);
  }
  return order.map((key) => ({ month: key, records: map[key] }));
}

// ─── sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: PaymentHistoryRecord["status"] }) {
  const styles = {
    successful: "bg-[#daffeb] text-[#1ca95c]",
    failed: "bg-[#ffe4e4] text-[#e84040]",
    pending: "bg-[#fff4e5] text-[#ff8d28]",
  };
  const labels = {
    successful: "Successful",
    failed: "Failed",
    pending: "Pending",
  };
  return (
    <span
      className={`w-fit rounded-[4px] px-[10px] py-[3px] text-[12px] font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function TransactionRow({ record }: { record: PaymentHistoryRecord }) {
  return (
    <div className="grid grid-cols-[80px_200px_1fr_130px_130px_110px] items-center gap-[8px] border-b border-[#f0f0f0] py-[16px] last:border-0">
      {/* Date */}
      <p className="text-[13px] text-[#888]">{shortDate(record.paidAt)}</p>

      {/* Child */}
      <div className="flex items-center gap-[10px]">
        <div className="h-[36px] w-[36px] shrink-0 overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
          {record.studentPhotoUrl ? (
            <img
              src={record.studentPhotoUrl}
              alt={record.studentName}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <UserRound className="h-[16px] w-[16px] text-[#ccc]" />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-[#1b1b1b]">
            {record.studentName.split(" ")[0]}
          </p>
          <p className="truncate text-[12px] text-[#888]">{record.className}</p>
        </div>
      </div>

      {/* Fee types + term */}
      <div className="min-w-0">
        <p className="truncate text-[13px] text-[#1b1b1b]">
          {record.feeTypes.join(" · ")}
        </p>
        <p className="text-[12px] text-[#888]">{record.termName}</p>
      </div>

      {/* Method */}
      <p className="text-[13px] text-[#666]">{methodLabel(record.method)}</p>

      {/* Amount */}
      <p
        className={`text-[14px] font-semibold ${
          record.status === "failed"
            ? "text-[#e84040] line-through"
            : "text-[#1b1b1b]"
        }`}
      >
        {formatCurrency(record.amount)}
      </p>

      {/* Status */}
      <StatusBadge status={record.status} />
    </div>
  );
}

function MonthGroup({
  month,
  records,
}: {
  month: string;
  records: PaymentHistoryRecord[];
}) {
  const total = records
    .filter((r) => r.status === "successful")
    .reduce((s, r) => s + r.amount, 0);

  return (
    <div className="mb-[24px]">
      <div className="mb-[8px] flex items-center justify-between">
        <p className="text-[13px] font-semibold text-[#1b1b1b]">{month}</p>
        <p className="text-[12px] text-[#888]">
          {records.length} transaction{records.length !== 1 ? "s" : ""} ·{" "}
          {formatCurrency(total)}
        </p>
      </div>
      <div className="rounded-[10px] border border-[#ccc] bg-white px-[24px]">
        {/* Table header */}
        <div className="grid grid-cols-[80px_200px_1fr_130px_130px_110px] gap-[8px] border-b border-[#eee] py-[10px] text-[12px] text-[#aaa]">
          <span>Date</span>
          <span>Child</span>
          <span>Fees paid</span>
          <span>Method</span>
          <span>Amount</span>
          <span>Status</span>
        </div>
        {records.map((r) => (
          <TransactionRow key={r.id} record={r} />
        ))}
      </div>
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

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

  const statusTabs: { key: "all" | "successful" | "failed"; label: string }[] =
    [
      { key: "all", label: "All" },
      { key: "successful", label: "Successful" },
      { key: "failed", label: "Failed" },
    ];

  if (loading) {
    return (
      <div className="flex h-[300px] items-center justify-center">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#eee] border-t-[#1ca95c]" />
      </div>
    );
  }

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <h1 className="mb-[24px] text-[24px] font-medium text-[#1b1b1b]">
        Payment history
      </h1>

      {/* Summary strip */}
      <div className="mb-[28px] flex gap-[16px]">
        <div className="flex flex-1 flex-col gap-[4px] rounded-[10px] border border-[#ccc] bg-white px-[20px] py-[16px]">
          <p className="text-[12px] text-[#888]">Total paid</p>
          <p className="text-[22px] font-semibold text-[#1b1b1b]">
            {formatCurrency(totalPaid)}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-[4px] rounded-[10px] border border-[#ccc] bg-white px-[20px] py-[16px]">
          <p className="text-[12px] text-[#888]">Transactions</p>
          <p className="text-[22px] font-semibold text-[#1b1b1b]">
            {totalTransactions}
          </p>
        </div>
        <div className="flex flex-1 flex-col gap-[4px] rounded-[10px] border border-[#ccc] bg-white px-[20px] py-[16px]">
          <p className="text-[12px] text-[#888]">Children</p>
          <p className="text-[22px] font-semibold text-[#1b1b1b]">
            {children.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-[20px] flex items-center gap-[16px]">
        {/* Child filter */}
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

        {/* Status tabs */}
        <div className="flex rounded-[6px] border border-[#ccc] bg-white p-[3px]">
          {statusTabs.map((tab) => (
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

      {/* Transaction list */}
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
