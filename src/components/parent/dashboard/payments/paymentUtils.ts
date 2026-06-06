import type { PaymentHistoryRecord } from "@/src/types/fee";

export function monthKey(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function shortDate(isoDate: string) {
  return new Date(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function methodLabel(method: PaymentHistoryRecord["method"]) {
  const map: Record<PaymentHistoryRecord["method"], string> = {
    card: "Card",
    bank_transfer: "Bank transfer",
    ussd: "USSD",
    wallet: "Wallet",
  };
  return map[method];
}

export function groupByMonth(records: PaymentHistoryRecord[]) {
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
