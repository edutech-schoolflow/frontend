import type { InvoiceLine } from "@/src/types/fee";

export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`;
}

export function daysRemaining(dueDate: string): number {
  return Math.ceil(
    (new Date(dueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
}

export function formatDeadlineBanner(dueDate: string): string {
  const days = daysRemaining(dueDate);
  const dateStr = new Date(dueDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const suffix =
    days >= 0 ? `(${days} Day${days !== 1 ? "s" : ""} Remaining)` : "(Overdue)";
  return `Payment Deadline: ${dateStr} ${suffix}`;
}

export function getSelectedTotal(
  lines: InvoiceLine[],
  selectedIds: Set<string>
): number {
  return lines
    .filter((l) => l.status !== "paid" && selectedIds.has(l.feeTypeId))
    .reduce((sum, l) => sum + l.balance, 0);
}
