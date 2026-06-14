import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/src/components/ui/Logo";

export const metadata: Metadata = {
  title: "Staff Portal — Oneschoolplatform",
  description:
    "Your professional staff identity. Manage attendance, scores, fees, and communication from one portable portal.",
};

const features = [
  {
    icon: "✅",
    title: "Attendance",
    desc: "Take the morning register digitally in under a minute. Parents are notified automatically.",
  },
  {
    icon: "📊",
    title: "Score Entry",
    desc: "Enter CA and exam scores directly. Totals, grades, and positions calculate automatically.",
  },
  {
    icon: "📋",
    title: "Exam Questions",
    desc: "Type and submit exam papers digitally to your HOD for review. Build a question bank.",
  },
  {
    icon: "📍",
    title: "Geo-fence Check-in",
    desc: "Check in to school with one tap. Your location is verified against the school geo-fence automatically.",
  },
  {
    icon: "💬",
    title: "Parent Messaging",
    desc: "Message parents about their child directly from your portal. Full conversation history saved.",
  },
  {
    icon: "🏫",
    title: "Portable Identity",
    desc: "Your profile, employment history, and qualifications move with you across schools.",
  },
];

export default function StaffLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-default bg-white px-6 py-4 md:px-12">
        <Link href="/">
          <Logo size={28} />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/staff/login"
            className="rounded-[5px] border border-brand-green px-5 py-2 text-[14px] font-medium text-brand-green transition-opacity hover:opacity-80"
          >
            Log in
          </Link>
          <Link
            href="/staff/register"
            className="rounded-[5px] bg-brand-green px-5 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Create account
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <span className="mb-4 inline-block rounded-full bg-brand-mint px-4 py-1 text-[13px] font-medium text-brand-green">
          For all school staff
        </span>
        <h1 className="mt-4 text-[42px] font-semibold leading-[1.15] tracking-tight text-text-heading md:text-[56px]">
          Your professional identity,
          <br />
          all in one portal
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-text-body">
          Teaching staff, bursars, registrars — everyone on the team has their
          own portal. Check in, manage responsibilities, and take your
          professional profile to every school you work at.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/staff/register"
            className="rounded-[5px] bg-brand-green px-8 py-3 text-[16px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Create a free account
          </Link>
          <Link
            href="/staff/login"
            className="rounded-[5px] border border-border-default px-8 py-3 text-[16px] font-medium text-text-body transition-colors hover:border-text-body"
          >
            Sign in to your portal
          </Link>
        </div>
      </section>

      {/* Features grid */}
      <section className="border-t border-border-default bg-[#f9fafb] px-6 py-16 md:px-12">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-10 text-center text-[26px] font-semibold text-text-heading">
            Everything school staff need
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl bg-white p-6 shadow-[0_1px_6px_rgba(0,0,0,0.07)]"
              >
                <div className="mb-3 text-[28px]">{f.icon}</div>
                <h3 className="mb-1 text-[15px] font-semibold text-text-heading">
                  {f.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-text-body">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-6 py-16 text-center">
        <h2 className="text-[26px] font-semibold text-text-heading">
          One profile. Every school you ever work at.
        </h2>
        <p className="mt-2 text-[15px] text-text-body">
          Register once. Get invited by schools. Move on — your records stay
          yours.
        </p>
        <Link
          href="/staff/register"
          className="mt-6 inline-block rounded-[5px] bg-brand-green px-10 py-3 text-[16px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Create a free account
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-default px-6 py-6 text-center text-[13px] text-text-body">
        <Link href="/" className="hover:text-text-heading">
          ← Back to main site
        </Link>
        <span className="mx-3 text-border-default">|</span>
        <span>© {new Date().getFullYear()} Oneschoolplatform</span>
      </footer>
    </div>
  );
}
