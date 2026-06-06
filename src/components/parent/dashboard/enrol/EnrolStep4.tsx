"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Copy, Check, CheckCircle2, Loader2 } from "lucide-react";
import { getApplicationPaymentDetails } from "@/src/lib/api/applications";
import type { ApplicationPaymentDetails } from "@/src/types/application";

const STEPS = ["Step 1", "Step 2", "Step 3", "Step 4"];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-[4px] text-[13px] text-[#1ca95c] hover:opacity-80 transition-opacity"
    >
      {copied ? (
        <Check className="h-[13px] w-[13px]" />
      ) : (
        <Copy className="h-[13px] w-[13px]" />
      )}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

type BankRowProps = { label: string; value: string; copyable?: boolean };
function BankRow({ label, value, copyable }: BankRowProps) {
  return (
    <div className="flex items-center justify-between py-[14px]">
      <div className="flex flex-col gap-[2px]">
        <p className="text-[12px] text-[#888]">{label}</p>
        <p className="text-[15px] font-medium text-[#1b1b1b]">{value}</p>
      </div>
      {copyable && <CopyButton text={value} />}
    </div>
  );
}

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

  if (paid) {
    return <SuccessScreen />;
  }

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      {/* Heading + step progress */}
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

      {/* Payment card */}
      <div className="mx-auto mt-[16px] w-[822px] rounded-[10px] border border-[#ccc] px-[44px] py-[41px]">
        <p className="text-[18px] font-normal text-[#1b1b1b]">
          Application fee payment
        </p>
        <p className="mt-[6px] text-[14px] text-[#666]">
          Transfer the application fee to the account below. Your application
          will be reviewed once payment is confirmed.
        </p>

        {/* Bank details box */}
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

        {/* Important note */}
        <div className="mt-[20px] flex gap-[10px] rounded-[8px] bg-[#fff8ec] px-[16px] py-[14px]">
          <p className="text-[13px] text-[#888]">
            <span className="font-medium text-[#ff8d28]">Important: </span>
            Include the payment reference in your transfer narration so we can
            match your payment quickly.
          </p>
        </div>

        {/* Confirm button */}
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

function SuccessScreen() {
  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      {/* Heading + all 4 steps green */}
      <div className="flex flex-col gap-[24px]">
        <h1 className="text-[24px] font-medium text-[#1b1b1b]">
          Enrol your child
        </h1>
        <div className="flex items-center gap-[5px]">
          {STEPS.map((step) => (
            <div key={step} className="flex w-[213px] flex-col gap-[7px]">
              <p className="text-[12px] text-[#1b1b1b]">{step}</p>
              <div className="h-[6px] rounded-[5px] bg-[#1ca95c]" />
            </div>
          ))}
        </div>
      </div>

      {/* Success card */}
      <div className="mx-auto mt-[16px] flex w-[822px] flex-col items-center gap-[20px] rounded-[10px] border border-[#ccc] px-[44px] py-[60px]">
        <div className="flex h-[80px] w-[80px] items-center justify-center rounded-full bg-[#daffeb]">
          <CheckCircle2 className="h-[44px] w-[44px] text-[#1ca95c]" />
        </div>

        <div className="flex flex-col items-center gap-[8px] text-center">
          <p className="text-[24px] font-medium text-[#1b1b1b]">
            Application submitted!
          </p>
          <p className="max-w-[480px] text-[15px] text-[#666]">
            Your child&apos;s application to{" "}
            <span className="font-medium text-[#1b1b1b]">
              Greenfield Academy
            </span>{" "}
            has been received. We&apos;ll notify you once the school reviews and
            responds.
          </p>
        </div>

        {/* Application summary */}
        <div className="mt-[8px] w-full rounded-[10px] border border-[#eee] px-[24px] py-[20px]">
          <div className="flex flex-col divide-y divide-[#eee]">
            <div className="flex items-center justify-between py-[12px]">
              <p className="text-[13px] text-[#888]">Application ID</p>
              <p className="text-[14px] font-medium text-[#1b1b1b]">
                SF-GFA-20260605
              </p>
            </div>
            <div className="flex items-center justify-between py-[12px]">
              <p className="text-[13px] text-[#888]">School</p>
              <p className="text-[14px] font-medium text-[#1b1b1b]">
                Greenfield Academy
              </p>
            </div>
            <div className="flex items-center justify-between py-[12px]">
              <p className="text-[13px] text-[#888]">Child</p>
              <p className="text-[14px] font-medium text-[#1b1b1b]">
                Seun Tolu Tinubu
              </p>
            </div>
            <div className="flex items-center justify-between py-[12px]">
              <p className="text-[13px] text-[#888]">Desired class</p>
              <p className="text-[14px] font-medium text-[#1b1b1b]">
                Primary 5
              </p>
            </div>
            <div className="flex items-center justify-between py-[12px]">
              <p className="text-[13px] text-[#888]">Status</p>
              <span className="rounded-full bg-[#fff8ec] px-[10px] py-[3px] text-[12px] font-medium text-[#ff8d28]">
                Under review
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-[16px]">
          <Link
            href="/parent/dashboard/track"
            className="flex h-[50px] w-[220px] items-center justify-center rounded-[5px] bg-[#1ca95c] text-[15px] text-white transition-opacity hover:opacity-90"
          >
            Track application
          </Link>
          <Link
            href="/parent/dashboard"
            className="flex h-[50px] w-[220px] items-center justify-center rounded-[5px] border border-[#1ca95c] text-[15px] text-[#1ca95c] transition-opacity hover:opacity-80"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
