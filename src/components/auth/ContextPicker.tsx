"use client";

import {
  Loader2,
  School,
  Users,
  GraduationCap,
  ArrowRight,
} from "lucide-react";
import type { AuthContext } from "@/src/lib/api/identityAuth";

function contextIcon(type: AuthContext["type"]) {
  switch (type) {
    case "owner":
      return <School className="h-[20px] w-[20px] text-brand-green" />;
    case "staff":
      return <Users className="h-[20px] w-[20px] text-brand-green" />;
    case "parent":
      return <GraduationCap className="h-[20px] w-[20px] text-brand-green" />;
  }
}

function contextLabel(c: AuthContext): { title: string; subtitle: string } {
  switch (c.type) {
    case "owner":
      return {
        title: c.organizationName ?? "Your school",
        subtitle: "School owner",
      };
    case "staff":
      return {
        title: c.organizationName ?? "School",
        subtitle: c.role ? `Staff · ${c.role.replace(/_/g, " ")}` : "Staff",
      };
    case "parent":
      return {
        title: "Parent portal",
        subtitle: "Your children, fees and results",
      };
  }
}

/** The workspace chooser (FE-001): one identity, many organizations — pick where to continue. */
export default function ContextPicker({
  contexts,
  enteringId,
  onSelect,
}: {
  contexts: AuthContext[];
  enteringId: string | null;
  onSelect: (contextId: string) => void;
}) {
  return (
    <div className="flex flex-col gap-[12px]">
      {contexts.map((c) => {
        const { title, subtitle } = contextLabel(c);
        const entering = enteringId === c.id;
        return (
          <button
            key={c.id}
            type="button"
            disabled={enteringId !== null}
            onClick={() => onSelect(c.id)}
            className="flex items-center gap-[14px] rounded-[10px] border border-[#e0e0e0] px-[20px] py-[16px] text-left transition-colors hover:border-brand-green hover:bg-[#f7fdf9] disabled:opacity-60"
          >
            <span className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#e8f5ee]">
              {contextIcon(c.type)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-medium text-[#1b1b1b]">
                {title}
              </span>
              <span className="block text-[13px] text-[#888]">{subtitle}</span>
            </span>
            {entering ? (
              <Loader2 className="h-[18px] w-[18px] shrink-0 animate-spin text-brand-green" />
            ) : (
              <ArrowRight className="h-[18px] w-[18px] shrink-0 text-[#ccc]" />
            )}
          </button>
        );
      })}
    </div>
  );
}
