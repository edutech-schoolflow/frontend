"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Settings, LogOut, HelpCircle, Bell } from "lucide-react";
import { useAuth } from "@/src/context/AuthContext";

export default function TeacherTopbar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuth();

  const fullName = user?.name ?? "Teacher";
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
        <button
          className="relative text-[#888] transition-colors hover:text-[#1b1b1b]"
          aria-label="Notifications"
        >
          <Bell className="h-[20px] w-[20px]" />
        </button>

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
                href="/teacher/dashboard/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#1b1b1b] hover:bg-[#f5f5f5]"
              >
                <Settings className="h-[15px] w-[15px] text-[#888]" />
                Settings
              </Link>
              <Link
                href="/teacher/dashboard/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#1b1b1b] hover:bg-[#f5f5f5]"
              >
                <HelpCircle className="h-[15px] w-[15px] text-[#888]" />
                My Profile
              </Link>
              <div className="my-[4px] h-px bg-[#f0f0f0]" />
              <button
                onClick={() => {
                  setOpen(false);
                  router.push("/teacher/login");
                }}
                className="flex w-full items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#e84040] hover:bg-[#fff5f5]"
              >
                <LogOut className="h-[15px] w-[15px]" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
