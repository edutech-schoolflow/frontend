import Link from "next/link";

export default function PortalCards() {
  return (
    /**
     * Figma: 1440 × 761, bg = brand-green-dark
     * Side margins ~207px → max-w-5xl (1024px) centered
     * Section total height 761px → generous py-28 (112px top+bottom)
     */
    <section className="w-full bg-brand-green-dark px-6 py-28">

      <h2 className="text-center text-[38px] font-bold text-white">
        School life simplified for everyone
      </h2>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-10 md:grid-cols-2">

        {/* As a school — lighter green card */}
        <div className="flex min-h-72 flex-col rounded-2xl bg-brand-green-card p-10">
          <h3 className="text-2xl font-semibold text-white">As a school</h3>
          <p className="mt-4 text-base leading-relaxed text-white/90">
            Manage fees, students, results,<br />
            and communications.
          </p>

          <div className="mt-auto pt-20">
            <Link
              href="/school/login"
              className="block w-full rounded-lg bg-brand-green-dark py-4 text-center text-base font-semibold text-white transition-opacity hover:opacity-90"
            >
              Login/Register
            </Link>
          </div>
        </div>

        {/* As a parent — orange card */}
        <div className="flex min-h-72 flex-col rounded-2xl bg-brand-orange p-10">
          <h3 className="text-2xl font-semibold text-white">As a parent</h3>
          <p className="mt-4 text-base leading-relaxed text-white/90">
            Pay fees, track activities, and<br />
            stay updated.
          </p>

          <div className="mt-auto pt-20">
            <Link
              href="/parent/login"
              className="block w-full rounded-lg bg-white py-4 text-center text-base font-semibold text-text-heading transition-opacity hover:opacity-90"
            >
              Login/Register
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
