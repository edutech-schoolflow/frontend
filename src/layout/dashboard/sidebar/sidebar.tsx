"use client";

import { cn } from "@/src/lib/utils";
import { ChevronDown, ChevronUp, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useState } from "react";
import { routes } from "./routes";

const Sidebar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const isActive = (link: string) =>
    pathname === `/${link}` || pathname.startsWith(`/${link}/`);

  const toggleDropdown = (label: string) =>
    setOpenDropdown((prev) => (prev === label ? null : label));
  const activeClass =
    "border-l-2 border-blue-500 bg-white/10 text-white rounded-r-md";

  return (
    <aside className="fixed z-50 left-0 top-0 flex h-screen w-70 min-w-70 flex-col overflow-y-auto bg-dark-blue py-3 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/40 hover:[&::-webkit-scrollbar-thumb]:bg-white/70">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center px-4">
        <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-white">
          <Image
            src="/images/svg/kedco-logo-assets-2.svg"
            alt="Kedco"
            width={45}
            height={45}
            className="object-cover"
          />
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-3">
          {routes.map((route) => (
            <Fragment key={route.label}>
              {route.children ? (
                <>
                  <li>
                    <button
                      onClick={() => toggleDropdown(route.label)}
                      className={cn(
                        "flex w-full items-center justify-between rounded-r-md px-3 py-4 text-sm text-white/80 transition-colors hover:border-l-2 hover:border-blue-500 hover:bg-white/10 hover:text-white",
                        openDropdown === route.label && activeClass
                      )}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="opacity-80">{route.icon}</span>
                        {route.label}
                      </span>
                      {openDropdown === route.label ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>
                  </li>

                  {openDropdown === route.label && (
                    <ul className="ml-3 space-y-0.5 border-l border-white/10 pl-3">
                      {route.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={`/${child.link}`}
                            className={cn(
                              "block rounded-r-md px-2 py-4 text-xs text-white/70 transition-colors hover:border-l-2 hover:border-blue-500 hover:bg-white/10 hover:text-white",
                              isActive(child.link) && activeClass
                            )}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <li>
                  <Link
                    href={`/${route.link}`}
                    className={cn(
                      "flex items-center gap-2.5 rounded-r-md px-3 py-4 text-sm text-white/80 transition-colors hover:border-l-2 hover:border-blue-500 hover:bg-white/10 hover:text-white",
                      route.link === ""
                        ? pathname === "/" && activeClass
                        : route.link !== null &&
                            isActive(route.link) &&
                            activeClass
                    )}
                  >
                    <span className="opacity-80">{route.icon}</span>
                    {route.label}
                  </Link>
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      </nav>

      {/* Settings + User at bottom */}
      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/#"
          className={cn(
            "flex items-center gap-2.5 rounded-r-lg px-3 py-4 text-sm text-white/80 transition-colors hover:border-l-2 hover:border-blue-500 hover:bg-white/10 hover:text-white",
            pathname === "/#" && activeClass
          )}
        >
          <Settings size={16} strokeWidth={1.75} className="opacity-80" />
          Settings
        </Link>

        <div className="mt-3 flex items-center justify-between gap-2 rounded-lg px-3 py-4 bg-white/5 cursor-pointer hover:bg-white/7">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-smtext-xs font-semibold text-white">
              <Image
                src={"/images/png/profile-placeholder.png"}
                alt="users"
                width={100}
                height={100}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">Hello, Admin</p>
              <p className="text-[10px] text-white/60">Super Admin</p>
            </div>
          </div>
          <div>
            {" "}
            <Image
              src={"/icons/down-arrow-fancy.svg"}
              alt="users"
              width={24}
              height={24}
            />
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
