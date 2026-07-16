"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import WorkspaceSwitcher from "@/src/components/shared/WorkspaceSwitcher";
import { schoolRoutes } from "@/src/layout/school/sidebar/routes";
import { useIdentity } from "@/src/lib/api/useIdentity";
import { useWorkspace } from "@/src/context/WorkspaceContext";

const SettingsIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

// basePath lets the same sidebar serve the legacy /school/dashboard tree and the workspace
// /o/{slug} tree — the route config is relative, so only the prefix differs.
export default function SchoolSidebar({
  basePath = "/school/dashboard",
}: {
  basePath?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: user } = useIdentity();
  const inSettings = pathname.includes("/settings");

  const BASE = basePath;
  const SETTINGS_ITEMS = [
    { label: "Permission Templates", link: `${BASE}/settings/templates` },
    { label: "Staff Permissions", link: `${BASE}/settings/permissions` },
    { label: "Onboarding", link: `${BASE}/settings/onboarding` },
  ];

  const [collapsed, setCollapsed] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem("school-sidebar-collapsed") === "true"
  );

  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem("school-sidebar-collapsed", String(next));
      return next;
    });
  };

  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const set = new Set<string>();
    schoolRoutes.forEach((r) => {
      if (r.children?.some((c) => pathname.startsWith(`${BASE}/${c.link}`))) {
        set.add(r.label);
      }
    });
    return set;
  });

  const [settingsOpen, setSettingsOpen] = useState(inSettings);

  const toggle = (label: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });

  const fullName = user?.fullName ?? "";
  // Owner or the staff member's actual role — the workspace context knows; never hardcoded.
  const ws = useWorkspace();
  const roleLabel =
    ws.myContext.type === "owner"
      ? "Owner"
      : (ws.myContext.role ?? "Staff")
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c: string) => c.toUpperCase());
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");

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
      <nav className="flex flex-1 flex-col overflow-y-auto px-[12px] pb-[8px]">
        {schoolRoutes.map((route, idx) => {
          const prevRoute = schoolRoutes[idx - 1];
          const showSection =
            !collapsed && route.section && route.section !== prevRoute?.section;

          const header = showSection ? (
            <p
              key={`section-${route.section}`}
              className="mt-[14px] mb-[4px] px-[12px] text-[10px] font-semibold uppercase tracking-widest text-white/40"
            >
              {route.section}
            </p>
          ) : null;

          if (route.children) {
            const isOpen = !collapsed && expanded.has(route.label);

            return (
              <div key={route.label}>
                {header}
                <button
                  type="button"
                  onClick={() =>
                    collapsed ? toggleCollapsed() : toggle(route.label)
                  }
                  className={itemCls(false)}
                  title={collapsed ? route.label : undefined}
                >
                  <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-white/15">
                    {route.icon}
                  </span>
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{route.label}</span>
                      <ChevronDown
                        className={`h-[13px] w-[13px] opacity-50 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </>
                  )}
                </button>

                {isOpen && (
                  <div className="ml-[34px] mt-[2px] mb-[2px] flex flex-col gap-[1px]">
                    {route.children.map((child) => {
                      const childPath = `${BASE}/${child.link}`;
                      const isActive = pathname.startsWith(childPath);
                      return (
                        <Link
                          key={child.link}
                          href={childPath}
                          className={`flex h-[34px] items-center rounded-[5px] px-[10px] text-[12.5px] transition-colors ${
                            isActive
                              ? "bg-[#1ca95c] text-white"
                              : "text-white/60 hover:bg-white/10 hover:text-white"
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
            <div key={route.label}>
              {header}
              <Link
                href={href}
                className={itemCls(isActive)}
                title={collapsed ? route.label : undefined}
              >
                <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-white/15">
                  {route.icon}
                </span>
                {!collapsed && route.label}
              </Link>
            </div>
          );
        })}
      </nav>

      {/* Bottom: settings + user */}
      <div className="border-t border-white/10 px-[12px] py-[16px]">
        {collapsed ? (
          <div className="flex flex-col items-center gap-[8px]">
            <button
              type="button"
              onClick={toggleCollapsed}
              className="flex h-[42px] w-[42px] items-center justify-center rounded-[6px] transition-colors hover:bg-white/10"
              title="Settings"
            >
              <span className="flex h-[28px] w-[28px] items-center justify-center rounded-[6px] bg-white/15 text-white/60">
                <SettingsIcon />
              </span>
            </button>
            <button
              onClick={() => router.push("/school/login")}
              className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#1ca95c] text-[12px] font-semibold text-white"
              title={`${fullName} — Log out`}
            >
              {initials}
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setSettingsOpen((v) => !v)}
              className={itemCls(false)}
            >
              <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-[6px] bg-white/15">
                <SettingsIcon />
              </span>
              <span className="flex-1 text-left">Settings</span>
              <ChevronDown
                className={`h-[13px] w-[13px] opacity-50 transition-transform ${settingsOpen ? "rotate-180" : ""}`}
              />
            </button>

            {settingsOpen && (
              <div className="ml-[34px] mt-[2px] mb-[2px] flex flex-col gap-[1px]">
                {SETTINGS_ITEMS.map((item) => {
                  const isActive = pathname.startsWith(item.link);
                  return (
                    <Link
                      key={item.link}
                      href={item.link}
                      className={`flex h-[34px] items-center rounded-[5px] px-[10px] text-[12.5px] transition-colors ${
                        isActive
                          ? "bg-[#1ca95c] text-white"
                          : "text-white/60 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="mt-[12px] flex items-center gap-[10px] px-[4px]">
              <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-[#1ca95c] text-[12px] font-semibold text-white">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium text-white">
                  {fullName}
                </p>
                <p className="text-[11px] text-white/50">{roleLabel}</p>
              </div>
              <button
                onClick={() => router.push("/login")}
                className="shrink-0 text-white/50 transition-colors hover:text-white"
                aria-label="Log out"
              >
                <LogOut className="h-[15px] w-[15px]" />
              </button>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
