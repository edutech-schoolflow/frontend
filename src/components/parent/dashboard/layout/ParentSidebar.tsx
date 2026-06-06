"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

const MAIN_NAV = [
  { label: "Enrol your child", href: "/parent/dashboard" },
  { label: "Track application", href: "/parent/dashboard/track" },
  { label: "Fees", href: "/parent/dashboard/fees" },
  { label: "My children", href: "/parent/dashboard/children" },
  { label: "CA scores", href: "/parent/dashboard/ca-scores" },
  { label: "Report card", href: "/parent/dashboard/report-card" },
  { label: "Performance trend", href: "/parent/dashboard/performance" },
  { label: "Payment history", href: "/parent/dashboard/payment-history" },
];

export default function ParentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) =>
    href === "/parent/dashboard"
      ? pathname === href
      : pathname.startsWith(href);

  const itemCls = (href: string) =>
    `flex h-[45px] w-full items-center rounded-[5px] px-[18px] text-[14px] font-normal text-white transition-colors ${
      isActive(href) ? "bg-[#1ca95c]" : "hover:bg-white/10"
    }`;

  return (
    <aside className="flex h-screen w-[243px] shrink-0 flex-col bg-[#00512d]">
      {/* Logo */}
      <Link
        href="/"
        className="px-[29px] pt-[59px] pb-[46px] text-[16px] font-normal text-white"
      >
        SchoolFlow
      </Link>

      {/* Main nav */}
      <nav className="flex flex-col gap-px px-[29px]">
        {MAIN_NAV.map((item) => (
          <Link key={item.href} href={item.href} className={itemCls(item.href)}>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Spacer pushes bottom section down */}
      <div className="flex-1" />

      {/* Bottom section: Settings + user profile */}
      <div className="px-[29px] pb-[32px]">
        <Link
          href="/parent/dashboard/settings"
          className={itemCls("/parent/dashboard/settings")}
        >
          Settings
        </Link>

        <div className="my-4 h-px bg-white/20" />

        <div className="flex items-center gap-[10px]">
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#1ca95c] text-[13px] font-medium text-white">
            JO
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">
              John Okafor
            </p>
            <p className="text-[11px] text-white/60">Parent</p>
          </div>
          <button
            onClick={() => router.push("/parent/login")}
            className="shrink-0 text-white/60 transition-colors hover:text-white"
            aria-label="Log out"
          >
            <LogOut className="h-[16px] w-[16px]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
