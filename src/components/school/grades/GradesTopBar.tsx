import { ChevronDown } from "lucide-react";
import type { GradeTerm } from "@/src/types/scoreEntry";
import { TERM_LABELS } from "@/src/types/scoreEntry";
import type { StatusFilter } from "./grades.utils";

const FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending publish" },
  { value: "published", label: "Published" },
];

interface Props {
  term: GradeTerm;
  onTermChange: (t: GradeTerm) => void;
  filter: StatusFilter;
  onFilterChange: (f: StatusFilter) => void;
}

export default function GradesTopBar({
  term,
  onTermChange,
  filter,
  onFilterChange,
}: Props) {
  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-[22px] font-semibold text-text-heading">
          Grades &amp; Results
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          Review submitted scores and publish results to parents.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Filter tabs */}
        <div className="flex rounded-[8px] border border-[#e5e7eb] bg-[#f9fafb] p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => onFilterChange(f.value)}
              className={`rounded-[6px] px-3 py-1.5 text-[12px] font-medium transition-colors ${
                filter === f.value
                  ? "bg-white text-text-heading shadow-sm"
                  : "text-text-body hover:text-text-heading"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Term selector */}
        <div className="relative">
          <select
            value={term}
            onChange={(e) => onTermChange(e.target.value as GradeTerm)}
            className="h-[38px] appearance-none rounded-[8px] border border-[#e5e7eb] bg-white px-3 pr-8 text-[13px] text-text-heading focus:border-brand-green focus:outline-none"
          >
            {(Object.entries(TERM_LABELS) as [GradeTerm, string][]).map(
              ([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              )
            )}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-[14px] w-[14px] -translate-y-1/2 text-[#6b7280]" />
        </div>
      </div>
    </div>
  );
}
