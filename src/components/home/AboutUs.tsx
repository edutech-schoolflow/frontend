const VALUES = [
  {
    title: "Built for Nigeria",
    desc: "Our team, our thinking, and our roadmap are all shaped by the Nigerian school experience. Every feature we ship reflects the way Nigerian schools actually work — not how we wish they did.",
  },
  {
    title: "Trust first",
    desc: "Schools trust us with sensitive student and financial data. We earn that trust by being transparent about how we handle it and building security into everything from day one.",
  },
  {
    title: "Simple by design",
    desc: "A bursar should not need training to collect fees. A parent should not need a tutorial to check their child's results. We obsess over making complex things feel simple.",
  },
];

export default function AboutUs() {
  return (
    <section
      id="about"
      className="w-full bg-surface-muted px-8 py-24 md:px-12 lg:px-20 xl:px-28"
    >
      <div className="mx-auto max-w-[1240px]">
        {/* Top — label + headline + intro */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <span className="inline-block rounded-full border border-brand-green/30 bg-brand-mint px-4 py-1 text-[13px] font-medium text-brand-green">
              About us
            </span>
            <h2 className="mt-4 text-[42px] font-semibold leading-tight tracking-tight text-text-heading">
              The school management platform built for Nigerian schools
            </h2>
          </div>

          <div className="flex flex-col justify-center gap-5 text-[17px] leading-relaxed text-text-body">
            <p>
              Oneschoolplatform is a Nigerian school management company. We
              build the software that helps schools run — from collecting fees
              and managing student records to publishing results and keeping
              parents informed — all in one place.
            </p>
            <p>
              We work with nursery, primary, and secondary schools across
              Nigeria, giving administrators, teachers, bursars, and parents a
              single platform they can rely on every day.
            </p>
            <p>
              We are a Nigerian team, built from the ground up for Nigerian
              schools. Not adapted, not imported — designed here, for here.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-[10px] border border-border-default bg-white p-7"
            >
              <div className="mb-3 h-1 w-10 rounded-full bg-brand-green" />
              <h3 className="text-[18px] font-semibold text-text-heading">
                {v.title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-text-body">
                {v.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
