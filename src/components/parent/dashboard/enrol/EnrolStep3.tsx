"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitApplication } from "@/src/lib/api/parentApplications";

const STEPS = ["Step 1", "Step 2", "Step 3", "Step 4"];

type InfoRowProps = { label: string; value: string; bold?: boolean };
function InfoRow({ label, value, bold }: InfoRowProps) {
  return (
    <div className="flex items-start gap-[24px]">
      <p className="w-[220px] shrink-0 text-[14px] text-[#666]">{label}</p>
      <p className={`text-[14px] text-[#1b1b1b] ${bold ? "font-medium" : ""}`}>
        {value}
      </p>
    </div>
  );
}

export default function EnrolStep3() {
  const router = useRouter();
  const params = useSearchParams();
  const childProfileId = params.get("childProfileId") ?? "";
  const schoolId = params.get("schoolId") ?? "";
  const desiredClass = params.get("desiredClass") ?? "";

  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const ready = childProfileId && schoolId;

  const handleSubmit = async () => {
    if (!ready || !confirmed) return;
    setSubmitting(true);
    try {
      const { application, message } = await submitApplication({
        childProfileId,
        schoolId,
        desiredClass: desiredClass || undefined,
      });
      toast.success(message);
      router.push(
        `/parent/dashboard/enrol/payment?applicationId=${application.id}`
      );
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Could not submit your application."
      );
      setSubmitting(false);
    }
  };

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      {/* Heading + step progress */}
      <div className="flex flex-col gap-[24px]">
        <h1 className="text-[24px] font-medium text-[#1b1b1b]">
          Review application details
        </h1>
        <div className="flex items-center gap-[5px]">
          {STEPS.map((step, i) => (
            <div key={step} className="flex w-[213px] flex-col gap-[7px]">
              <p
                className={`text-[12px] ${i <= 2 ? "text-[#1b1b1b]" : "text-[#aaa]"}`}
              >
                {step}
              </p>
              <div
                className={`h-[6px] rounded-[5px] ${i <= 2 ? "bg-[#1ca95c]" : "bg-[#eee]"}`}
              />
            </div>
          ))}
        </div>
      </div>

      {!ready ? (
        <div className="mt-[16px] rounded-[10px] border border-[#ccc] px-[32px] py-[40px] text-center">
          <p className="text-[15px] font-medium text-[#1b1b1b]">
            Missing application details
          </p>
          <p className="mt-[6px] text-[14px] text-[#888]">
            Start again from the school you want to apply to.
          </p>
          <Link
            href="/parent/dashboard/search"
            className="mt-[16px] inline-block text-[14px] font-medium text-[#1ca95c] hover:underline"
          >
            Find a school
          </Link>
        </div>
      ) : (
        <div className="mt-[16px] rounded-[10px] border border-[#ccc] px-[32px] py-[32px]">
          <p className="mb-[18px] text-[16px] font-medium text-[#1b1b1b]">
            Confirm and submit
          </p>

          <div className="flex flex-col gap-[10px]">
            <InfoRow label="Desired class" value={desiredClass || "—"} bold />
          </div>

          <div className="mt-[24px]">
            <label className="flex cursor-pointer items-center gap-[10px]">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="h-[16px] w-[16px] cursor-pointer accent-[#1ca95c]"
              />
              <span className="text-[14px] text-[#666]">
                I confirm all information is correct
              </span>
            </label>
          </div>

          <div className="mt-[20px] flex items-center justify-between rounded-[8px] bg-[#f5f5f5] px-[20px] py-[16px]">
            <p className="text-[14px] text-[#666]">Application fee</p>
            <p className="text-[14px] font-medium text-[#1b1b1b]">₦0</p>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!confirmed || submitting}
            className={`mt-[24px] flex h-[54px] w-full items-center justify-center rounded-[5px] text-[18px] font-normal text-white transition-opacity ${
              confirmed && !submitting
                ? "bg-[#1ca95c] hover:opacity-90"
                : "cursor-not-allowed bg-[#ccc]"
            }`}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting…
              </>
            ) : (
              "Submit application"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
