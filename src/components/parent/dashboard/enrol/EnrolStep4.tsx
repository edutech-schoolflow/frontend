"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { getApplicationPaymentDetails } from "@/src/lib/api/applications";
import type { ApplicationPaymentDetails } from "@/src/types/application";
import BankRow from "./BankRow";
import SuccessScreen from "./SuccessScreen";

const STEPS = ["Step 1", "Step 2", "Step 3", "Step 4"];

export default function EnrolStep4() {
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<ApplicationPaymentDetails | null>(
    null
  );

  useEffect(() => {
    getApplicationPaymentDetails("app-001").then(setDetails);
  }, []);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setPaid(true);
  };

  if (paid) return <SuccessScreen />;

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <div className="flex flex-col gap-[24px]">
        <h1 className="text-[24px] font-medium text-[#1b1b1b]">
          Enrol your child
        </h1>
        <div className="flex items-center gap-[5px]">
          {STEPS.map((step, i) => (
            <div key={step} className="flex w-[213px] flex-col gap-[7px]">
              <p
                className={`text-[12px] ${i <= 3 ? "text-[#1b1b1b]" : "text-[#aaa]"}`}
              >
                {step}
              </p>
              <div
                className={`h-[6px] rounded-[5px] ${i <= 3 ? "bg-[#1ca95c]" : "bg-[#eee]"}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-[16px] w-[822px] rounded-[10px] border border-[#ccc] px-[44px] py-[41px]">
        <p className="text-[18px] font-normal text-[#1b1b1b]">
          Application fee payment
        </p>
        <p className="mt-[6px] text-[14px] text-[#666]">
          Transfer the application fee to the account below. Your application
          will be reviewed once payment is confirmed.
        </p>
        <div className="mt-[24px] rounded-[10px] border border-[#ccc] px-[24px]">
          <div className="divide-y divide-[#eee]">
            <BankRow label="Bank" value={details?.bank ?? "—"} />
            <BankRow
              label="Account number"
              value={details?.accountNumber ?? "—"}
              copyable
            />
            <BankRow label="Account name" value={details?.accountName ?? "—"} />
            <BankRow
              label="Amount"
              value={details ? `₦${details.amount.toLocaleString()}` : "—"}
            />
            <BankRow
              label="Payment reference"
              value={details?.reference ?? "—"}
              copyable
            />
          </div>
        </div>
        <div className="mt-[20px] flex gap-[10px] rounded-[8px] bg-[#fff8ec] px-[16px] py-[14px]">
          <p className="text-[13px] text-[#888]">
            <span className="font-medium text-[#ff8d28]">Important: </span>
            Include the payment reference in your transfer narration so we can
            match your payment quickly.
          </p>
        </div>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading}
          className="mx-auto mt-[32px] flex h-[59px] w-[447px] items-center justify-center rounded-[5px] bg-[#1ca95c] text-[20px] font-normal text-white transition-opacity hover:opacity-90 disabled:opacity-70"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Verifying…
            </>
          ) : (
            "I have made the transfer"
          )}
        </button>
        <p className="mt-[12px] text-center text-[12px] text-[#aaa]">
          Having trouble?{" "}
          <span className="cursor-pointer text-[#1ca95c] hover:underline">
            Contact support
          </span>
        </p>
      </div>
    </div>
  );
}
