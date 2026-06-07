"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNotifications } from "@/src/lib/api/notifications";

export default function NotificationButton() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    getNotifications().then((res) => setUnread(res.unread));
  }, []);

  return (
    <Link
      href="/parent/dashboard/notifications"
      className="relative"
      aria-label="Notifications"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M10.268 21a2 2 0 0 0 3.464 0" />
        <path d="m15 8 2 2 4-4" />
        <path d="M16.8607 4.4824A6 6 0 0 0 6 8C6 12.499 4.589 13.956 3.262 15.326" />
        <path d="M3.262 15.326A1 1 0 0 0 4 17H20A1 1 0 0 0 20.74 15.327C20.209 14.779 19.665 14.218 19.203 13.454" />
      </svg>
      {unread > 0 && (
        <span className="absolute -right-[5px] -top-[5px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#e8413e] text-[10px] font-medium leading-none text-white">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
