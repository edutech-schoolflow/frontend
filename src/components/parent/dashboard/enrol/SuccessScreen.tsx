import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const STEPS = ["Step 1", "Step 2", "Step 3", "Step 4"];

const SUMMARY_ROWS = [
  { label: "Application ID", value: "SF-GFA-20260605" },
  { label: "School", value: "Greenfield Academy" },
  { label: "Child", value: "Seun Tolu Tinubu" },
  { label: "Desired class", value: "Primary 5" },
];

export default function SuccessScreen() {
  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
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
        <div className="mt-[8px] w-full rounded-[10px] border border-[#eee] px-[24px] py-[20px]">
          <div className="flex flex-col divide-y divide-[#eee]">
            {SUMMARY_ROWS.map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center justify-between py-[12px]"
              >
                <p className="text-[13px] text-[#888]">{label}</p>
                <p className="text-[14px] font-medium text-[#1b1b1b]">
                  {value}
                </p>
              </div>
            ))}
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
