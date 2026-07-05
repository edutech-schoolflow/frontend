type Props = {
  startYear: string;
  endYear: string;
  currentTerm: "first" | "second" | "third";
  termStart: string;
  termEnd: string;
  onChange: (partial: {
    startYear?: string;
    endYear?: string;
    currentTerm?: "first" | "second" | "third";
    termStart?: string;
    termEnd?: string;
  }) => void;
  onNext: () => void;
  onBack: () => void;
};

const TERMS: { value: "first" | "second" | "third"; label: string }[] = [
  { value: "first", label: "1st Term" },
  { value: "second", label: "2nd Term" },
  { value: "third", label: "3rd Term" },
];

export default function Step3Calendar({
  startYear,
  endYear,
  currentTerm,
  termStart,
  termEnd,
  onChange,
  onNext,
  onBack,
}: Props) {
  const canContinue =
    startYear.trim() && endYear.trim() && termStart && termEnd;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-semibold text-dark-blue">
          Academic calendar
        </h2>
        <p className="mt-1 text-sm text-grey-text">
          Set the current academic year and term dates.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-blue">
              Start year
            </label>
            <input
              type="number"
              min="1900"
              max="2100"
              placeholder="e.g. 2024"
              value={startYear}
              onChange={(e) => onChange({ startYear: e.target.value })}
              className="w-full rounded-lg border border-border-default px-4 py-2.5 text-sm text-dark-blue outline-none focus:border-brand-green"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-blue">
              End year
            </label>
            <input
              type="number"
              min="1900"
              max="2100"
              placeholder="e.g. 2025"
              value={endYear}
              onChange={(e) => onChange({ endYear: e.target.value })}
              className="w-full rounded-lg border border-border-default px-4 py-2.5 text-sm text-dark-blue outline-none focus:border-brand-green"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-dark-blue">
            Current term
          </label>
          <div className="flex gap-3">
            {TERMS.map((t) => (
              <label
                key={t.value}
                className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border py-2.5 text-sm transition-colors ${currentTerm === t.value ? "border-brand-green bg-green-50 font-medium text-brand-green" : "border-border-default text-grey-text hover:border-brand-green/50"}`}
              >
                <input
                  type="radio"
                  name="term"
                  value={t.value}
                  checked={currentTerm === t.value}
                  onChange={() => onChange({ currentTerm: t.value })}
                  className="sr-only"
                />
                {t.label}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-blue">
              Term start date
            </label>
            <input
              type="date"
              value={termStart}
              onChange={(e) => onChange({ termStart: e.target.value })}
              className="w-full rounded-lg border border-border-default px-4 py-2.5 text-sm text-dark-blue outline-none focus:border-brand-green"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-dark-blue">
              Term end date
            </label>
            <input
              type="date"
              value={termEnd}
              onChange={(e) => onChange({ termEnd: e.target.value })}
              className="w-full rounded-lg border border-border-default px-4 py-2.5 text-sm text-dark-blue outline-none focus:border-brand-green"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-border-default px-6 py-3 text-sm text-dark-blue hover:bg-gray-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className="flex-1 rounded-lg bg-brand-green py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
