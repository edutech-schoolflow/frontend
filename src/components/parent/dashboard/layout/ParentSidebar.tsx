"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShoppingBag } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";
import Logo from "@/src/components/ui/Logo";
import type { ReactNode } from "react";

const MAIN_NAV: Array<{ label: string; href: string; icon: ReactNode }> = [
  {
    label: "Compliance",
    href: "/parent/dashboard/compliance",
    icon: <Image src="/icons/secure.svg" alt="" width={18} height={18} />,
  },
  {
    label: "My Children",
    href: "/parent/dashboard/children",
    icon: <Image src="/icons/user-group.svg" alt="" width={18} height={18} />,
  },
  {
    label: "Find a school",
    href: "/parent/dashboard/search",
    icon: <Image src="/icons/folder.svg" alt="" width={18} height={18} />,
  },
  {
    label: "Track application",
    href: "/parent/dashboard/track",
    icon: <Image src="/icons/check-circle.svg" alt="" width={18} height={18} />,
  },
  {
    label: "School Store",
    href: "/parent/dashboard/store",
    icon: <ShoppingBag size={18} />,
  },
  {
    label: "Fees",
    href: "/parent/dashboard/fees",
    icon: <Image src="/icons/finance.svg" alt="" width={18} height={18} />,
  },
  {
    label: "CA scores",
    href: "/parent/dashboard/ca-scores",
    icon: <Image src="/icons/pen-paper.svg" alt="" width={18} height={18} />,
  },
  {
    label: "Report card",
    href: "/parent/dashboard/report-card",
    icon: <Image src="/icons/drafts.svg" alt="" width={18} height={18} />,
  },
  {
    label: "Performance trend",
    href: "/parent/dashboard/performance",
    icon: <Image src="/icons/barchart.svg" alt="" width={18} height={18} />,
  },
  {
    label: "Payment history",
    href: "/parent/dashboard/payment-history",
    icon: <Image src="/icons/receipt.svg" alt="" width={18} height={18} />,
  },
];

export default function ParentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const fullName = user?.name ?? "John Okafor";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

  const isActive = (href: string) => pathname.startsWith(href);

  const itemCls = (href: string) =>
    `flex h-[42px] w-full items-center gap-[10px] rounded-[6px] px-[10px] text-[13.5px] font-normal text-white transition-colors ${
      isActive(href) ? "bg-[#1ca95c]" : "hover:bg-white/10"
    }`;

  return (
    <aside className="flex h-screen w-[243px] shrink-0 flex-col bg-[#00512d]">
      {/* Logo */}
      <Link href="/parent/dashboard" className="px-[20px] pt-[28px] pb-[24px]">
        <Logo size={28} textColor="white" />
      </Link>

      {/* Main nav */}
      <nav className="flex flex-col gap-px overflow-y-auto px-[12px]">
        {MAIN_NAV.map((item) => (
          <Link key={item.href} href={item.href} className={itemCls(item.href)}>
            <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-white/15">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className="border-t border-white/10 px-[12px] py-[16px]">
        <Link
          href="/parent/dashboard/settings"
          className={itemCls("/parent/dashboard/settings")}
        >
          <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-white/15">
            <Image src="/icons/chip.svg" alt="" width={18} height={18} />
          </span>
          Settings
        </Link>

        <div className="mt-[12px] flex items-center gap-[10px] px-[4px]">
          <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#1ca95c] text-[12px] font-semibold text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">
              {fullName}
            </p>
            <p className="text-[11px] text-white/60">Parent</p>
          </div>
          <button
            onClick={() => router.push("/parent/login")}
            className="shrink-0 text-white/60 transition-colors hover:text-white"
            aria-label="Log out"
          >
            <LogOut className="h-[15px] w-[15px]" />
          </button>
        </div>
      </div>
    </aside>
  );
}
