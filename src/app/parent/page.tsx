import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/src/components/ui/Logo";

export const metadata: Metadata = {
  title: "Parent Portal — Oneschoolplatform",
  description:
    "Stay on top of your child's school life. Fees, results, attendance, and more — all in one place.",
};

const features = [
  {
    icon: "📋",
    title: "School Applications",
    desc: "Apply to multiple schools for your child from one place. Track every application status.",
  },
  {
    icon: "💳",
    title: "Fee Payments",
    desc: "Pay school fees securely from your wallet. Get instant receipts and payment history.",
  },
  {
    icon: "📊",
    title: "Results & Report Cards",
    desc: "View your child's scores, grades, and report cards as soon as school publishes them.",
  },
  {
    icon: "✅",
    title: "Attendance",
    desc: "Get notified the moment your child is marked absent or late at school.",
  },
  {
    icon: "📢",
    title: "School Notices",
    desc: "Receive announcements and messages from your child's school directly in the app.",
  },
  {
    icon: "👨‍👩‍👧",
    title: "Multiple Children",
    desc: "Manage all your children across different schools from a single parent account.",
  },
];

export default function ParentLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-default bg-white px-6 py-4 md:px-12">
        <Link href="/">
          <Logo size={28} />
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/parent/login"
            className="rounded-[5px] border border-brand-green px-5 py-2 text-[14px] font-medium text-brand-green transition-opacity hover:opacity-80"
          >
            Log in
          </Link>
          <Link
            href="/parent/register"
            className="rounded-[5px] bg-brand-green px-5 py-2 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Create account
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center md:py-28">
        <span className="mb-4 inline-block rounded-full bg-brand-mint px-4 py-1 text-[13px] font-medium text-brand-green">
          For parents & guardians
        </span>
        <h1 className="mt-4 text-[42px] font-semibold leading-[1.15] tracking-tight text-text-heading md:text-[56px]">
          Always know what&apos;s
          <br />
          happening at school
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-text-body">
          Pay fees, check results, track attendance, and stay connected with
          your child&apos;s school — all from your phone or laptop.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/parent/register"
            className="rounded-[5px] bg-brand-green px-8 py-3 text-[16px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Create a free account
          </Link>
          <Link
            href="/parent/login"
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
            Everything in one place
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
          Join thousands of parents already using the platform
        </h2>
        <p className="mt-2 text-[15px] text-text-body">
          Sign up in minutes. No school invite needed to get started.
        </p>
        <Link
          href="/parent/register"
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
