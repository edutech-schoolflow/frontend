"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import Logo from "@/src/components/ui/Logo";

// Design tokens shared by every unified auth screen — the same visual language as the rest of the
// app's auth surfaces (green brand panel left, white form panel right).
export const AUTH_INPUT =
  "h-[46px] w-full rounded-[10px] border border-[#ccc] bg-white px-[17px] text-[14px] text-[#1b1b1b] placeholder:text-[#aaa] outline-none focus:border-brand-green focus-visible:outline-none";
export const AUTH_LABEL = "text-[14px] font-normal text-[#666]";
export const AUTH_BUTTON =
  "flex h-[59px] w-full items-center justify-center rounded-[5px] text-[20px] font-normal transition-colors " +
  "disabled:cursor-not-allowed disabled:bg-[#eee] disabled:text-[#888] " +
  "enabled:bg-brand-green enabled:text-white enabled:hover:opacity-90";

/**
 * The split-screen shell every unified auth page shares: brand panel with the platform illustration
 * on the left (hidden on small screens), scrollable white form panel on the right.
 */
export default function AuthShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="grid h-screen grid-cols-1 lg:grid-cols-[710px_1fr]">
      {/* Left — green photo panel */}
      <div className="relative hidden overflow-hidden bg-brand-green lg:block">
        <Link href="/" className="absolute left-[80px] top-[57px] z-10">
          <Logo size={30} textColor="white" />
        </Link>
        <Image
          src="/images/svg/parentchildscreen.svg"
          alt=""
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Right — white panel */}
      <div className="relative overflow-y-auto bg-white">
        <button
          onClick={() => router.push("/")}
          className="absolute right-8 top-8 flex h-8 w-8 items-center justify-center rounded-full text-text-body transition-colors hover:bg-surface-subtle"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Mobile-only logo (the brand panel is hidden) */}
        <div className="px-6 pt-8 lg:hidden">
          <Link href="/">
            <Logo size={28} />
          </Link>
        </div>

        <div className="flex flex-col px-6 py-10 sm:px-12 lg:pl-[105px] lg:pr-[99px] lg:pt-[94px]">
          {children}
        </div>
      </div>
    </div>
  );
}
