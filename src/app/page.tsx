import type { Metadata } from "next";
import Hero from "@/src/components/home/Hero";
import PortalCards from "@/src/components/home/PortalCards";
import HowItWorks from "@/src/components/home/HowItWorks";
import WhyChooseUs from "@/src/components/home/WhyChooseUs";
import BottomCta from "@/src/components/home/BottomCta";
import Link from "next/link";

export const metadata: Metadata = {
  title: "SchoolFlow — School Management for Nigerian Schools",
  description: "SchoolFlow helps Nigerian schools move from paper to digital.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-8 py-4 md:px-12 lg:px-20 xl:px-28">
        <Link href="/" className="text-lg font-semibold text-text-heading">
          SchoolFlow
        </Link>
        <nav className="hidden items-center gap-8 text-[18px] text-text-body md:flex">
          <Link
            href="#about"
            className="hover:text-text-heading transition-colors"
          >
            About us
          </Link>
        </nav>
        <Link
          href="/school/register"
          className="rounded-[5px] bg-brand-green px-5 py-2.5 text-[16px] font-normal text-white hover:opacity-90 transition-opacity"
        >
          Login/Register
        </Link>
      </header>

      <Hero />
      <PortalCards />
      <HowItWorks />
      <WhyChooseUs />
      <BottomCta />
    </div>
  );
}
