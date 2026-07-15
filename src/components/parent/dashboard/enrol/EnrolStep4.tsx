"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { payApplicationFee } from "@/src/lib/api/parentApplications";
import SuccessScreen from "./SuccessScreen";

const STEPS = ["Step 1", "Step 2", "Step 3", "Step 4"];

export default function EnrolStep4() {
  const applicationId = useSearchParams().get("applicationId") ?? "";
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!applicationId) {
      toast.error("Missing application — start again from the school.");
      return;
    }
    setLoading(true);
    try {
      const { message } = await payApplicationFee(applicationId);
      toast.success(message);
      setPaid(true);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not confirm your payment."
      );
      setLoading(false);
    }
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
          Your application has been submitted. Confirm the application fee to
          send it to the school for review.
        </p>

        <div className="mt-[24px] flex items-center justify-between rounded-[10px] border border-[#ccc] px-[24px] py-[18px]">
          <p className="text-[14px] text-[#666]">Application fee</p>
          <p className="text-[16px] font-semibold text-[#1b1b1b]">₦0</p>
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
              Confirming…
            </>
          ) : (
            "Confirm & submit for review"
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
