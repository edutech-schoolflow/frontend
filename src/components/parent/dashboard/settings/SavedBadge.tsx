import { Check } from "lucide-react";

export default function SavedBadge({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="flex items-center gap-[4px] text-[13px] text-[#1ca95c]">
      <Check className="h-[13px] w-[13px]" />
      Saved
    </span>
  );
}
