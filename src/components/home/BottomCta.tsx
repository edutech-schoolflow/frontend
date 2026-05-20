import Image from "next/image";
import Link from "next/link";

export default function BottomCta() {
  return (
    /**
     * Figma: frame W:1240, H:525, X:100 → px-25 side margins
     * Two equal panels: each W:610, H:525, gap:20 → gap-5
     * Using grid grid-cols-2 guarantees exactly equal column widths
     *
     * Right panel: padding top/bottom:49 → py-12.25
     *              padding left/right:104 → px-26
     *              gap between items: 10 → gap-2.5
     *              corner-radius: 10
     *              fill: sec color (brand-green-dark)
     */
    <section className="w-full px-25 py-20">

      <div className="grid h-131.25 grid-cols-2 gap-5 overflow-hidden">

        {/* Left — orange bg, payfee image centered */}
        <div className="flex items-center justify-center bg-brand-orange overflow-hidden">
          <Image
            src="/images/svg/payfee.svg"
            alt="Woman holding a payment card"
            width={357}
            height={522}
            className="h-full w-auto"
            priority
          />
        </div>

        {/* Right — dark green CTA */}
        <div className="flex flex-col justify-center gap-2.5 rounded-[10px] bg-brand-green-dark px-26 py-12.25">
          <h2 className="text-5xl font-bold leading-tight text-white">
            Handle everything<br />with ease, anywhere
          </h2>

          <Link
            href="/school/register"
            className="mt-6 flex w-75 items-center justify-center rounded-lg bg-brand-green py-4 text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
        </div>

      </div>
    </section>
  );
}
