"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

interface Props {
  text?: string | null;
  maxLength?: number;
}

const TruncatedCopyableText = ({ text, maxLength = 15 }: Props) => {
  const [copied, setCopied] = useState(false);
  const safeText = text ?? "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(safeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isTruncated = safeText.length > maxLength;
  const displayText = isTruncated
    ? `${safeText.slice(0, maxLength)}...`
    : safeText;

  return (
    <div className="group flex w-max max-w-50 items-center gap-1">
      <span className="cursor-default truncate text-sm" title={safeText}>
        {displayText}
      </span>
      <button
        onClick={handleCopy}
        className="opacity-0 transition-opacity group-hover:opacity-100"
        title="Copy"
      >
        {copied ? (
          <Check size={14} className="text-green-500" />
        ) : (
          <Copy
            size={14}
            className="text-muted-foreground hover:text-primary"
          />
        )}
      </button>
    </div>
  );
};

export default TruncatedCopyableText;
