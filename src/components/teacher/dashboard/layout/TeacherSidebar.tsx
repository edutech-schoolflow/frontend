"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Logo from "@/src/components/ui/Logo";
import { useAuth } from "@/src/context/AuthContext";
import { useStaffFeatures } from "@/src/context/StaffFeaturesContext";
import { ROLE_LABELS } from "@/src/types/staff";
import type { StaffFeatures } from "@/src/types/staffFeatures";

// ─── Nav definition ────────────────────────────────────────────────────────────

const NAV_ITEMS: Array<{
  label: string;
  href: string;
  feature?: keyof StaffFeatures;
}> = [
  { label: "Home", href: "/staff/dashboard" },
  {
    label: "My Classes",
    href: "/staff/dashboard/classes",
    feature: "can_view_my_classes",
  },
  {
    label: "Attendance",
    href: "/staff/dashboard/attendance",
    feature: "can_mark_student_attendance",
  },
  {
    label: "Grades",
    href: "/staff/dashboard/grades",
    feature: "can_enter_grades",
  },
  {
    label: "Exam Questions",
    href: "/staff/dashboard/exams",
    feature: "can_submit_exam_papers",
  },
  {
    label: "Fee Management",
    href: "/staff/dashboard/fees",
    feature: "can_manage_fees",
  },
  {
    label: "Invoices",
    href: "/staff/dashboard/invoices",
    feature: "can_view_invoices",
  },
  {
    label: "Admissions",
    href: "/staff/dashboard/admissions",
    feature: "can_manage_admissions",
  },
  {
    label: "Students",
    href: "/staff/dashboard/students",
    feature: "can_view_student_records",
  },
  {
    label: "School Overview",
    href: "/staff/dashboard/overview",
    feature: "can_view_school_overview",
  },
  {
    label: "Staff Attendance",
    href: "/staff/dashboard/staff-attendance",
    feature: "can_view_staff_attendance_board",
  },
  {
    label: "School Store",
    href: "/staff/dashboard/store",
    feature: "can_view_store",
  },
  {
    label: "Permission Templates",
    href: "/staff/dashboard/templates",
    feature: "can_manage_permissions",
  },
  {
    label: "Staff Permissions",
    href: "/staff/dashboard/permissions",
    feature: "can_manage_permissions",
  },
  { label: "My Schools", href: "/staff/dashboard/schools" },
  { label: "Compliance", href: "/staff/dashboard/compliance" },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export default function StaffSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { features, profile, loading } = useStaffFeatures();

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
    `flex h-[45px] w-full items-center rounded-[5px] px-[18px] text-[14px] font-normal text-white transition-colors ${
      isActive(href) ? "bg-[#1ca95c]" : "hover:bg-white/10"
    }`;

  const visibleNav = loading
    ? NAV_ITEMS.filter((item) => !item.feature)
    : NAV_ITEMS.filter((item) => !item.feature || features[item.feature]);

  return (
    <aside className="flex h-screen w-[243px] shrink-0 flex-col bg-[#00512d]">
      <Link href="/staff/dashboard" className="px-[29px] pt-[59px] pb-[46px]">
        <Logo size={30} textColor="white" />
      </Link>

      <nav className="flex flex-col gap-px px-[29px]">
        {visibleNav.map((item) => (
          <Link key={item.href} href={item.href} className={itemCls(item.href)}>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="flex-1" />

      <div className="px-[29px] pb-[32px]">
        <Link
          href="/staff/dashboard/profile"
          className={itemCls("/staff/dashboard/profile")}
        >
          My Profile
        </Link>
        <Link
          href="/staff/dashboard/settings"
          className={itemCls("/staff/dashboard/settings")}
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
      </div>
    </aside>
  );
}
