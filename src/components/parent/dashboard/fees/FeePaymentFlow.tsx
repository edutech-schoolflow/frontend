"use client";

import { useEffect, useRef, useState } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { usePayFee } from "@/src/lib/api/useParentFees";
import type { ChildFeeItem, Payment } from "@/src/lib/api/parentFees";
import { formatCurrency } from "./feeUtils";

type Step = "review" | "pin" | "success";

type Props = {
  studentId: string;
  studentName: string;
  fee: ChildFeeItem;
  onClose: () => void;
};

function PinBox({
  index,
  value,
  setRef,
  inputRefs,
  onChange,
}: {
  index: number;
  value: string;
  setRef: (el: HTMLInputElement | null) => void;
  inputRefs: React.RefObject<(HTMLInputElement | null)[]>;
  onChange: (index: number, val: string) => void;
}) {
  return (
    <input
      ref={setRef}
      type="password"
      inputMode="numeric"
      maxLength={1}
      value={value}
      onChange={(e) => {
        const v = e.target.value.replace(/\D/, "");
        onChange(index, v);
        if (v && index < 5) inputRefs.current[index + 1]?.focus();
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace" && !value && index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      }}
      className="h-[52px] w-[44px] rounded-xl border-2 border-border-default bg-surface-muted text-center text-[20px] font-semibold text-dark-blue outline-none transition-colors focus:border-brand-green"
    />
  );
}

export default function FeePaymentFlow({
  studentId,
  studentName,
  fee,
  onClose,
}: Props) {
  const pay = usePayFee();
  const [step, setStep] = useState<Step>("review");
  // Default to the full balance owed (or the fee amount for an unsubscribed optional fee).
  const owed = fee.balance > 0 ? fee.balance : fee.amount;
  const [amount, setAmount] = useState<string>(String(owed));
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [receipt, setReceipt] = useState<Payment | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const parsedAmount = parseFloat(amount.replace(/,/g, ""));
  const amountValid =
    !isNaN(parsedAmount) && parsedAmount > 0 && parsedAmount <= owed;
  const pinComplete = pin.every((d) => d !== "");
  const subscribing = fee.category === "optional" && !fee.subscribed;

  useEffect(() => {
    if (step === "pin") {
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, [step]);

  function handlePinChange(index: number, val: string) {
    setPin((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  }

  async function handleConfirm() {
    try {
      const result = await pay.mutateAsync({
        studentId,
        feeTypeId: fee.feeTypeId,
        amount: parsedAmount,
        pin: pin.join(""),
      });
      setReceipt(result);
      setStep("success");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment failed.");
      setPin(["", "", "", "", "", ""]);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="w-full max-w-[420px] rounded-t-2xl bg-white sm:rounded-2xl">
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-[4px] w-[40px] rounded-full bg-[#ddd]" />
        </div>

        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <h2 className="text-[16px] font-semibold text-dark-blue">
            {step === "review" && (subscribing ? "Subscribe & pay" : "Pay fee")}
            {step === "pin" && "Enter your PIN"}
            {step === "success" && "Payment successful"}
          </h2>
          {!pay.isPending && (
            <button
              onClick={onClose}
              className="text-grey-text hover:text-dark-blue"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="px-6 pb-7 pt-4">
          {/* ── Review ──────────────────────────────────────────── */}
          {step === "review" && (
            <>
              <p className="mb-4 text-[13px] text-grey-text">
                Paying{" "}
                <span className="font-medium text-dark-blue">{fee.name}</span>{" "}
                for{" "}
                <span className="font-medium text-dark-blue">
                  {studentName}
                </span>
              </p>

              {subscribing && (
                <p className="mb-3 rounded-lg bg-[#eff6ff] px-3 py-2 text-[12px] text-[#2563eb]">
                  This is an optional fee — paying it subscribes your child to
                  it.
                </p>
              )}

              <label className="mb-1 block text-[13px] font-medium text-dark-blue">
                Amount (₦)
              </label>
              <input
                type="number"
                value={amount}
                min={1}
                max={owed}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-border-default px-3 py-2.5 text-[14px] text-dark-blue outline-none focus:border-brand-green"
              />
              <p className="mt-1.5 text-[12px] text-grey-text">
                Owed: {formatCurrency(owed)}. A small platform fee is added at
                checkout.
              </p>

              <button
                type="button"
                onClick={() => setStep("pin")}
                disabled={!amountValid}
                className="mt-5 w-full rounded-xl bg-brand-green py-3.5 text-[14px] font-semibold text-white hover:opacity-90 disabled:opacity-40"
              >
                Continue
              </button>
            </>
          )}

          {/* ── PIN ─────────────────────────────────────────────── */}
          {step === "pin" && (
            <>
              <p className="mb-6 text-[13px] text-grey-text">
                Enter your 6-digit payment PIN to pay{" "}
                <span className="font-semibold text-dark-blue">
                  {formatCurrency(parsedAmount)}
                </span>
              </p>

              <div className="flex justify-center gap-[10px]">
                {pin.map((digit, i) => (
                  <PinBox
                    key={i}
                    index={i}
                    value={digit}
                    setRef={(el) => {
                      inputRefs.current[i] = el;
                    }}
                    inputRefs={inputRefs}
                    onChange={handlePinChange}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!pinComplete || pay.isPending}
                className="mt-6 w-full rounded-xl bg-brand-green py-3.5 text-[14px] font-semibold text-white hover:opacity-90 disabled:opacity-40"
              >
                {pay.isPending ? "Processing…" : "Confirm payment"}
              </button>

              <button
                type="button"
                onClick={() => setStep("review")}
                disabled={pay.isPending}
                className="mt-2 w-full py-2 text-[13px] text-grey-text hover:text-dark-blue disabled:opacity-40"
              >
                Back
              </button>
            </>
          )}

          {/* ── Success ─────────────────────────────────────────── */}
          {step === "success" && (
            <>
              <div className="flex flex-col items-center py-4 text-center">
                <div className="mb-4 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 className="h-[36px] w-[36px] text-brand-green" />
                </div>
                <p className="text-[18px] font-semibold text-dark-blue">
                  Payment successful
                </p>
                <p className="mt-1 text-[13px] text-grey-text">
                  {fee.name} · {studentName}
                </p>
                {receipt && (
                  <div className="mt-4 w-full rounded-xl border border-border-default bg-surface-muted p-4 text-[13px]">
                    <div className="flex justify-between">
                      <span className="text-grey-text">Amount</span>
                      <span className="text-dark-blue">
                        {formatCurrency(receipt.baseAmount)}
                      </span>
                    </div>
                    <div className="mt-1.5 flex justify-between">
                      <span className="text-grey-text">Platform fee</span>
                      <span className="text-dark-blue">
                        {formatCurrency(receipt.platformFee)}
                      </span>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-border-default pt-2">
                      <span className="font-semibold text-dark-blue">
                        Total charged
                      </span>
                      <span className="font-bold text-brand-green">
                        {formatCurrency(receipt.totalCharged)}
                      </span>
                    </div>
                    <p className="mt-2 text-[11px] text-grey-text">
                      Ref: {receipt.reference}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full rounded-xl bg-brand-green py-3.5 text-[14px] font-semibold text-white hover:opacity-90"
              >
                Back to fees
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
