"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CopyButton({ text }: { text: string }) {
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
      className="flex items-center gap-[4px] text-[13px] text-[#1ca95c] transition-opacity hover:opacity-80"
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
