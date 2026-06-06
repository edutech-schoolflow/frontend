import type { PaymentHistoryRecord } from "@/src/types/fee";
import { MOCK_PAYMENT_HISTORY } from "./mock/data";
import { mockResponse } from "./mockClient";

export function getPaymentHistory(): Promise<PaymentHistoryRecord[]> {
  return mockResponse(
    [...MOCK_PAYMENT_HISTORY].sort(
      (a, b) => new Date(b.paidAt).getTime() - new Date(a.paidAt).getTime()
    )
  );
}
