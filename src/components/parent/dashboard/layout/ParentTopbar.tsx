"use client";

import { Bell, MessageSquare, ChevronDown } from "lucide-react";

export default function ParentTopbar() {
  return (
    <header className="flex h-[61px] shrink-0 items-center justify-between bg-white px-[30px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.2)]">
      <p className="text-[20px] font-normal text-[#1b1b1b]">Welcome 👋</p>

      <div className="flex items-center gap-[16px]">
        <button className="relative" aria-label="Notifications">
          <Bell className="h-[24px] w-[24px] text-[#1b1b1b]" />
          <span className="absolute -right-[5px] -top-[5px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#e8413e] text-[10px] font-medium text-white leading-none">
            1
          </span>
        </button>

        <button className="relative" aria-label="Messages">
          <MessageSquare className="h-[24px] w-[24px] text-[#1b1b1b]" />
          <span className="absolute -right-[5px] -top-[5px] flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#e8413e] text-[10px] font-medium text-white leading-none">
            2
          </span>
        </button>

        <button className="flex items-center gap-[3px]" aria-label="User menu">
          <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#1ca95c] text-[11px] font-medium text-white">
            JO
          </div>
          <ChevronDown className="h-[15px] w-[15px] text-[#1b1b1b]" />
        </button>
      </div>
    </header>
  );
}
