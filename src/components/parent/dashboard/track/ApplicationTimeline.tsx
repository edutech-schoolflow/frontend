import type { ApplicationStatus } from "@/src/types/application";

const STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "under_review", label: "Under review" },
  { key: "exam_scheduled", label: "Exam / Interview" },
  { key: "decision", label: "Decision" },
];

function stepIndex(status: ApplicationStatus): number {
  if (status === "under_review") return 1;
  if (status === "exam_scheduled") return 2;
  if (status === "admitted" || status === "not_admitted") return 3;
  return 0;
}

function decisionColor(status: ApplicationStatus) {
  if (status === "admitted") return "#1ca95c";
  if (status === "not_admitted") return "#e84040";
  return "#ccc";
}

export default function ApplicationTimeline({
  status,
}: {
  status: ApplicationStatus;
}) {
  const current = stepIndex(status);
  const isDecision = status === "admitted" || status === "not_admitted";

  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const isDone = i < current || (i === 3 && isDecision);
        const isCurrent = i === current && !isDecision;
        const isDecisionStep = i === 3;

        const dotColor =
          isDecisionStep && isDecision
            ? decisionColor(status)
            : isDone || isCurrent
              ? "#1ca95c"
              : "#e0e0e0";

        const lineColor = i < current ? "#1ca95c" : "#e0e0e0";

        return (
          <div key={step.key} className="flex flex-1 items-center">
            <div className="flex flex-col items-center gap-[6px]">
              <div
                className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white transition-colors"
                style={{ backgroundColor: dotColor }}
              >
                {isDone || (isDecisionStep && isDecision) ? "✓" : i + 1}
              </div>
              <p
                className="whitespace-nowrap text-[11px]"
                style={{
                  color: isCurrent
                    ? "#1b1b1b"
                    : isDone || (isDecisionStep && isDecision)
                      ? "#444"
                      : "#aaa",
                }}
              >
                {isCurrent ? <strong>{step.label}</strong> : step.label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="mx-[4px] h-[2px] flex-1 rounded-full transition-colors"
                style={{ backgroundColor: lineColor }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
