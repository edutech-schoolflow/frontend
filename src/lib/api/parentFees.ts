import { apiGet, apiPost } from "./client";
import type { FeeCategory } from "./schoolFees";

export type { FeeCategory };
export type PaymentStatus = "pending" | "successful" | "failed";

export interface ChildFeeItem {
  feeTypeId: string;
  name: string;
  category: FeeCategory;
  amount: number;
  paid: number;
  balance: number;
  subscribed: boolean;
}

export interface ChildFees {
  studentId: string;
  studentName: string;
  schoolName: string;
  className: string;
  termName: string;
  outstandingCompulsory: number;
  fees: ChildFeeItem[];
}

export interface Payment {
  id: string;
  feeTypeId?: string | null;
  baseAmount: number;
  platformFee: number;
  totalCharged: number;
  method: string;
  reference: string;
  status: PaymentStatus;
  paidAt?: string | null;
}

interface ChildFeesResponse {
  studentId: string;
  studentName?: string | null;
  schoolName?: string | null;
  className?: string | null;
  termName?: string | null;
  outstandingCompulsory: number;
  fees: ChildFeeItem[];
}

function toChildFees(c: ChildFeesResponse): ChildFees {
  return {
    studentId: c.studentId,
    studentName: c.studentName ?? "",
    schoolName: c.schoolName ?? "",
    className: c.className ?? "",
    termName: c.termName ?? "",
    outstandingCompulsory: c.outstandingCompulsory,
    fees: c.fees,
  };
}

export async function getParentFees(): Promise<ChildFees[]> {
  const { data } = await apiGet<ChildFeesResponse[]>("/parent/fees");
  return data.map(toChildFees);
}

export interface PayFeeInput {
  studentId: string;
  feeTypeId: string;
  amount: number;
  pin: string;
}

export async function payFee(input: PayFeeInput): Promise<Payment> {
  const { data } = await apiPost<Payment>("/parent/fees/pay", {
    studentId: input.studentId,
    feeTypeId: input.feeTypeId,
    amount: input.amount,
    pin: input.pin,
  });
  return data;
}

export async function getParentPayments(): Promise<Payment[]> {
  const { data } = await apiGet<Payment[]>("/parent/payments");
  return data;
}
