"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ArmSection from "./ArmSection";
import type { ClassGroup } from "./grades.utils";
import type { GradeTerm } from "@/src/types/scoreEntry";

interface Props {
  cls: ClassGroup;
  term: GradeTerm;
  onPublish: (recordId: string) => void;
  onPublishArm: (armId: string) => void;
  publishingId: string | null;
  publishingArm: string | null;
}

export default function ClassSection({
  cls,
  term,
  onPublish,
  onPublishArm,
  publishingId,
  publishingArm,
}: Props) {
  const [open, setOpen] = useState(true);

  const totalArms = cls.arms.length;
  const totalSubmitted = cls.arms.reduce((s, a) => s + a.totalSubmitted, 0);

  return (
    <div className="overflow-hidden rounded-[14px] border border-[#e5e7eb] bg-white">
      {/* Class header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-[#fafafa] transition-colors"
      >
        <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#e8f5ee]">
          <span className="text-[12px] font-bold text-brand-green">
            {cls.className.slice(0, 2).toUpperCase()}
          </span>
        </div>

        <div className="flex-1">
          <p className="text-[15px] font-semibold text-text-heading">
            {cls.className}
          </p>
          <p className="text-[12px] text-text-body">
            {totalArms} arm{totalArms !== 1 ? "s" : ""} · {totalSubmitted}{" "}
            record{totalSubmitted !== 1 ? "s" : ""} submitted
            {cls.pendingCount > 0 && (
              <span className="ml-2 font-medium text-[#b45309]">
                · {cls.pendingCount} pending
              </span>
            )}
          </p>
        </div>

        <div className="shrink-0 text-[#9ca3af]">
          {open ? (
            <ChevronUp className="h-[16px] w-[16px]" />
          ) : (
            <ChevronDown className="h-[16px] w-[16px]" />
          )}
        </div>
      </button>

      {/* Arms */}
      {open && (
        <div className="border-t border-[#f3f4f6]">
          {cls.arms.map((arm) => (
            <ArmSection
              key={arm.armId}
              arm={arm}
              term={term}
              onPublish={onPublish}
              onPublishArm={onPublishArm}
              publishingId={publishingId}
              publishingArm={publishingArm}
            />
          ))}
        </div>
      )}
    </div>
  );
}
