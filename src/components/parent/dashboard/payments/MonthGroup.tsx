import type { PaymentHistoryRecord } from "@/src/types/fee";
import { formatCurrency } from "../fees/feeUtils";
import TransactionRow from "./TransactionRow";

export default function MonthGroup({
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
