import { Check } from "lucide-react";

export default function FilterChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex h-[30px] items-center gap-[6px] rounded-[10px] border px-[10px] text-[14px] text-[#1b1b1b] transition-colors whitespace-nowrap ${
        selected
          ? "border-[#1ca95c] bg-[#daffeb]"
          : "border-[#ccc] hover:border-[#aaa]"
      }`}
    >
      {selected ? (
        <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#1ca95c]">
          <Check className="h-[10px] w-[10px] text-white" strokeWidth={3} />
        </div>
      ) : (
        <div className="h-[18px] w-[18px] shrink-0 rounded-full border border-[#ccc]" />
      )}
      {label}
    </button>
  );
}
