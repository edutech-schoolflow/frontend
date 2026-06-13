import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

type Props = {
  logoUploaded: boolean;
  classesConfigured: boolean;
  calendarSet: boolean;
};

const STEPS = [
  { label: "School logo", key: "logoUploaded" as const },
  { label: "Classes configured", key: "classesConfigured" as const },
  { label: "Academic calendar set", key: "calendarSet" as const },
];

export default function Step5Summary(props: Props) {
  const router = useRouter();
  const doneCount = STEPS.filter((s) => props[s.key]).length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-semibold text-dark-blue">
          {doneCount === 3 ? "🎉 Setup complete!" : "Setup summary"}
        </h2>
        <p className="mt-1 text-sm text-grey-text">
          {doneCount === 3
            ? "Your school is set up. Complete your compliance profile to unlock all features."
            : `${doneCount} of ${STEPS.length} steps completed. You can finish the rest any time.`}
        </p>
      </div>

      <div className="space-y-2">
        {STEPS.map((step) => {
          const done = props[step.key];
          return (
            <div
              key={step.label}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 ${done ? "border-green-200 bg-green-50" : "border-border-default bg-white"}`}
            >
              <CheckCircle2
                className={`h-5 w-5 shrink-0 ${done ? "text-brand-green" : "text-gray-300"}`}
              />
              <p
                className={`text-sm font-medium ${done ? "text-green-700" : "text-grey-text"}`}
              >
                {step.label}
              </p>
              {!done && (
                <span className="ml-auto text-xs text-grey-text">Skipped</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
        <p className="text-sm font-semibold text-amber-800">
          Complete your compliance profile
        </p>
        <p className="mt-1 text-xs text-amber-700">
          Head to <strong>Compliance</strong> in the sidebar to verify your
          school and unlock fee collection and full platform access.
        </p>
      </div>

      <div className="rounded-xl border border-border-default bg-white p-4 text-center">
        <p className="text-sm font-medium text-dark-blue">
          🎉 30-Day Free Trial Active
        </p>
        <p className="mt-1 text-xs text-grey-text">
          You are on the Starter Plan (up to 100 students). Trial ends in 24
          days.
        </p>
      </div>

      <button
        type="button"
        onClick={() => router.push("/school/dashboard")}
        className="w-full rounded-lg bg-brand-green py-3 text-sm font-medium text-white hover:opacity-90"
      >
        Go to Dashboard →
      </button>
    </div>
  );
}
