"use client";

import { CheckCircle2, XCircle } from "lucide-react";

interface Props {
  type: "success" | "error";
  title: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export default function OtpResultModal({
  type,
  title,
  message,
  actionLabel,
  onAction,
}: Props) {
  const isSuccess = type === "success";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex w-full max-w-[400px] flex-col items-center gap-[24px] rounded-[12px] bg-white px-[32px] py-[40px]">
        {/* Icon */}
        <div
          className={`flex h-[72px] w-[72px] items-center justify-center rounded-full ${
            isSuccess ? "bg-[#e8f8ef]" : "bg-[#fef2f2]"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-[36px] w-[36px] text-[#1ca95c]" />
          ) : (
            <XCircle className="h-[36px] w-[36px] text-[#ef4444]" />
          )}
        </div>

        {/* Text */}
        <div className="flex flex-col gap-[8px] text-center">
          <h3 className="text-[20px] font-medium text-[#1b1b1b]">{title}</h3>
          <p className="text-[14px] text-[#666]">{message}</p>
        </div>

        {/* Action button */}
        <button
          type="button"
          onClick={onAction}
          className={`flex h-[54px] w-full items-center justify-center rounded-[5px] text-[16px] font-normal text-white transition-opacity hover:opacity-90 ${
            isSuccess ? "bg-[#1ca95c]" : "bg-[#ef4444]"
          }`}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
