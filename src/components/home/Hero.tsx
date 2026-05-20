import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    /**
     * Figma: 1440px frame, 714px total height (639px below navbar)
     *
     * Left panel:  X:100, Y:130, W:547, H:464 → w-[54%] pl-25, content justify-center
     * Right panel: X:777 → flex-1, NO background (white from section)
     * Image:       X:777, Y:122, W:563, H:515 — mint (#DAFFEB) is inside the SVG only
     *              pt-11.75 (47px top) positions it at Y:122. White space on all other sides.
     * Hero height: 639px → h-159.75
     */
    <section className="flex w-full h-159.75 overflow-hidden bg-white">

      {/* Left — text content, vertically centered in the 639px height */}
      <div className="flex w-[54%] shrink-0 flex-col justify-center pl-25">

        <div className="flex flex-col gap-10.25 max-w-136.75">
          <h1 className="text-[56px] font-semibold leading-[1.1] tracking-tight text-text-heading">
            Manage<br />
            school life in<br />
            one place
          </h1>

          <p className="text-base leading-relaxed text-text-body">
            Everything parents and schools need in one<br />
            secure platform.
          </p>

          <Link
            href="/school/register"
            className="flex w-full items-center justify-center rounded-lg bg-brand-green py-4
                       text-base font-semibold text-white transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
        </div>

      </div>

      {/*
       * Right — white from section. Mint is a wrapper div (563×515) matching Figma bounds.
       * The SVG has no built-in mint background so we apply bg-brand-mint to the container.
       * pt-11.75 (47px) = Y:122 from frame − ~75px navbar
       */}
      <div className="hidden flex-1 pt-11.75 lg:block">
        <div className="relative h-128.75 w-140.75 overflow-hidden bg-brand-mint">
          <Image
            src="/images/svg/happymother.svg"
            alt="Happy mother and child"
            fill
            className="object-cover object-center"
            priority
          />
        </div>
      </div>

    </section>
  );
}
