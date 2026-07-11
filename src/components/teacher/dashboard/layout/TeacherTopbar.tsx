"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  ChevronDown,
  Settings,
  LogOut,
  HelpCircle,
  Bell,
  ArrowLeftRight,
  GraduationCap,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/src/context/AuthContext";
import { useStaffFeatures } from "@/src/context/StaffFeaturesContext";
import { createParentProfile } from "@/src/lib/api/identityAuth";

// basePath mirrors StaffSidebar so the topbar's links resolve within whichever tree it renders in.
export default function StaffTopbar({
  basePath = "/staff/dashboard",
}: {
  basePath?: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [schoolOpen, setSchoolOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const schoolRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { user } = useAuth();
  const { mySchools, activeSchoolId, isPartTime, switchSchool } =
    useStaffFeatures();

  // "Become a Parent" — explicit relationship creation (idempotent), then the global hub (EDD-002).
  async function becomeParent() {
    setMenuOpen(false);
    try {
      await createParentProfile();
      router.push("/parent/dashboard");
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not set up parent access."
      );
    }
  }

  const activeSchool =
    mySchools.find((e) => e.school.id === activeSchoolId)?.school ??
    mySchools[0]?.school;

  const fullName = user?.name ?? "Staff";
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
        setMenuOpen(false);
      }
      if (schoolRef.current && !schoolRef.current.contains(e.target as Node)) {
        setSchoolOpen(false);
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
        {/* School switcher — only visible for part-time staff */}
        {isPartTime && activeSchool && (
          <div ref={schoolRef} className="relative">
            <button
              onClick={() => setSchoolOpen((v) => !v)}
              className="flex items-center gap-[6px] rounded-[8px] border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5 text-[13px] font-medium text-text-heading transition-colors hover:border-[#d1d5db]"
            >
              <Building2 className="h-[14px] w-[14px] shrink-0 text-brand-green" />
              <span className="max-w-[140px] truncate">
                {activeSchool.name}
              </span>
              <ChevronDown
                className={`h-[13px] w-[13px] text-[#9ca3af] transition-transform ${schoolOpen ? "rotate-180" : ""}`}
              />
            </button>

            {schoolOpen && (
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 w-[220px] rounded-[10px] border border-[#e5e7eb] bg-white py-[6px] shadow-lg">
                <p className="px-[14px] py-[6px] text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                  Switch school
                </p>
                {mySchools.map(({ staff, school }) => {
                  const isActive = school.id === activeSchool.id;
                  return (
                    <button
                      key={school.id}
                      onClick={() => {
                        switchSchool(school.id);
                        setSchoolOpen(false);
                      }}
                      className={`flex w-full items-center gap-[10px] px-[14px] py-[9px] text-left text-[13px] transition-colors hover:bg-[#f9fafb] ${
                        isActive
                          ? "text-brand-green font-medium"
                          : "text-text-heading"
                      }`}
                    >
                      <div className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-[#f0fdf4]">
                        <Building2 className="h-[14px] w-[14px] text-brand-green" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate">{school.name}</p>
                        <p className="text-[11px] text-[#9ca3af]">
                          {staff.position}
                        </p>
                      </div>
                      {isActive && (
                        <div className="ml-auto h-[6px] w-[6px] shrink-0 rounded-full bg-brand-green" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <button
          className="relative text-[#888] transition-colors hover:text-[#1b1b1b]"
          aria-label="Notifications"
        >
          <Bell className="h-[20px] w-[20px]" />
        </button>

        {/* User menu */}
        <div ref={menuRef} className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-[3px]"
            aria-label="User menu"
          >
            <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#1ca95c] text-[11px] font-medium text-white">
              {initials}
            </div>
            <ChevronDown
              className={`h-[15px] w-[15px] text-[#1b1b1b] transition-transform ${menuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[200px] rounded-[8px] border border-[#eee] bg-white py-[6px] shadow-lg">
              <p className="px-[16px] py-[8px] text-[12px] text-[#aaa]">
                {fullName}
              </p>
              <div className="my-[4px] h-px bg-[#f0f0f0]" />
              <Link
                href="/select-context"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#1b1b1b] hover:bg-[#f5f5f5]"
              >
                <ArrowLeftRight className="h-[15px] w-[15px] text-[#888]" />
                Switch workspace
              </Link>
              <button
                type="button"
                onClick={() => void becomeParent()}
                className="flex w-full items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#1b1b1b] hover:bg-[#f5f5f5]"
              >
                <GraduationCap className="h-[15px] w-[15px] text-[#888]" />
                Use as a parent
              </button>
              <Link
                href={`${basePath}/settings`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#1b1b1b] hover:bg-[#f5f5f5]"
              >
                <Settings className="h-[15px] w-[15px] text-[#888]" />
                Settings
              </Link>
              <Link
                href={`${basePath}/profile`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-[10px] px-[16px] py-[10px] text-[14px] text-[#1b1b1b] hover:bg-[#f5f5f5]"
              >
                <HelpCircle className="h-[15px] w-[15px] text-[#888]" />
                My Profile
              </Link>
              <div className="my-[4px] h-px bg-[#f0f0f0]" />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push("/staff/login");
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
