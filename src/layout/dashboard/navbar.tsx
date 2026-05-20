"use client";

import { Clock, Calendar } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const formatDate = (date: Date) =>
  date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const getPageTitle = (pathname: string) => {
  if (pathname === "/") return "Dashboard";
  const segment = pathname.split("/")[1];
  return segment
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

const Navbar = () => {
  const pathname = usePathname();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-17.5 items-center justify-between border-b border-border-default bg-white px-6">
      <h1 className="text-base font-semibold text-dark-blue">
        {getPageTitle(pathname)}
      </h1>

      <div className="flex bg-gray-100 p-2 rounded-md items-center gap-4">
        <div className="flex items-center gap-1.5 text-xs text-grey-text">
          <Calendar size={13} />
          <span>
            Date:{" "}
            <span className="font-medium text-dark-blue">
              {formatDate(now)}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-grey-text">
          <Clock size={13} />
          <span>
            Time:{" "}
            <span className="font-medium text-dark-blue">
              {formatTime(now)}
            </span>
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
