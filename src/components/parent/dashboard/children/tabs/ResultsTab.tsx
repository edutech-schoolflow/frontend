"use client";

import { FileText } from "lucide-react";
import { useChildReportCards } from "@/src/lib/api/useParentChildren";
import Spinner from "./Spinner";

export default function ResultsTab({
  childProfileId,
}: {
  childProfileId: string;
}) {
  const { data: cards, isPending, isError, error } =
    useChildReportCards(childProfileId);

  if (isPending) return <Spinner />;
  if (isError)
    return (
      <p className="py-[48px] text-center text-[14px] text-[#e53e3e]">
        {error instanceof Error ? error.message : "Could not load results."}
      </p>
    );
  if (!cards || cards.length === 0)
    return (
      <p className="py-[48px] text-center text-[14px] text-[#888]">
        No published report cards yet. They&apos;ll appear here once the school
        releases them.
      </p>
    );

  return (
    <div className="flex flex-col gap-[12px]">
      {cards.map((card) => (
        <div
          key={card.id}
          className="flex items-center gap-[16px] rounded-[10px] border border-[#e0e0e0] bg-white px-[20px] py-[16px]"
        >
          <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-[10px] bg-[#e8f5ee]">
            <FileText className="h-[20px] w-[20px] text-[#1ca95c]" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium text-[#1b1b1b]">
              {card.term ?? "Report card"}
              {card.academicYear ? ` · ${card.academicYear}` : ""}
            </p>
            <p className="truncate text-[13px] text-[#888]">
              {card.schoolName ?? ""}
              {card.publishedAt
                ? ` · Published ${new Date(card.publishedAt).toLocaleDateString(
                    "en-GB",
                    { day: "numeric", month: "short", year: "numeric" }
                  )}`
                : ""}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-[#e8f8ef] px-[10px] py-[3px] text-[11px] font-medium capitalize text-[#1ca95c]">
            {card.status}
          </span>
        </div>
      ))}
    </div>
  );
}
