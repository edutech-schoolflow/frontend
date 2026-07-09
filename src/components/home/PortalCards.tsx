
const SCHOOL_FEATURES = [
  "Collect fees via Monnify — zero cash handling",
  "Manage students, classes, and staff",
  "Publish results and report cards digitally",
  "Send announcements to parents instantly",
];

const PARENT_FEATURES = [
  "Pay school fees from your phone",
  "Track your child&apos;s attendance and results",
  "Receive real-time school notifications",
  "Apply to schools and track applications",
];

const STAFF_FEATURES = [
  "Geo-fence check-in — verified against school location",
  "Teachers: attendance, scores, and exam questions digitally",
  "Bursars & registrars: manage fees and student records",
  "Your professional profile stays with you across schools",
];

export default function PortalCards() {
  return (
    <section className="w-full bg-white px-6 py-24 md:px-12 lg:px-20 xl:px-28">
      <div className="mx-auto max-w-[1240px]">
        {/* Heading */}
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-brand-green">
            One platform
          </p>
          <h2 className="mt-3 text-[42px] font-semibold leading-tight tracking-tight text-text-heading">
            Built for everyone in the school
          </h2>
          <p className="mt-4 text-[17px] leading-relaxed text-text-body">
            Schools, parents, and staff — each with their own portal, all
            connected on one platform.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* School card */}
          <div className="flex flex-col rounded-[14px] border border-border-default bg-white p-8">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-brand-mint">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#1ca95c"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <h3 className="mt-5 text-[24px] font-semibold text-text-heading">
              For schools
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-body">
              Everything an admin or bursar needs — in one dashboard.
            </p>
            <ul className="mt-6 space-y-3">
              {SCHOOL_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-[14px] text-text-body"
                >
                  <span className="mt-[3px] h-[18px] w-[18px] shrink-0 flex items-center justify-center rounded-full bg-brand-mint text-brand-green text-[10px] font-bold">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Parent card */}
          <div className="flex flex-col rounded-[14px] border border-border-default bg-[#fdf9f6] p-8">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#fde8cc]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#f47e14"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <h3 className="mt-5 text-[24px] font-semibold text-text-heading">
              For parents
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-body">
              Stay connected to your child&apos;s school life without a phone
              call.
            </p>
            <ul className="mt-6 space-y-3">
              {PARENT_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-[14px] text-text-body"
                >
                  <span className="mt-[3px] h-[18px] w-[18px] shrink-0 flex items-center justify-center rounded-full bg-[#fde8cc] text-[#f47e14] text-[10px] font-bold">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Staff card */}
          <div className="flex flex-col rounded-[14px] border border-border-default bg-[#f5f4ff] p-8">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] bg-[#e0ddff]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#5b4fcf"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <h3 className="mt-5 text-[24px] font-semibold text-text-heading">
              For staff
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-text-body">
              Teaching and non-teaching staff — one portable professional
              identity across every school you work at.
            </p>
            <ul className="mt-6 space-y-3">
              {STAFF_FEATURES.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2.5 text-[14px] text-text-body"
                >
                  <span className="mt-[3px] h-[18px] w-[18px] shrink-0 flex items-center justify-center rounded-full bg-[#e0ddff] text-[#5b4fcf] text-[10px] font-bold">
                    ✓
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
