import Link from "next/link";

export default function PortalCards() {
  return (
    /**
     * Figma: 1440 × 761, bg = brand-green-dark
     * Side margins ~207px → max-w-5xl (1024px) centered
     * Section total height 761px → generous py-28 (112px top+bottom)
     */
    <section className="w-full bg-brand-green-dark px-6 py-28">
      <h2 className="text-center text-[50px] font-semibold text-white">
        School life simplified for everyone
      </h2>

      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-[21px] md:grid-cols-2">
        {/* As a school — primary green card */}
        <div className="flex h-[434px] flex-col rounded-[10px] bg-brand-green px-[49px] py-[58px]">
          <h3 className="text-[40px] font-semibold text-white">As a school</h3>
          <p className="mt-[14px] text-[30px] leading-[45px] text-white">
            Manage fees, students, results,
            <br />
            and communications.
          </p>

          <div className="mt-auto">
            <Link
              href="/school/login"
              className="flex h-[59px] w-[400px] items-center justify-center rounded-[5px] bg-brand-green-dark text-[20px] font-normal text-white transition-opacity hover:opacity-90"
            >
              Login/Register
            </Link>
          </div>
        </div>

        {/* As a parent — orange card */}
        <div className="flex h-[434px] flex-col rounded-[10px] bg-brand-orange px-[49px] py-[58px]">
          <h3 className="text-[40px] font-semibold text-white">As a parent</h3>
          <p className="mt-[14px] text-[30px] leading-[45px] text-white">
            Pay fees, track activities, and
            <br />
            stay updated.
          </p>

          <div className="mt-auto">
            <Link
              href="/parent/login"
              className="flex h-[59px] w-[400px] items-center justify-center rounded-[5px] bg-white text-[20px] font-normal text-text-heading transition-opacity hover:opacity-90"
            >
              Login/Register
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
