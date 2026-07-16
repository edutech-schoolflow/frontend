"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import WorkspaceSwitcher from "@/src/components/shared/WorkspaceSwitcher";
import { useIdentity } from "@/src/lib/api/useIdentity";

/**
 * Parent workspace chrome (FE-001, Stage 3). A parent context is scoped to ONE school, so this
 * sidebar is deliberately lean: the switcher up top (to hop to another workspace or back to the
 * family home), an Overview of the parent's standing at THIS school, and a shortcut back to the
 * identity-level family home. Per-child modules (report card, fees…) are reached through the child
 * cards on the Overview, so there are no ambiguous top-level links when a parent has two children here.
 */
export default function ParentWorkspaceSidebar({
  basePath,
}: {
  basePath: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useIdentity();

  const [collapsed, setCollapsed] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("parent-workspace-collapsed") === "true"
  );

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem("parent-workspace-collapsed", String(next));
      return next;
    });
  };

  const fullName = user?.fullName ?? "";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

  const nav = [
    {
      label: "Overview",
      href: basePath,
      icon: <Home size={18} />,
      exact: true,
    },
  ];

  const itemCls = (active: boolean) =>
    `flex h-[42px] w-full items-center rounded-[6px] text-[13.5px] font-normal text-white transition-colors ${
      collapsed ? "justify-center px-0" : "gap-[10px] px-[12px]"
    } ${active ? "bg-[#1ca95c]" : "hover:bg-white/10"}`;

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col overflow-hidden bg-[#00512d] transition-[width] duration-200 ${
        collapsed ? "w-[64px]" : "w-[256px]"
      }`}
    >
      {/* Workspace switcher + collapse toggle */}
      <div
        className={`flex items-center ${
          collapsed
            ? "flex-col gap-[8px] px-[10px] pt-[16px] pb-[12px]"
            : "gap-[6px] px-[12px] pt-[16px] pb-[14px]"
        }`}
      >
        <div className={collapsed ? "" : "min-w-0 flex-1"}>
          <WorkspaceSwitcher collapsed={collapsed} />
        </div>
        <button
          onClick={toggleCollapsed}
          className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-[6px] text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-[2px] overflow-y-auto px-[12px] pb-[8px]">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={itemCls(active)}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-white/15">
                {item.icon}
              </span>
              {!collapsed && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: back to family home + user */}
      <div className="border-t border-white/10 px-[12px] py-[16px]">
        <Link
          href="/family"
          className={itemCls(false)}
          title={collapsed ? "My family home" : undefined}
        >
          <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-white/15">
            <ArrowLeft size={16} />
          </span>
          {!collapsed && "My family home"}
        </Link>

        {!collapsed && (
          <div className="mt-[12px] flex items-center gap-[10px] px-[4px]">
            <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#1ca95c] text-[12px] font-semibold text-white">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium text-white">
                {fullName}
              </p>
              <p className="text-[11px] text-white/50">Parent</p>
            </div>
            <button
              onClick={() => router.push("/login")}
              className="shrink-0 text-white/50 transition-colors hover:text-white"
              aria-label="Log out"
            >
              <LogOut className="h-[15px] w-[15px]" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
