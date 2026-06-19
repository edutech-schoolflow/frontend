"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import Logo from "@/src/components/ui/Logo";
import { useAuth } from "@/src/context/AuthContext";
import { useStaffFeatures } from "@/src/context/StaffFeaturesContext";
import { ROLE_LABELS } from "@/src/types/staff";
import type { StaffFeatures } from "@/src/types/staffFeatures";
import type { ReactNode } from "react";

// ─── Nav definition ────────────────────────────────────────────────────────────

const NAV_ITEMS: Array<{
  label: string;
  href: string;
  icon: ReactNode;
  rawIcon?: boolean;
  feature?: keyof StaffFeatures;
}> = [
  {
    label: "Compliance",
    href: "/staff/dashboard/compliance",
    icon: <Image src="/icons/secure.svg" alt="" width={18} height={18} />,
    rawIcon: true,
  },
  {
    label: "Home",
    href: "/staff/dashboard",
    icon: <Image src="/icons/dashboard.svg" alt="" width={18} height={18} />,
  },
  {
    label: "My Classes",
    href: "/staff/dashboard/classes",
    icon: (
      <Image src="/icons/user-group-v2.svg" alt="" width={18} height={18} />
    ),
    feature: "can_view_my_classes",
  },
  {
    label: "Attendance",
    href: "/staff/dashboard/attendance",
    icon: <Image src="/icons/check-circle.svg" alt="" width={18} height={18} />,
    feature: "can_mark_student_attendance",
  },
  {
    label: "Grades",
    href: "/staff/dashboard/grades",
    icon: <Image src="/icons/pen-paper.svg" alt="" width={18} height={18} />,
    feature: "can_enter_grades",
  },
  {
    label: "Exam Questions",
    href: "/staff/dashboard/exams",
    icon: <Image src="/icons/drafts.svg" alt="" width={18} height={18} />,
    feature: "can_submit_exam_papers",
  },
  {
    label: "Fee Management",
    href: "/staff/dashboard/fees",
    icon: <Image src="/icons/finance.svg" alt="" width={18} height={18} />,
    feature: "can_manage_fees",
  },
  {
    label: "Invoices",
    href: "/staff/dashboard/invoices",
    icon: <Image src="/icons/receipt.svg" alt="" width={18} height={18} />,
    feature: "can_view_invoices",
  },
  {
    label: "Admissions",
    href: "/staff/dashboard/admissions",
    icon: <Image src="/icons/folder.svg" alt="" width={18} height={18} />,
    feature: "can_manage_admissions",
  },
  {
    label: "Students",
    href: "/staff/dashboard/students",
    icon: <Image src="/icons/user-v1.svg" alt="" width={18} height={18} />,
    feature: "can_view_student_records",
  },
  {
    label: "School Overview",
    href: "/staff/dashboard/overview",
    icon: <Image src="/icons/barchart.svg" alt="" width={18} height={18} />,
    feature: "can_view_school_overview",
  },
  {
    label: "Staff Attendance",
    href: "/staff/dashboard/staff-attendance",
    icon: <Image src="/icons/calendar.svg" alt="" width={18} height={18} />,
    feature: "can_view_staff_attendance_board",
  },
  {
    label: "School Store",
    href: "/staff/dashboard/store",
    icon: <ShoppingBag size={18} />,
    feature: "can_view_store",
  },
  {
    label: "Permission Templates",
    href: "/staff/dashboard/templates",
    icon: <Image src="/icons/user-shield.svg" alt="" width={18} height={18} />,
    feature: "can_manage_permissions",
  },
  {
    label: "Staff Permissions",
    href: "/staff/dashboard/permissions",
    icon: <Image src="/icons/user-shield.svg" alt="" width={18} height={18} />,
    feature: "can_manage_permissions",
  },
  {
    label: "My Schools",
    href: "/staff/dashboard/schools",
    icon: <Image src="/icons/user-group.svg" alt="" width={18} height={18} />,
  },
];

// ─── Logo badge (icon only) ─────────────────────────────────────────────────────

const LogoBadge = () => (
  <svg width={28} height={28} viewBox="0 0 28 28" fill="none">
    <rect width={28} height={28} rx={6} fill="#1ca95c" />
    <text
      x="50%"
      y="54%"
      dominantBaseline="middle"
      textAnchor="middle"
      fill="white"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontWeight="700"
      fontSize={10}
      letterSpacing="-0.5"
    >
      1SP
    </text>
  </svg>
);

// ─── Component ─────────────────────────────────────────────────────────────────

export default function StaffSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { features, profile, loading } = useStaffFeatures();

  const [collapsed, setCollapsed] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("staff-sidebar-collapsed") === "true"
  );

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem("staff-sidebar-collapsed", String(next));
      return next;
    });
  };

  const fullName = profile
    ? `${profile.staff.firstName} ${profile.staff.lastName}`
    : (user?.name ?? "Staff");

  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

  const roleLabel = profile ? ROLE_LABELS[profile.staff.role] : "Staff";

  const isActive = (href: string) =>
    href === "/staff/dashboard" ? pathname === href : pathname.startsWith(href);

  const itemCls = (href: string) =>
    `flex h-[42px] w-full items-center rounded-[6px] text-[13.5px] font-normal text-white transition-colors ${
      collapsed ? "justify-center px-0" : "gap-[10px] px-[10px]"
    } ${isActive(href) ? "bg-[#1ca95c]" : "hover:bg-white/10"}`;

  const visibleNav = loading
    ? NAV_ITEMS.filter((item) => !item.feature)
    : NAV_ITEMS.filter((item) => !item.feature || features[item.feature]);

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col overflow-hidden bg-[#00512d] transition-[width] duration-200 ${
        collapsed ? "w-[64px]" : "w-[243px]"
      }`}
    >
      {/* Logo + toggle */}
      <div
        className={`flex items-center ${
          collapsed
            ? "flex-col gap-[8px] px-[12px] pt-[20px] pb-[14px]"
            : "justify-between px-[20px] pt-[28px] pb-[24px]"
        }`}
      >
        <Link href="/staff/dashboard">
          {collapsed ? <LogoBadge /> : <Logo size={28} textColor="white" />}
        </Link>
        <button
          onClick={toggleCollapsed}
          className="flex h-[24px] w-[24px] items-center justify-center rounded-[6px] text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      <nav className="flex flex-col gap-px overflow-y-auto px-[12px]">
        {visibleNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={itemCls(item.href)}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-white/15">
              {item.icon}
            </span>
            {!collapsed && item.label}
          </Link>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="border-t border-white/10 px-[12px] py-[16px]">
        {collapsed ? (
          <div className="flex flex-col items-center gap-[8px]">
            <Link
              href="/staff/dashboard/profile"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-[6px] transition-colors hover:bg-white/10"
              title="My Profile"
            >
              <span className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] bg-white/15">
                <Image src="/icons/user-v1.svg" alt="" width={18} height={18} />
              </span>
            </Link>
            <Link
              href="/staff/dashboard/settings"
              className="flex h-[42px] w-[42px] items-center justify-center rounded-[6px] transition-colors hover:bg-white/10"
              title="Settings"
            >
              <span className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] bg-white/15">
                <Image src="/icons/chip.svg" alt="" width={18} height={18} />
              </span>
            </Link>
            <button
              onClick={() => router.push("/staff/login")}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#1ca95c] text-[13px] font-medium text-white"
              title={`${fullName} — Log out`}
            >
              {initials}
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/staff/dashboard/profile"
              className={itemCls("/staff/dashboard/profile")}
            >
              <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-white/15">
                <Image src="/icons/user-v1.svg" alt="" width={18} height={18} />
              </span>
              My Profile
            </Link>
            <Link
              href="/staff/dashboard/settings"
              className={itemCls("/staff/dashboard/settings")}
            >
              <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-white/15">
                <Image src="/icons/chip.svg" alt="" width={18} height={18} />
              </span>
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
                <p className="text-[11px] text-white/60">{roleLabel}</p>
              </div>
              <button
                onClick={() => router.push("/staff/login")}
                className="shrink-0 text-white/60 transition-colors hover:text-white"
                aria-label="Log out"
              >
                <LogOut className="h-[16px] w-[16px]" />
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
