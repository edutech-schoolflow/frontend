
export default function BottomCta() {
  return (
    <section className="w-full bg-white px-6 py-24 md:px-12 lg:px-20 xl:px-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="overflow-hidden rounded-[16px] bg-[#00512d] px-10 py-16 md:px-16 lg:px-20">
          {/* Subtle dot pattern */}
          <div className="relative">
            <div
              className="pointer-events-none absolute inset-0 rounded-[16px]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative flex flex-col items-center text-center">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-white/50">
                Get started today
              </p>
              <h2 className="mt-4 text-[40px] font-semibold leading-tight tracking-tight text-white md:text-[48px]">
                Ready to modernise
                <br />
                your school?
              </h2>
              <p className="mt-4 max-w-lg text-[17px] leading-relaxed text-white/70">
                Join Nigerian schools already saving time, reducing errors, and
                keeping parents happier with Oneschoolplatform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
