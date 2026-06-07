import type { Metadata } from "next";
import Link from "next/link";
import Logo from "@/src/components/ui/Logo";

export const metadata: Metadata = {
  title: "Terms of Service — Oneschoolplatform",
  description: "The terms that govern your use of Oneschoolplatform.",
};

const EFFECTIVE_DATE = "1 June 2025";

export default function TermsOfServicePage() {
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
            Terms of Service
          </h1>
          <p className="mt-3 text-[15px] text-text-body">
            Effective date: <strong>{EFFECTIVE_DATE}</strong>
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-text-body">
            Please read these terms carefully before using Oneschoolplatform. By
            creating an account or using any part of our platform, you agree to
            be bound by these terms. If you do not agree, do not use the
            platform.
          </p>
        </div>

        <div className="space-y-10 text-[15px] leading-relaxed text-text-body">
          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              1. About us
            </h2>
            <p>
              Oneschoolplatform is a school management platform that connects
              Nigerian schools with parents and students. We provide tools for
              fee collection, student records, academic results, attendance,
              communications, and more. References to &ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;Oneschoolplatform&rdquo; refer to the
              company operating this service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              2. Who can use this platform
            </h2>
            <p>You may use Oneschoolplatform if you are:</p>
            <ul className="mt-3 list-disc space-y-1 pl-5">
              <li>
                A school administrator or staff member acting on behalf of a
                registered Nigerian school
              </li>
              <li>
                A parent or guardian of a student enrolled at a school using the
                platform
              </li>
              <li>At least 18 years of age</li>
              <li>
                Legally permitted to enter into contracts under Nigerian law
              </li>
            </ul>
            <p className="mt-3">
              Schools must complete our KYC verification process before fee
              collection features are activated. Students do not create accounts
              directly — their records are managed by schools and parents.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              3. Account responsibilities
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                You are responsible for keeping your login credentials and PIN
                secure
              </li>
              <li>
                You must not share your account with others or allow
                unauthorised access
              </li>
              <li>
                You must provide accurate information when registering and keep
                it up to date
              </li>
              <li>
                You must notify us immediately if you suspect your account has
                been compromised
              </li>
              <li>
                You are responsible for all activity that occurs under your
                account
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              4. School obligations
            </h2>
            <p>If you are a school using our platform, you agree to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Provide accurate school and KYC information and keep it current
              </li>
              <li>
                Obtain appropriate consent from parents before adding student
                records
              </li>
              <li>
                Use the platform only for lawful school administration purposes
              </li>
              <li>
                Not use the platform to collect fees you are not entitled to
              </li>
              <li>
                Ensure staff members who access the platform are authorised to
                do so
              </li>
              <li>Comply with all applicable Nigerian education regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              5. Parent obligations
            </h2>
            <p>If you are a parent using our platform, you agree to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                Use the platform only in connection with your child&apos;s
                school
              </li>
              <li>
                Make fee payments accurately and on time as set by your school
              </li>
              <li>
                Not attempt to reverse or dispute legitimate fee payments
                without cause
              </li>
              <li>Not share your OTP, PIN, or account access with anyone</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              6. Fees and payments
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Fee amounts are set by schools — Oneschoolplatform does not
                determine what your school charges
              </li>
              <li>
                Payments are processed through our third-party payment partners
                (e.g. OPay, Paystack)
              </li>
              <li>
                A small transaction fee may apply per payment, which will be
                disclosed before you confirm
              </li>
              <li>
                Once a fee payment is confirmed, it is final. Refunds are
                subject to the school&apos;s own refund policy
              </li>
              <li>
                Schools receive payouts to their verified bank account after our
                standard settlement period
              </li>
              <li>
                We reserve the right to withhold payouts if we suspect fraud or
                a breach of these terms
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              7. Acceptable use
            </h2>
            <p>You must not use Oneschoolplatform to:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Upload or share false, misleading, or defamatory content</li>
              <li>Collect fees or payments you are not entitled to receive</li>
              <li>
                Access another user&apos;s account without their permission
              </li>
              <li>
                Attempt to circumvent, disable, or tamper with security features
              </li>
              <li>
                Use the platform for money laundering or any other illegal
                financial activity
              </li>
              <li>
                Scrape, copy, or republish platform content without our written
                permission
              </li>
              <li>Harass, threaten, or discriminate against other users</li>
            </ul>
            <p className="mt-3">
              We may suspend or terminate any account that violates these rules
              without notice.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              8. Intellectual property
            </h2>
            <p>
              The Oneschoolplatform name, logo, and all platform content
              (design, code, copy) are our intellectual property. You may not
              copy, reproduce, or create derivative works from any part of our
              platform without written permission. Your school&apos;s data
              (student records, fee history, reports) remains yours — we do not
              claim ownership of it.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              9. Platform availability
            </h2>
            <p>
              We aim to keep the platform available 24/7 but do not guarantee
              uninterrupted access. We may carry out maintenance, updates, or be
              impacted by factors outside our control (e.g. network outages,
              third-party payment downtime). We will communicate planned
              downtime in advance where possible.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              10. Limitation of liability
            </h2>
            <p>To the fullest extent permitted by Nigerian law:</p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                We are not liable for any indirect, incidental, or consequential
                loss arising from your use of the platform
              </li>
              <li>
                We are not responsible for disputes between schools and parents
                over fees, grades, or student matters
              </li>
              <li>
                Our total liability for any single claim is limited to the
                amount you paid to us in the 3 months preceding the claim
              </li>
              <li>
                We do not guarantee the accuracy of information entered by
                schools or parents (e.g. grades, medical notes)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              11. Termination
            </h2>
            <p>
              Either party may terminate the account at any time. Schools may
              delete their account from the settings page. We may terminate or
              suspend an account immediately if we believe there has been a
              breach of these terms, fraud, or illegal activity. Upon
              termination, we will retain data as required by law (see our
              Privacy Policy). Fee collection will be disabled immediately on
              termination.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              12. Changes to these terms
            </h2>
            <p>
              We may update these terms from time to time. We will notify school
              administrators by email at least 14 days before material changes
              take effect. Your continued use of the platform after that date
              means you accept the new terms. If you do not accept the changes,
              you should close your account before they take effect.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              13. Governing law
            </h2>
            <p>
              These terms are governed by the laws of the Federal Republic of
              Nigeria. Any dispute arising from or related to these terms shall
              be subject to the exclusive jurisdiction of the Nigerian courts.
              We encourage informal resolution first — please contact us before
              initiating legal proceedings.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-[22px] font-semibold text-text-heading">
              14. Contact us
            </h2>
            <p>Questions about these terms?</p>
            <div className="mt-3 space-y-1">
              <p>
                Email:{" "}
                <a
                  href="mailto:legal@oneschoolplatform.com"
                  className="text-brand-green underline hover:opacity-80"
                >
                  legal@oneschoolplatform.com
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
          href="/privacy-policy"
          className="hover:text-text-heading underline"
        >
          Privacy Policy
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
