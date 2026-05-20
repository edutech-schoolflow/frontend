"use client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import { X } from "lucide-react";

interface Payment {
  transactionId: string;
  purpose: "Token" | "Bill";
  amount: string;
  paymentMethod: string;
  status: "Successful" | "Failed";
  date: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payment: Payment | null;
}

const PaymentReceiptDialog = ({ open, onOpenChange, payment }: Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-md">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-sm font-semibold text-dark-blue">
            Payment Receipt - {payment?.transactionId}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-grey-text hover:bg-surface-subtle"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Amount Paid:</p>
            <p className="text-xs font-medium text-dark-blue">
              {payment?.amount}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Status:</p>
            <StatusBadge status={payment?.status ?? "Successful"} />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Purpose:</p>
            <p className="text-xs font-medium text-dark-blue">
              {payment?.purpose === "Bill" ? "Bill Payment" : "Token Purchase"}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Date:</p>
            <p className="text-xs font-medium text-dark-blue">
              {payment?.date}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Transaction ID:</p>
            <p className="text-xs font-medium text-dark-blue">
              {payment?.transactionId}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Reference Number:</p>
            <p className="text-xs font-medium text-dark-blue">BIL-881221</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-border-default pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-grey-text">
            Payment Details
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Payment Method:</p>
            <p className="text-xs font-medium text-dark-blue">
              {payment?.paymentMethod}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Customer:</p>
            <p className="text-xs font-medium text-dark-blue">Ibrahim Musa</p>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-grey-text">Email:</p>
            <p className="text-xs font-medium text-dark-blue">
              musa.ibrahim@email.com
            </p>
          </div>
        </div>

        {payment?.purpose === "Bill" ? (
          <div className="flex flex-col gap-3 border-t border-border-default pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-grey-text">
              Billing Details
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Billing Account:</p>
              <p className="text-xs font-medium text-dark-blue">BILL-2201</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Billing Month:</p>
              <p className="text-xs font-medium text-dark-blue">October 2025</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Bill Amount:</p>
              <p className="text-xs font-medium text-dark-blue">
                {payment?.amount}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Due Date:</p>
              <p className="text-xs font-medium text-dark-blue">10 Nov 2025</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 border-t border-border-default pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-grey-text">
              Token Details
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Meter Number:</p>
              <p className="text-xs font-medium text-dark-blue">04158273991</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Units Purchased:</p>
              <p className="text-xs font-medium text-dark-blue">38.2 units</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Token:</p>
              <p className="text-xs font-medium text-dark-blue">
                5619 5561 0784 9022
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentReceiptDialog;
