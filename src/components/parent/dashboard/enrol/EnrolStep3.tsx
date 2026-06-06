"use client";

import { useState } from "react";
import Link from "next/link";

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
  const [confirmed, setConfirmed] = useState(false);

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

      {/* Review card */}
      <div className="mt-[16px] rounded-[10px] border border-[#ccc] px-[32px] py-[32px]">
        {/* Photo + info row */}
        <div className="flex gap-[28px]">
          {/* Circular photo */}
          <div className="h-[110px] w-[110px] shrink-0 overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
            {/* placeholder — replace with actual uploaded photo */}
            <div className="flex h-full w-full items-center justify-center text-[32px] text-[#ccc]">
              👤
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-1 flex-col gap-[14px]">
            {/* Name + Edit */}
            <div className="flex items-center justify-between">
              <p className="text-[20px] font-medium text-[#1b1b1b]">
                Seun Tolu Tinubu
              </p>
              <Link
                href="/parent/dashboard/enrol/child-info"
                className="text-[14px] font-medium text-[#ff8d28] hover:underline"
              >
                Edit
              </Link>
            </div>

            {/* Info rows */}
            <div className="flex flex-col gap-[10px]">
              <InfoRow label="Date of birth" value="10/10/2010" />
              <InfoRow label="Desired class" value="Primary 5" bold />
              <InfoRow label="Gender" value="Female" bold />
              <InfoRow label="School" value="Greenfield Academy" bold />
              <InfoRow label="Previous school (Optional)" value="Nil" />
              <InfoRow label="Medical information (Optional)" value="Nil" />
            </div>

            {/* Additional guardian */}
            <div className="flex flex-col gap-[10px]">
              <p className="text-[13px] text-[#888]">Additional guardian</p>
              <InfoRow label="First and last name" value="Ruka Iyabo" bold />
              <InfoRow label="Phone number" value="1234567890" />
              <InfoRow label="Relationship" value="Mother" bold />
            </div>
          </div>
        </div>

        {/* Confirmation checkbox */}
        <div className="mt-[28px]">
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

        {/* Application fee row */}
        <div className="mt-[20px] flex items-center justify-between rounded-[8px] bg-[#f5f5f5] px-[20px] py-[16px]">
          <p className="text-[14px] text-[#666]">Application fee</p>
          <p className="text-[14px] font-medium text-[#1b1b1b]">₦10,000</p>
        </div>

        {/* Proceed to payment */}
        <Link
          href={confirmed ? "/parent/dashboard/enrol/payment" : "#"}
          onClick={(e) => !confirmed && e.preventDefault()}
          className={`mt-[24px] flex h-[54px] w-full items-center justify-center rounded-[5px] text-[18px] font-normal text-white transition-opacity ${
            confirmed
              ? "bg-[#1ca95c] hover:opacity-90"
              : "pointer-events-none bg-[#ccc]"
          }`}
        >
          Proceed to payment
        </Link>
      </div>
    </div>
  );
}
