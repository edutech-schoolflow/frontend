"use client";

import { useEffect, useRef, useState } from "react";
import { X, CheckCircle2, Download, Share2 } from "lucide-react";
import { initiateFeesPayment } from "@/src/lib/api/fees";
import type { InvoiceLine } from "@/src/types/fee";
import { formatCurrency } from "./feeUtils";

type Step = "review" | "pin" | "processing" | "success";

type Props = {
  invoiceId: string;
  studentName: string;
  lines: InvoiceLine[];
  total: number;
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
  invoiceId,
  studentName,
  lines,
  total,
  onClose,
}: Props) {
  const [step, setStep] = useState<Step>("review");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const pinComplete = pin.every((d) => d !== "");

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
    setStep("processing");
    await initiateFeesPayment({
      invoiceId,
      feeTypeIds: lines.map((l) => l.feeTypeId),
    });
    setStep("success");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
      <div className="w-full max-w-[420px] rounded-t-2xl bg-white sm:rounded-2xl">
        {/* Handle bar (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="h-[4px] w-[40px] rounded-full bg-[#ddd]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-1">
          <h2 className="text-[16px] font-semibold text-dark-blue">
            {step === "review" && "Payment summary"}
            {step === "pin" && "Enter your PIN"}
            {(step === "processing" || step === "success") && "Payment"}
          </h2>
          {step !== "processing" && (
            <button
              onClick={onClose}
              className="text-grey-text hover:text-dark-blue"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="px-6 pb-7 pt-4">
          {/* ── STEP 1: Review ─────────────────────────────────── */}
          {step === "review" && (
            <>
              <p className="mb-4 text-[13px] text-grey-text">
                You are paying for{" "}
                <span className="font-medium text-dark-blue">
                  {studentName}
                </span>
              </p>

              <div className="rounded-xl border border-border-default bg-surface-muted p-4">
                <div className="space-y-3">
                  {lines.map((line) => (
                    <div
                      key={line.feeTypeId}
                      className="flex items-center justify-between text-[13px]"
                    >
                      <span className="text-dark-blue">{line.feeTypeName}</span>
                      <span className="font-medium text-dark-blue">
                        {formatCurrency(line.balance)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-border-default pt-3 flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-dark-blue">
                    Total
                  </span>
                  <span className="text-[16px] font-bold text-brand-green">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep("pin")}
                className="mt-5 w-full rounded-xl bg-brand-green py-3.5 text-[14px] font-semibold text-white hover:opacity-90"
              >
                Continue
              </button>
            </>
          )}

          {/* ── STEP 2: PIN ────────────────────────────────────── */}
          {step === "pin" && (
            <>
              <p className="mb-6 text-[13px] text-grey-text">
                Enter your 6-digit payment PIN to confirm{" "}
                <span className="font-semibold text-dark-blue">
                  {formatCurrency(total)}
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

              <p className="mt-3 text-center text-[12px] text-grey-text">
                Forgot PIN?{" "}
                <button
                  type="button"
                  className="text-brand-green hover:underline"
                >
                  Reset it
                </button>
              </p>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={!pinComplete}
                className="mt-6 w-full rounded-xl bg-brand-green py-3.5 text-[14px] font-semibold text-white hover:opacity-90 disabled:opacity-40"
              >
                Confirm Payment
              </button>

              <button
                type="button"
                onClick={() => setStep("review")}
                className="mt-2 w-full py-2 text-[13px] text-grey-text hover:text-dark-blue"
              >
                Back
              </button>
            </>
          )}

          {/* ── STEP 3: Processing ─────────────────────────────── */}
          {step === "processing" && (
            <div className="flex flex-col items-center py-8 gap-4">
              <div className="h-[44px] w-[44px] animate-spin rounded-full border-[3px] border-[#eee] border-t-brand-green" />
              <p className="text-[14px] font-medium text-dark-blue">
                Processing payment…
              </p>
              <p className="text-[12px] text-grey-text">
                Please do not close this screen
              </p>
            </div>
          )}

          {/* ── STEP 4: Success ────────────────────────────────── */}
          {step === "success" && (
            <>
              <div className="flex flex-col items-center py-4 text-center">
                <div className="mb-4 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-green-50">
                  <CheckCircle2 className="h-[36px] w-[36px] text-brand-green" />
                </div>
                <p className="text-[18px] font-semibold text-dark-blue">
                  Payment initiated!
                </p>
                <p className="mt-1 text-[13px] text-grey-text">
                  {formatCurrency(total)} for {studentName}
                </p>
                <p className="mt-3 text-[12px] text-grey-text max-w-[280px]">
                  You&apos;ll receive a WhatsApp and email confirmation once the
                  payment is processed.
                </p>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-default py-3 text-[13px] font-medium text-dark-blue hover:bg-surface-muted"
                >
                  <Download className="h-4 w-4" /> Receipt
                </button>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border-default py-3 text-[13px] font-medium text-dark-blue hover:bg-surface-muted"
                >
                  <Share2 className="h-4 w-4" /> Share
                </button>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mt-3 w-full rounded-xl bg-brand-green py-3.5 text-[14px] font-semibold text-white hover:opacity-90"
              >
                Back to Fees
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
