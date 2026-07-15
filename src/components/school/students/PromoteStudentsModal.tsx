"use client";

import { useMemo, useState } from "react";
import { X, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import {
  useStudents,
  usePromoteStudents,
} from "@/src/lib/api/useSchoolStudents";
import { useAcademicYears } from "@/src/lib/api/useTerms";
import type { SchoolClass } from "@/src/types/school";
import type {
  PromotionAction,
  PromotionItemInput,
} from "@/src/lib/api/schoolStudents";

type Props = { classes: SchoolClass[]; onClose: () => void };

const ACTIONS: { value: PromotionAction; label: string }[] = [
  { value: "promote", label: "Promote" },
  { value: "repeat", label: "Repeat" },
  { value: "graduate", label: "Graduate" },
];

const SELECT =
  "h-[38px] w-full rounded-[8px] border border-[#e5e7eb] bg-white px-3 text-[13px] text-dark-blue outline-none focus:border-brand-green";

export default function PromoteStudentsModal({ classes, onClose }: Props) {
  const { data: years = [] } = useAcademicYears();
  const { data: studentsData } = useStudents();
  const promote = usePromoteStudents();

  const [targetYearId, setTargetYearId] = useState("");
  const [sourceClassId, setSourceClassId] = useState("");
  const [targetClassId, setTargetClassId] = useState("");
  // Per-student action override; default "promote".
  const [actions, setActions] = useState<Record<string, PromotionAction>>({});

  const roster = useMemo(
    () => (studentsData?.data ?? []).filter((s) => s.classId === sourceClassId),
    [studentsData, sourceClassId]
  );

  const actionFor = (id: string): PromotionAction => actions[id] ?? "promote";
  const anyPromote = roster.some((s) => actionFor(s.id) === "promote");

  const canSubmit =
    !!targetYearId &&
    !!sourceClassId &&
    roster.length > 0 &&
    (!anyPromote || !!targetClassId) &&
    !promote.isPending;

  async function handleSubmit() {
    const promotions: PromotionItemInput[] = roster.map((s) => {
      const action = actionFor(s.id);
      return {
        studentId: s.id,
        action,
        targetClassId:
          action === "promote"
            ? targetClassId
            : action === "repeat"
              ? sourceClassId
              : null,
      };
    });

    try {
      const r = await promote.mutateAsync({
        targetAcademicYearId: targetYearId,
        promotions,
      });
      toast.success(
        `Promoted ${r.promoted}, repeated ${r.repeated}, graduated ${r.graduated}.`
      );
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not promote students."
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex max-h-[88vh] w-full max-w-[560px] flex-col rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-default px-6 py-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-[18px] w-[18px] text-brand-green" />
            <div>
              <h2 className="text-[16px] font-semibold text-dark-blue">
                Promote students
              </h2>
              <p className="text-[12px] text-grey-text">
                Advance a class into the next session. Repeat or graduate
                individuals as needed.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-grey-text hover:text-dark-blue"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-3 gap-3 border-b border-border-default px-6 py-4">
          <div>
            <label className="mb-1 block text-[12px] font-medium text-dark-blue">
              Into session <span className="text-[#e84040]">*</span>
            </label>
            <select
              className={SELECT}
              value={targetYearId}
              onChange={(e) => setTargetYearId(e.target.value)}
            >
              <option value="">
                {years.length === 0 ? "No sessions" : "Select session"}
              </option>
              {years.map((y) => (
                <option key={y.id} value={y.id}>
                  {y.name}
                  {y.isCurrent ? " (current)" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-dark-blue">
              From class <span className="text-[#e84040]">*</span>
            </label>
            <select
              className={SELECT}
              value={sourceClassId}
              onChange={(e) => {
                setSourceClassId(e.target.value);
                setActions({});
              }}
            >
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-dark-blue">
              Promote to
            </label>
            <select
              className={SELECT}
              value={targetClassId}
              onChange={(e) => setTargetClassId(e.target.value)}
            >
              <option value="">Select class</option>
              {classes
                .filter((c) => c.id !== sourceClassId)
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Roster */}
        <div className="min-h-[120px] flex-1 overflow-y-auto px-6 py-3">
          {!sourceClassId ? (
            <p className="py-10 text-center text-[13px] text-grey-text">
              Pick a class to see its students.
            </p>
          ) : roster.length === 0 ? (
            <p className="py-10 text-center text-[13px] text-grey-text">
              No active students in this class.
            </p>
          ) : (
            <div className="divide-y divide-border-default">
              {roster.map((s) => {
                const action = actionFor(s.id);
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <p className="truncate text-[13px] text-dark-blue">
                      {s.firstName} {s.lastName}
                      <span className="ml-2 font-mono text-[11px] text-grey-text">
                        {s.admissionNumber ?? ""}
                      </span>
                    </p>
                    <div className="flex shrink-0 gap-1">
                      {ACTIONS.map((a) => (
                        <button
                          key={a.value}
                          type="button"
                          onClick={() =>
                            setActions((prev) => ({ ...prev, [s.id]: a.value }))
                          }
                          className={`rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition-colors ${
                            action === a.value
                              ? a.value === "graduate"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-brand-green text-white"
                              : "border border-border-default text-grey-text hover:border-brand-green/50"
                          }`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 border-t border-border-default px-6 py-4">
          <p className="text-[12px] text-grey-text">
            {roster.length > 0 &&
              `${roster.length} student${roster.length === 1 ? "" : "s"} in this class`}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border-default px-5 py-2.5 text-[13px] text-dark-blue hover:bg-surface-muted"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="rounded-lg bg-brand-green px-5 py-2.5 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-40"
            >
              {promote.isPending ? "Promoting…" : "Promote class"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
