"use client";

import { useEffect, useState } from "react";
import { getChildCaScoresByChild } from "@/src/lib/api/grades";
import type { Grade } from "@/src/types/reportCard";
import Spinner from "./Spinner";

function gradeColor(g?: string) {
  if (!g) return "text-[#888]";
  if (["A", "A+"].includes(g)) return "text-[#1ca95c] font-semibold";
  if (g.startsWith("B")) return "text-[#3b82f6] font-semibold";
  if (g.startsWith("C")) return "text-[#f59e0b] font-semibold";
  return "text-[#e53e3e] font-semibold";
}

export default function ResultsTab({ studentId }: { studentId: string }) {
  const [allScores, setAllScores] = useState<
    Record<string, Grade[]> | undefined
  >(undefined);
  const [selectedTerm, setSelectedTerm] = useState("");

  useEffect(() => {
    getChildCaScoresByChild(studentId).then((scores) => {
      setAllScores(scores);
      const terms = Object.keys(scores);
      if (terms.length > 0) setSelectedTerm(terms[terms.length - 1]);
    });
  }, [studentId]);

  if (allScores === undefined) return <Spinner />;

  const terms = Object.keys(allScores);
  if (terms.length === 0)
    return (
      <p className="py-[48px] text-center text-[14px] text-[#888]">
        No results available yet.
      </p>
    );

  const grades = allScores[selectedTerm] ?? [];

  return (
    <div className="flex flex-col gap-[20px]">
      <div className="flex items-center gap-[12px]">
        <span className="text-[13px] text-[#666]">Term:</span>
        <select
          value={selectedTerm}
          onChange={(e) => setSelectedTerm(e.target.value)}
          className="rounded-[8px] border border-[#ccc] bg-white px-[12px] py-[7px] text-[13px] text-[#1b1b1b] outline-none"
        >
          {terms.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-[10px] border border-[#e0e0e0]">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="bg-[#f9f9f9]">
              <th className="px-[16px] py-[12px] font-medium text-[#888]">
                Subject
              </th>
              <th className="px-[16px] py-[12px] text-center font-medium text-[#888]">
                CA 1
              </th>
              <th className="px-[16px] py-[12px] text-center font-medium text-[#888]">
                CA 2
              </th>
              <th className="px-[16px] py-[12px] text-center font-medium text-[#888]">
                Total
              </th>
              <th className="px-[16px] py-[12px] text-center font-medium text-[#888]">
                Grade
              </th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.subjectId} className="border-t border-[#f0f0f0]">
                <td className="px-[16px] py-[12px] text-[#1b1b1b]">
                  {g.subjectName}
                </td>
                <td className="px-[16px] py-[12px] text-center text-[#555]">
                  {g.ca1 ?? "—"}
                </td>
                <td className="px-[16px] py-[12px] text-center text-[#555]">
                  {g.ca2 ?? "—"}
                </td>
                <td className="px-[16px] py-[12px] text-center font-medium text-[#1b1b1b]">
                  {(g.ca1 ?? 0) + (g.ca2 ?? 0)}
                </td>
                <td
                  className={`px-[16px] py-[12px] text-center ${gradeColor(g.grade)}`}
                >
                  {g.grade ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
