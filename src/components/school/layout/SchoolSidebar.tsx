"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, LogOut } from "lucide-react";
import Logo from "@/src/components/ui/Logo";
import { useAuth } from "@/src/context/AuthContext";
import { schoolRoutes } from "@/src/layout/school/sidebar/routes";

const BASE = "/school/dashboard";

export default function SchoolSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const set = new Set<string>();
    schoolRoutes.forEach((r) => {
      if (r.children?.some((c) => pathname.startsWith(`${BASE}/${c.link}`))) {
        set.add(r.label);
      }
    });
    return set;
  });

  const toggle = (label: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });

  const fullName = user?.name ?? "School Admin";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

  const itemBase =
    "flex h-[45px] w-full items-center gap-[12px] rounded-[5px] px-[14px] text-[14px] font-normal text-white transition-colors";

  return (
    <aside className="flex h-screen w-[243px] shrink-0 flex-col bg-[#00512d]">
      <Link href="/school/dashboard" className="px-[24px] pt-[59px] pb-[40px]">
        <Logo size={30} textColor="white" />
      </Link>

      <nav className="flex flex-1 flex-col gap-px overflow-y-auto px-[16px]">
        {schoolRoutes.map((route) => {
          if (route.children) {
            const isGroupActive = route.children.some((c) =>
              pathname.startsWith(`${BASE}/${c.link}`)
            );
            const isOpen = expanded.has(route.label);

            return (
              <div key={route.label}>
                <button
                  type="button"
                  onClick={() => toggle(route.label)}
                  className={`${itemBase} ${isGroupActive ? "bg-[#1ca95c]" : "hover:bg-white/10"}`}
                >
                  <span className="shrink-0 [filter:brightness(0)_invert(1)] opacity-70">
                    {route.icon}
                  </span>
                  <span className="flex-1 text-left">{route.label}</span>
                  <ChevronDown
                    className={`h-[14px] w-[14px] opacity-60 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="ml-[38px] mt-[2px] flex flex-col gap-[2px]">
                    {route.children.map((child) => {
                      const childPath = `${BASE}/${child.link}`;
                      const isActive = pathname.startsWith(childPath);
                      return (
                        <Link
                          key={child.link}
                          href={childPath}
                          className={`flex h-[36px] items-center rounded-[5px] px-[10px] text-[13px] transition-colors ${
                            isActive
                              ? "bg-[#1ca95c] text-white"
                              : "text-white/70 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          }

          const href = route.link === "" ? BASE : `${BASE}/${route.link}`;
          const isActive =
            route.link === "" ? pathname === BASE : pathname.startsWith(href);

          return (
            <Link
              key={route.label}
              href={href}
              className={`${itemBase} ${isActive ? "bg-[#1ca95c]" : "hover:bg-white/10"}`}
            >
              <span className="shrink-0 [filter:brightness(0)_invert(1)] opacity-70">
                {route.icon}
              </span>
              {route.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-[16px] pb-[32px] pt-[8px]">
        <Link
          href="/school/dashboard/settings/onboarding"
          className={`${itemBase} ${pathname.includes("/settings") ? "bg-[#1ca95c]" : "hover:bg-white/10"}`}
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
            <p className="text-[11px] text-white/60">School Admin</p>
          </div>
          <button
            onClick={() => router.push("/school/login")}
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
