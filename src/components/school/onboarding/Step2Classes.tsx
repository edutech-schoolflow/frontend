const CLASS_GROUPS = [
  { group: "Nursery", levels: ["Nursery 1", "Nursery 2", "Nursery 3"] },
  {
    group: "Primary",
    levels: [
      "Primary 1",
      "Primary 2",
      "Primary 3",
      "Primary 4",
      "Primary 5",
      "Primary 6",
    ],
  },
  { group: "JSS", levels: ["JSS 1", "JSS 2", "JSS 3"] },
  { group: "SSS", levels: ["SSS 1", "SSS 2", "SSS 3"] },
];

type Props = {
  selected: string[];
  onChange: (levels: string[]) => void;
  onNext: () => void;
  onBack: () => void;
};

export default function Step2Classes({
  selected,
  onChange,
  onNext,
  onBack,
}: Props) {
  function toggleLevel(level: string) {
    onChange(
      selected.includes(level)
        ? selected.filter((l) => l !== level)
        : [...selected, level]
    );
  }

  function toggleGroup(levels: string[]) {
    const allSelected = levels.every((l) => selected.includes(l));
    onChange(
      allSelected
        ? selected.filter((l) => !levels.includes(l))
        : [...new Set([...selected, ...levels])]
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-semibold text-dark-blue">
          Classes offered
        </h2>
        <p className="mt-1 text-sm text-grey-text">
          Select all class levels your school runs.{" "}
          {selected.length > 0 && (
            <span className="font-medium text-brand-green">
              {selected.length} selected
            </span>
          )}
        </p>
      </div>

      <div className="space-y-4">
        {CLASS_GROUPS.map(({ group, levels }) => {
          const allChecked = levels.every((l) => selected.includes(l));
          const someChecked = levels.some((l) => selected.includes(l));
          return (
            <div
              key={group}
              className="rounded-lg border border-border-default p-4"
            >
              <label className="flex cursor-pointer items-center gap-2 font-medium text-dark-blue">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => {
                    if (el) el.indeterminate = someChecked && !allChecked;
                  }}
                  onChange={() => toggleGroup(levels)}
                  className="accent-brand-green"
                />
                {group}
              </label>
              <div className="mt-3 flex flex-wrap gap-2">
                {levels.map((level) => (
                  <label
                    key={level}
                    className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border-default px-3 py-1 text-sm hover:border-brand-green"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(level)}
                      onChange={() => toggleLevel(level)}
                      className="accent-brand-green"
                    />
                    {level}
                  </label>
                ))}
              </div>
            </div>
          );
        })}
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
          disabled={selected.length === 0}
          className="flex-1 rounded-lg bg-brand-green py-3 text-sm font-medium text-white hover:opacity-90 disabled:opacity-40"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
