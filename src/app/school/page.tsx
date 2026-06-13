import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/src/components/ui/Logo";

export const metadata: Metadata = {
  title: "School Portal — Oneschoolplatform",
  description:
    "Manage your school digitally. Admissions, fees, results, staff, and more — in one place.",
};

const features = [
  {
    icon: "🎓",
    title: "Admissions",
    desc: "Receive and review applications online. No more paper forms.",
  },
  {
    icon: "💳",
    title: "Fee Collection",
    desc: "Track invoices, payments, and outstanding balances per student.",
  },
  {
    icon: "📊",
    title: "Results & Grades",
    desc: "Enter CA and exam scores. Auto-generate report cards each term.",
  },
  {
    icon: "👩‍🏫",
    title: "Staff Management",
    desc: "Manage teachers and support staff across your school.",
  },
  {
    icon: "📢",
    title: "Announcements",
    desc: "Send notices to parents and staff instantly from your dashboard.",
  },
  {
    icon: "🏫",
    title: "Student Records",
    desc: "Keep a complete, searchable digital record of every student.",
  },
];

export default function SchoolLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-default bg-white px-6 py-4 md:px-12">
        <Link href="/">
          <Logo size={28} />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/school/login"
            className="rounded-[5px] border border-brand-green px-5 py-2 text-[14px] font-medium text-brand-green transition-opacity hover:opacity-80"
          >
            Log in
          </Link>
          <Link
            href="/school/register"
            className="rounded-[5px] bg-brand-green px-5 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Register your school
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <span className="mb-4 inline-block rounded-full bg-brand-mint px-4 py-1 text-[13px] font-medium text-brand-green">
          Built for Nigerian schools
        </span>
        <h1 className="mt-4 text-[42px] font-semibold leading-[1.15] tracking-tight text-text-heading md:text-[56px]">
          Run your school
          <br />
          without the paperwork
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-text-body">
          Admissions, fees, results, attendance, and parent communication — all
          in one simple dashboard your team can start using today.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/school/register"
            className="rounded-[5px] bg-brand-green px-8 py-3 text-[16px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Get started — it&apos;s free
          </Link>
          <Link
            href="/school/login"
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
            Everything your school needs
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
          Ready to go digital?
        </h2>
        <p className="mt-2 text-[15px] text-text-body">
          Register your school in minutes. No technical setup required.
        </p>
        <Link
          href="/school/register"
          className="mt-6 inline-block rounded-[5px] bg-brand-green px-10 py-3 text-[16px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Register your school
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
