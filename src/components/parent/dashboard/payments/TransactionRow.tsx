import Image from "next/image";
import { UserRound } from "lucide-react";
import type { PaymentHistoryRecord } from "@/src/types/fee";
import { formatCurrency } from "../fees/feeUtils";
import { shortDate, methodLabel } from "./paymentUtils";
import StatusBadge from "./StatusBadge";

export default function TransactionRow({
  record,
}: {
  record: PaymentHistoryRecord;
}) {
  return (
    <div className="grid grid-cols-[80px_200px_1fr_130px_130px_110px] items-center gap-[8px] border-b border-[#f0f0f0] py-[16px] last:border-0">
      <p className="text-[13px] text-[#888]">{shortDate(record.paidAt)}</p>
      <div className="flex items-center gap-[10px]">
        <div className="relative h-[36px] w-[36px] shrink-0 overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
          {record.studentPhotoUrl ? (
            <Image
              src={record.studentPhotoUrl}
              alt={record.studentName}
              fill
              className="object-cover"
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
      <div className="min-w-0">
        <p className="truncate text-[13px] text-[#1b1b1b]">
          {record.feeTypes.join(" · ")}
        </p>
        <p className="text-[12px] text-[#888]">{record.termName}</p>
      </div>
      <p className="text-[13px] text-[#666]">{methodLabel(record.method)}</p>
      <p
        className={`text-[14px] font-semibold ${record.status === "failed" ? "text-[#e84040] line-through" : "text-[#1b1b1b]"}`}
      >
        {formatCurrency(record.amount)}
      </p>
      <StatusBadge status={record.status} />
    </div>
  );
}
