"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { getChildProfiles } from "@/src/lib/api/parents";
import { getChildCaScoresByChild } from "@/src/lib/api/grades";
import type { ChildProfile } from "@/src/types/parent";
import type { Grade } from "@/src/types/reportCard";
import ChildAvatar from "../shared/ChildAvatar";
import CaScoreView from "./CaScoreView";

export default function ParentCaScores() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedChildId = searchParams.get("childId") ?? "";
  const selectedTerm = searchParams.get("term") ?? "";

  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [scoresByChild, setScoresByChild] = useState<
    Record<string, Record<string, Grade[]>>
  >({});

  function navigate(childId: string, term?: string) {
    const p = new URLSearchParams();
    p.set("childId", childId);
    if (term) p.set("term", term);
    router.replace(`${pathname}?${p.toString()}`);
  }

  useEffect(() => {
    getChildProfiles().then((list) => {
      setChildren(list);
      if (!selectedChildId && list.length > 0) navigate(list[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedChildId) return;
    if (scoresByChild[selectedChildId]) {
      if (!selectedTerm) {
        const terms = Object.keys(scoresByChild[selectedChildId]);
        if (terms.length > 0) navigate(selectedChildId, terms[0]);
      }
      return;
    }
    getChildCaScoresByChild(selectedChildId).then((data) => {
      setScoresByChild((prev) => ({ ...prev, [selectedChildId]: data }));
      if (!selectedTerm) {
        const terms = Object.keys(data);
        if (terms.length > 0) navigate(selectedChildId, terms[0]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildId]);

  const termMap = scoresByChild[selectedChildId] ?? {};
  const terms = Object.keys(termMap);
  const grades = termMap[selectedTerm] ?? [];
  const loading = selectedChildId && !scoresByChild[selectedChildId];

  return (
    <div className="px-[88px] py-[31px] pb-[60px]">
      <h1 className="mb-[24px] text-[24px] font-medium text-[#1b1b1b]">
        CA scores
      </h1>

      {children.length > 0 && (
        <div className="mb-[24px] flex gap-[8px]">
          {children.map((child) => (
            <button
              key={child.id}
              type="button"
              onClick={() => navigate(child.id)}
              className={`flex items-center gap-[8px] rounded-full px-[16px] py-[8px] text-[13px] font-medium transition-colors ${
                child.id === selectedChildId
                  ? "bg-[#1ca95c] text-white"
                  : "bg-[#f5f5f5] text-[#555] hover:bg-[#e8f5ee] hover:text-[#1ca95c]"
              }`}
            >
              <ChildAvatar child={child} />
              {child.firstName}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-[80px]">
          <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#1ca95c] border-t-transparent" />
        </div>
      ) : terms.length === 0 ? (
        <div className="flex flex-col items-center gap-[12px] py-[80px] text-center">
          <p className="text-[16px] font-medium text-[#1b1b1b]">
            No CA scores published yet
          </p>
          <p className="text-[14px] text-[#888]">
            Scores will appear here once the school publishes them.
          </p>
        </div>
      ) : (
        <CaScoreView
          grades={grades}
          terms={terms}
          selectedTerm={selectedTerm}
          onTermChange={(t) => navigate(selectedChildId, t)}
        />
      )}
    </div>
  );
}
