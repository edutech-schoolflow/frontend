import Image from "next/image";

const STEPS = [
  {
    number: "01",
    title: "Sign up",
    desc: "Create your school or parent account in minutes.",
  },
  {
    number: "02",
    title: "Set up profiles",
    desc: "Schools add classes and students; parents link to their children.",
  },
  {
    number: "03",
    title: "Manage everything",
    desc: "Fees, results, attendance, and communications — all in one place.",
  },
  {
    number: "04",
    title: "Stay updated",
    desc: "Real-time notifications keep everyone informed, always.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-white px-6 py-24 md:px-12 lg:px-20 xl:px-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[13px] font-semibold uppercase tracking-widest text-brand-green">
            How it works
          </p>
          <h2 className="mt-3 text-[42px] font-semibold leading-tight tracking-tight text-text-heading">
            Up and running in 4 steps
          </h2>
        </div>

        <div className="mt-14 flex gap-8">
          {/* Image */}
          <div className="relative hidden h-[500px] w-[360px] shrink-0 overflow-hidden rounded-[12px] lg:block">
            <Image
              src="/images/svg/graduation.svg"
              alt="Students graduating"
              fill
              className="object-cover object-center"
            />
          </div>

          {/* Steps grid */}
          <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2">
            {STEPS.map((step) => (
              <div
                key={step.number}
                className="flex flex-col justify-between rounded-[12px] border border-border-default bg-white p-7"
              >
                <span className="text-[13px] font-semibold text-brand-green">
                  {step.number}
                </span>
                <div>
                  <h3 className="text-[20px] font-semibold text-text-heading">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-text-body">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
