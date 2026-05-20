import PageHeader from "@/src/shared/PageHeader";

const STEPS = [
  { label: "School Logo", done: true },
  { label: "Classes Offered", done: true },
  { label: "Academic Calendar", done: true },
  { label: "Invite Proprietor", done: false },
];

export default function OnboardingPage() {
  return (
    <div>
      <PageHeader
        title="School Setup"
        subtitle="Complete your school profile to get the most out of SchoolFlow."
      />

      <div className="max-w-lg space-y-3">
        {STEPS.map((step, i) => (
          <div
            key={step.label}
            className={`flex items-center gap-4 rounded-xl border p-4 ${
              step.done
                ? "border-green-200 bg-green-50"
                : "border-border-default bg-white"
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                step.done
                  ? "bg-green-500 text-white"
                  : "bg-brand-green text-white"
              }`}
            >
              {step.done ? "✓" : i + 1}
            </div>
            <div className="flex-1">
              <p
                className={`text-sm font-medium ${
                  step.done ? "text-green-700 line-through" : "text-dark-blue"
                }`}
              >
                {step.label}
              </p>
            </div>
            {!step.done && (
              <button className="rounded-lg bg-brand-green px-4 py-1.5 text-xs font-medium text-white">
                Complete
              </button>
            )}
          </div>
        ))}

        <div className="mt-6 rounded-xl border border-border-default bg-white p-4 text-center">
          <p className="text-sm font-medium text-dark-blue">🎉 30-Day Free Trial Active</p>
          <p className="mt-1 text-xs text-grey-text">
            You are on the Starter Plan (up to 100 students). Trial ends in 24 days.
          </p>
        </div>
      </div>
    </div>
  );
}
