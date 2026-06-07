import { HardHat } from "lucide-react";

interface InProgressProps {
  title: string;
  subtitle?: string;
  features?: string[];
}

export default function InProgress({
  title,
  subtitle,
  features,
}: InProgressProps) {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-xl border border-border-default bg-white px-8 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-500">
        <HardHat className="h-7 w-7" />
      </div>

      <h2 className="mt-5 text-[18px] font-semibold text-dark-blue">{title}</h2>

      <p className="mt-2 max-w-sm text-[14px] leading-relaxed text-grey-text">
        {subtitle ?? "This section is currently being built. Check back soon."}
      </p>

      {features && features.length > 0 && (
        <div className="mt-8 w-full max-w-sm rounded-lg border border-border-default bg-surface-muted px-6 py-4 text-left">
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-grey-text">
            What&apos;s coming
          </p>
          <ul className="space-y-2">
            {features.map((f) => (
              <li
                key={f}
                className="flex items-center gap-2 text-[13px] text-dark-blue"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-green" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
