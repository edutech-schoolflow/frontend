import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/src/components/ui/Logo";

export const metadata: Metadata = {
  title: "Privacy Policy — Oneschoolplatform",
  description: "How Oneschoolplatform collects, uses, and protects your data.",
};

const EFFECTIVE_DATE = "1 June 2025";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border-default bg-white px-8 py-4 md:px-12 lg:px-20">
        <Link href="/">
          <Logo size={28} />
        </Link>
        <Link
          href="/"
          className="text-[14px] text-text-body hover:text-text-heading transition-colors"
        >
          ← Back to home
        </Link>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-[760px] px-6 py-16">
        {/* Title */}
        <div className="mb-12 border-b border-border-default pb-8">
          <h1 className="text-[42px] font-semibold leading-tight tracking-tight text-text-heading">
            Privacy Policy
          </h1>
          <p className="mt-3 text-[15px] text-text-body">
            Effective date: <strong>{EFFECTIVE_DATE}</strong>
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-text-body">
            Oneschoolplatform (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or
            &ldquo;us&rdquo;) is committed to protecting the privacy of every
            school, parent, and student who uses our platform. This policy
            explains what data we collect, why we collect it, and how we keep it
            safe — in line with the Nigeria Data Protection Act (NDPA) 2023.
          </p>
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed text-text-body">
          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              1. Who this applies to
            </h2>
            <p>This policy applies to:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                School administrators and staff who create and manage school
                accounts
              </li>
              <li>Parents and guardians who access the parent portal</li>
              <li>
                Students whose data is managed through the platform by their
                schools
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              2. Data we collect
            </h2>

            <h3 className="mb-2 mt-4 text-[16px] font-semibold text-text-heading">
              For schools
            </h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>School name, address, and registration details</li>
              <li>
                Proprietor and administrator names and contact information
              </li>
              <li>Bank account details for fee collection payouts</li>
              <li>
                KYC documents (CAC certificate, utility bills, government-issued
                IDs)
              </li>
            </ul>

            <h3 className="mb-2 mt-4 text-[16px] font-semibold text-text-heading">
              For parents
            </h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Full name, phone number, and email address</li>
              <li>Transaction history for fee payments</li>
              <li>Device and session information when you log in</li>
            </ul>

            <h3 className="mb-2 mt-4 text-[16px] font-semibold text-text-heading">
              For students
            </h3>
            <ul className="list-disc space-y-1 pl-5">
              <li>Name, date of birth, gender, and class</li>
              <li>Academic records (grades, attendance, report cards)</li>
              <li>Medical notes (where provided by the school)</li>
              <li>Previous school information</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              3. How we use your data
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>To create and manage your account on the platform</li>
              <li>To process fee payments and issue receipts</li>
              <li>
                To send notifications via SMS, WhatsApp, and email (e.g. fee
                reminders, result alerts)
              </li>
              <li>To generate report cards and academic records</li>
              <li>To verify schools through our KYC process</li>
              <li>To improve the platform and fix issues</li>
              <li>To comply with legal obligations under Nigerian law</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              4. Who we share data with
            </h2>
            <p>
              We do not sell your data. We share it only with trusted parties
              necessary to deliver our service:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>Payment processors</strong> (e.g. OPay, Paystack) — to
                process fee payments securely
              </li>
              <li>
                <strong>WhatsApp / Meta</strong> — to deliver invitation and
                notification messages
              </li>
              <li>
                <strong>Cloud infrastructure providers</strong> — to host and
                store data securely
              </li>
              <li>
                <strong>Regulators</strong> — where required by Nigerian law or
                a valid court order
              </li>
            </ul>
            <p className="mt-3">
              All third parties are required to handle your data in accordance
              with applicable Nigerian data protection law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              5. Children&apos;s data
            </h2>
            <p>
              Student records are submitted by schools and parents, not directly
              by students. We treat all student data with heightened care.
              Schools are responsible for ensuring they have appropriate consent
              from parents before adding student information to the platform. We
              do not use student data for advertising.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              6. Data security
            </h2>
            <p>
              We use industry-standard security measures including encryption in
              transit (HTTPS/TLS), encrypted data at rest, and role-based access
              controls. Staff access to personal data is limited to what is
              necessary for their role. Despite these measures, no system is
              completely secure — please contact us immediately if you suspect
              any unauthorised access to your account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              7. How long we keep your data
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Active account data is kept for as long as your account is open
              </li>
              <li>
                Payment and transaction records are kept for 7 years in line
                with Nigerian financial regulations
              </li>
              <li>
                Student academic records are kept for 10 years after the student
                leaves the school
              </li>
              <li>
                After these periods, data is securely deleted or anonymised
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              8. Your rights
            </h2>
            <p>
              Under the Nigeria Data Protection Act 2023, you have the right to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Access the personal data we hold about you</li>
              <li>Correct inaccurate data</li>
              <li>
                Request deletion of your data (subject to legal retention
                requirements)
              </li>
              <li>Object to or restrict certain types of processing</li>
              <li>Withdraw consent where processing is based on consent</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email us at{" "}
              <a
                href="mailto:privacy@oneschoolplatform.com"
                className="text-brand-green underline hover:opacity-80"
              >
                privacy@oneschoolplatform.com
              </a>
              . We will respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              9. Cookies
            </h2>
            <p>
              We use essential cookies to keep you logged in and maintain your
              session. We do not use advertising or tracking cookies. You can
              disable cookies in your browser settings, but this may prevent you
              from using parts of the platform.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              10. Changes to this policy
            </h2>
            <p>
              We may update this policy from time to time. When we do, we will
              notify school administrators by email and update the effective
              date at the top of this page. Your continued use of the platform
              after changes take effect means you accept the updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              11. Contact us
            </h2>
            <p>
              If you have any questions about this privacy policy or how we
              handle your data:
            </p>
            <div className="mt-3 space-y-1">
              <p>
                Email:{" "}
                <a
                  href="mailto:privacy@oneschoolplatform.com"
                  className="text-brand-green underline hover:opacity-80"
                >
                  privacy@oneschoolplatform.com
                </a>
              </p>
              <p>
                General:{" "}
                <a
                  href="mailto:hello@oneschoolplatform.com"
                  className="text-brand-green underline hover:opacity-80"
                >
                  hello@oneschoolplatform.com
                </a>
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Footer strip */}
      <div className="border-t border-border-default bg-surface-muted px-8 py-6 text-center text-[13px] text-text-body">
        <Link
          href="/terms-of-service"
          className="hover:text-text-heading underline"
        >
          Terms of Service
        </Link>
        <span className="mx-3 text-border-default">|</span>
        <Link href="/" className="hover:text-text-heading">
          ← Home
        </Link>
        <p className="mt-2 text-[12px] text-text-body/60">
          © {new Date().getFullYear()} Oneschoolplatform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
