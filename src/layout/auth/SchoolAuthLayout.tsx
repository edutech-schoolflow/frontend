import Link from "next/link";
import Logo from "@/src/components/ui/Logo";
import { ReactNode } from "react";

const FEATURES = [
  "Collect school fees securely via OPay",
  "Manage students, classes, and staff",
  "Publish results and report cards",
  "Keep parents informed in real time",
  "Full KYC onboarding and compliance",
];

type Props = {
  children: ReactNode;
  title: string;
  subtitle: string;
};

export default function SchoolAuthLayout({ children, title, subtitle }: Props) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left panel ─────────────────────────────────────────────── */}
      <div
        className="hidden lg:flex lg:w-[44%] xl:w-[42%] flex-col justify-between relative overflow-hidden px-12 py-12 xl:px-16"
        style={{
          background:
            "linear-gradient(160deg, #00512d 0%, #00693a 60%, #007a42 100%)",
        }}
      >
        {/* Dot-grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Geometric accent circles */}
        <div
          className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(28,169,92,0.35) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-20 -left-16 h-56 w-56 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(28,169,92,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 rounded-tl-full"
          style={{ background: "rgba(0,0,0,0.08)" }}
        />

        {/* Content — sits above the decorative layer */}
        <div className="relative z-10">
          <Link href="/">
            <Logo size={32} textColor="#ffffff" />
          </Link>
        </div>

        {/* Centre copy */}
        <div className="relative z-10">
          {/* Thin accent bar */}
          <div className="mb-6 h-[3px] w-12 rounded-full bg-brand-green" />

          <h2 className="text-[34px] font-semibold leading-tight tracking-tight text-white xl:text-[38px]">
            Everything your school
            <br />
            needs, in one place.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-white/65">
            Join Nigerian schools already running smarter
            <br />
            with Oneschoolplatform.
          </p>

          <ul className="mt-10 space-y-[14px]">
            {FEATURES.map((f) => (
              <li
                key={f}
                className="flex items-center gap-3 text-[14px] text-white/80"
              >
                <span className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-white/15 text-white text-[11px] font-bold backdrop-blur-sm">
                  ✓
                </span>
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom trust line */}
        <p className="relative z-10 text-[12px] text-white/35">
          © {new Date().getFullYear()} Oneschoolplatform · Built for Nigerian
          schools
        </p>
      </div>

      {/* ── Right panel ────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-white">
        {/* Mobile logo (hidden on desktop) */}
        <div className="flex items-center justify-between border-b border-border-default px-6 py-4 lg:hidden">
          <Link href="/">
            <Logo size={26} />
          </Link>
          <Link
            href="/"
            className="text-[13px] text-text-body hover:text-text-heading transition-colors"
          >
            ← Home
          </Link>
        </div>

        {/* Form area */}
        <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-20">
          <div className="w-full max-w-[460px]">
            {/* Back to home — desktop only */}
            <Link
              href="/"
              className="mb-8 hidden items-center gap-1 text-[13px] text-text-body hover:text-text-heading transition-colors lg:flex"
            >
              ← Back to home
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-[28px] font-semibold tracking-tight text-text-heading">
                {title}
              </h1>
              <p className="mt-1.5 text-[15px] text-text-body">{subtitle}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
