"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAppSelector } from "@/src/lib/store/hooks";
import { useSetPaymentPin } from "@/src/lib/api/useParentAuth";

const cls =
  "h-[44px] w-full rounded-[8px] border border-[#ccc] bg-white px-[14px] text-[14px] text-[#1b1b1b] focus:outline-none focus:ring-2 focus:ring-[#1ca95c]/30";

export default function PaymentPinSection() {
  const hasPin = useAppSelector((s) => s.parentAuth.user?.hasPaymentPin ?? false);
  const setPin = useSetPaymentPin();
  const [pin, setPinValue] = useState("");
  const [confirm, setConfirm] = useState("");

  const digitsOnly = (v: string) => v.replace(/\D/g, "").slice(0, 6);
  const valid = /^\d{6}$/.test(pin) && pin === confirm;

  async function handleSave() {
    if (!valid) return;
    try {
      const message = await setPin.mutateAsync(pin);
      toast.success(message);
      setPinValue("");
      setConfirm("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not set your PIN.");
    }
  }

  return (
    <div className="rounded-[10px] border border-[#e0e0e0] px-[32px] py-[28px]">
      <div className="mb-[6px] flex items-center justify-between">
        <p className="text-[16px] font-medium text-[#1b1b1b]">Payment PIN</p>
        {hasPin && (
          <span className="rounded-full bg-green-50 px-[10px] py-[2px] text-[12px] font-medium text-brand-green">
            PIN set
          </span>
        )}
      </div>
      <p className="mb-[20px] text-[13px] text-[#888]">
        {hasPin
          ? "Update the 6-digit PIN you use to authorise fee payments."
          : "Set a 6-digit PIN to authorise fee payments."}
      </p>

      <div className="grid max-w-[460px] grid-cols-2 gap-[16px]">
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] text-[#666]">
            {hasPin ? "New PIN" : "PIN"}
          </label>
          <input
            className={cls}
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            value={pin}
            onChange={(e) => setPinValue(digitsOnly(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-[6px]">
          <label className="text-[13px] text-[#666]">Confirm PIN</label>
          <input
            className={cls}
            type="password"
            inputMode="numeric"
            maxLength={6}
            placeholder="••••••"
            value={confirm}
            onChange={(e) => setConfirm(digitsOnly(e.target.value))}
          />
        </div>
      </div>

      {confirm.length === 6 && pin !== confirm && (
        <p className="mt-[10px] text-[13px] text-red-500">PINs do not match.</p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={!valid || setPin.isPending}
        className="mt-[20px] flex h-[44px] items-center rounded-[8px] bg-[#1ca95c] px-[24px] text-[14px] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {setPin.isPending ? "Saving…" : hasPin ? "Update PIN" : "Set PIN"}
      </button>
    </div>
  );
}
