"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle2, XCircle } from "lucide-react";
import { getGradeRecord } from "@/src/lib/api/gradeEntry";
import type { GradeRecord } from "@/src/types/scoreEntry";
import type { GradeTerm, AssessmentType } from "@/src/types/scoreEntry";
import { ASSESSMENT_LABELS } from "@/src/types/scoreEntry";

interface Props {
  armId: string;
  armName: string;
  subject: string;
  term: GradeTerm;
  assessmentType: AssessmentType;
  onClose: () => void;
}

export default function StudentScoresModal({
  armId,
  armName,
  subject,
  term,
  assessmentType,
  onClose,
}: Props) {
  const [record, setRecord] = useState<GradeRecord | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getGradeRecord(armId, subject, term, assessmentType).then((r) => {
      setRecord(r);
      setLoaded(true);
    });
  }, [armId, subject, term, assessmentType]);

  const passThreshold = record ? record.maxScore * 0.4 : 0;
  const scored = record?.entries.filter((e) => e.score !== null) ?? [];
  const avg =
    scored.length > 0
      ? Math.round(
          scored.reduce((s, e) => s + (e.score ?? 0), 0) / scored.length
        )
      : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex max-h-[85vh] w-full max-w-[540px] flex-col overflow-hidden rounded-[16px] bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#f3f4f6] px-6 py-5">
          <div>
            <p className="text-[16px] font-semibold text-text-heading">
              {subject}
            </p>
            <p className="mt-0.5 text-[12px] text-text-body">
              {armName} · {ASSESSMENT_LABELS[assessmentType]}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9ca3af] hover:text-text-heading"
          >
            <X className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {!loaded ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-[28px] w-[28px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
            </div>
          ) : !record ? (
            <p className="px-6 py-8 text-center text-[13px] text-text-body">
              Record not found.
            </p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#f3f4f6] bg-[#f9fafb]">
                  <th className="py-2.5 pl-6 pr-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    #
                  </th>
                  <th className="py-2.5 pr-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Student
                  </th>
                  <th className="py-2.5 pr-3 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Adm. No
                  </th>
                  <th className="py-2.5 pr-6 text-center text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
                    Score / {record.maxScore}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f9fafb]">
                {record.entries.map((entry, idx) => {
                  const score = entry.score;
                  const passed = score !== null && score >= passThreshold;
                  return (
                    <tr key={entry.studentId} className="hover:bg-[#fafafa]">
                      <td className="py-3 pl-6 pr-3 text-[13px] text-[#9ca3af]">
                        {idx + 1}
                      </td>
                      <td className="py-3 pr-3 text-[13px] font-medium text-text-heading">
                        {entry.studentName}
                      </td>
                      <td className="py-3 pr-3 text-[12px] text-text-body">
                        {entry.admissionNumber}
                      </td>
                      <td className="py-3 pr-6 text-center">
                        {score === null ? (
                          <span className="text-[12px] text-[#d1d5db]">—</span>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <span
                              className={`text-[14px] font-semibold ${passed ? "text-[#16a34a]" : "text-[#dc2626]"}`}
                            >
                              {score}
                            </span>
                            {passed ? (
                              <CheckCircle2 className="h-[13px] w-[13px] text-[#16a34a]" />
                            ) : (
                              <XCircle className="h-[13px] w-[13px] text-[#dc2626]" />
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer summary */}
        {record && (
          <div className="flex items-center justify-between border-t border-[#f3f4f6] px-6 py-4">
            <span className="text-[12px] text-text-body">
              {scored.length} of {record.entries.length} scored
            </span>
            <div className="flex items-center gap-4 text-[12px]">
              <span className="text-text-body">
                Avg:{" "}
                <span className="font-semibold text-text-heading">
                  {avg}/{record.maxScore}
                </span>
              </span>
              <span className="text-text-body">
                Pass:{" "}
                <span className="font-semibold text-[#16a34a]">
                  {scored.filter((e) => (e.score ?? 0) >= passThreshold).length}
                </span>
                {" / "}
                <span className="font-semibold text-[#dc2626]">
                  {scored.filter((e) => (e.score ?? 0) < passThreshold).length}{" "}
                  fail
                </span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
