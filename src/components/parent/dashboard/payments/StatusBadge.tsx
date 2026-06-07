import type { PaymentHistoryRecord } from "@/src/types/fee";

const styles: Record<PaymentHistoryRecord["status"], string> = {
  successful: "bg-[#daffeb] text-[#1ca95c]",
  failed: "bg-[#ffe4e4] text-[#e84040]",
  pending: "bg-[#fff4e5] text-[#ff8d28]",
};

const labels: Record<PaymentHistoryRecord["status"], string> = {
  successful: "Successful",
  failed: "Failed",
  pending: "Pending",
};

export default function StatusBadge({
  status,
}: {
  status: PaymentHistoryRecord["status"];
}) {
  return (
    <span
      className={`w-fit rounded-[4px] px-[10px] py-[3px] text-[12px] font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
