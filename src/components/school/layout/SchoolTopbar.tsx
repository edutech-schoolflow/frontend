"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle,
  ArrowLeftRight,
} from "lucide-react";
import { toast } from "sonner";
import { useLogout } from "@/src/lib/api/useSchoolAuth";
import { useIdentity } from "@/src/lib/api/useIdentity";

// basePath mirrors SchoolSidebar so the topbar's links resolve within whichever tree it renders in.
export default function SchoolTopbar({
  basePath = "/school/dashboard",
}: {
  basePath?: string;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: user } = useIdentity();
  const logout = useLogout();


  const fullName = user?.fullName ?? "";
  const firstName = fullName.split(" ")[0];
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="flex h-[61px] shrink-0 items-center justify-between bg-white px-[30px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)]">
      <p className="text-[20px] font-normal text-[#1b1b1b]">
        Welcome, {firstName} 👋
      </p>

      <div className="flex items-center gap-[16px]">
        {/* Chat — placeholder for future teacher-parent messaging */}
        <button
          className="relative text-[#555] hover:text-[#1b1b1b]"
          aria-label="Messages"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.992 16.342A9 9 0 1 1 7.658 21.01L3 22l1-4.658" />
          </svg>
        </button>

        {/* Notifications */}
        <Link
          href={`${basePath}/notifications`}
          className="relative text-[#555] hover:text-[#1b1b1b]"
          aria-label="Notifications"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </Link>

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-[3px]"
            aria-label="User menu"
          >
            <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#1ca95c] text-[11px] font-medium text-white">
              {initials}
            </div>
            <ChevronDown
              className={`h-[15px] w-[15px] text-[#1b1b1b] transition-transform ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[200px] rounded-[8px] border border-[#eee] bg-white py-[6px] shadow-lg">
              <p className="px-[16px] py-[8px] text-[12px] text-[#aaa]">
                {fullName}
              </p>
              <div className="my-[4px] h-px bg-[#f0f0f0]" />
              <Link
                href="/select-context"
                onClick={() => setOpen(false)}
                className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#1b1b1b] hover:bg-[#f5f5f5]"
              >
                <ArrowLeftRight className="h-[15px] w-[15px] text-[#888]" />
                Switch workspace
              </Link>
              <Link
                href={`${basePath}/settings/onboarding`}
                onClick={() => setOpen(false)}
                className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#1b1b1b] hover:bg-[#f5f5f5]"
              >
                <Settings className="h-[15px] w-[15px] text-[#888]" />
                Settings
              </Link>
              <Link
                href="/help"
                onClick={() => setOpen(false)}
                className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#1b1b1b] hover:bg-[#f5f5f5]"
              >
                <HelpCircle className="h-[15px] w-[15px] text-[#888]" />
                Help & support
              </Link>
              <div className="my-[4px] h-px bg-[#f0f0f0]" />
              <button
                onClick={() => {
                  setOpen(false);
                  // Clears the server cookies + Redux, then redirects to login.
                  logout.mutate(undefined, {
                    onSettled: () => {
                      window.location.href = "/school/login";
                    },
                  });
                }}
                disabled={logout.isPending}
                className="flex w-full items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#e84040] hover:bg-[#fff5f5] disabled:opacity-50"
              >
                <LogOut className="h-[15px] w-[15px]" />
                {logout.isPending ? "Logging out…" : "Log out"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
