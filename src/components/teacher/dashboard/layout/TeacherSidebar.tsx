"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Logo from "@/src/components/ui/Logo";
import { useAuth } from "@/src/context/AuthContext";

const MAIN_NAV = [
  { label: "Compliance", href: "/teacher/dashboard/compliance" },
  { label: "Home", href: "/teacher/dashboard" },
  { label: "My Classes", href: "/teacher/dashboard/classes" },
  { label: "Attendance", href: "/teacher/dashboard/attendance" },
  { label: "Grades", href: "/teacher/dashboard/grades" },
  { label: "Exam Questions", href: "/teacher/dashboard/exams" },
  { label: "My Schools", href: "/teacher/dashboard/schools" },
];

export default function TeacherSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const fullName = user?.name ?? "Teacher";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

  const isActive = (href: string) =>
    href === "/teacher/dashboard"
      ? pathname === href
      : pathname.startsWith(href);

  const itemCls = (href: string) =>
    `flex h-[45px] w-full items-center rounded-[5px] px-[18px] text-[14px] font-normal text-white transition-colors ${
      isActive(href) ? "bg-[#1ca95c]" : "hover:bg-white/10"
    }`;

  return (
    <aside className="flex h-screen w-[243px] shrink-0 flex-col bg-[#00512d]">
      <Link href="/teacher/dashboard" className="px-[29px] pt-[59px] pb-[46px]">
        <Logo size={30} textColor="white" />
      </Link>

      <nav className="flex flex-col gap-px px-[29px]">
        {MAIN_NAV.map((item) => (
          <Link key={item.href} href={item.href} className={itemCls(item.href)}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="px-[29px] pb-[32px]">
        <Link
          href="/teacher/dashboard/profile"
          className={itemCls("/teacher/dashboard/profile")}
        >
          My Profile
        </Link>
        <Link
          href="/teacher/dashboard/settings"
          className={itemCls("/teacher/dashboard/settings")}
        >
          Settings
        </Link>

        <div className="my-4 h-px bg-white/20" />

        <div className="flex items-center gap-[10px]">
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#1ca95c] text-[13px] font-medium text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium text-white">
              {fullName}
            </p>
            <p className="text-[11px] text-white/60">Teacher</p>
          </div>
          <button
            onClick={() => router.push("/teacher/login")}
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
