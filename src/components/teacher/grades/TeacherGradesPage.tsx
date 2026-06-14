"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Edit2, ChevronDown, BookOpen } from "lucide-react";
import {
  getTeacherGradeArms,
  getGradeRecord,
  submitGradeRecord,
  getSubjectsForLevel,
} from "@/src/lib/api/gradeEntry";
import type { ArmSelectOption } from "@/src/lib/api/attendance";
import { getStudentsForArm } from "@/src/lib/api/attendance";
import { useAuth } from "@/src/context/AuthContext";
import type { AttendanceStudentRow } from "@/src/types/attendance";
import type {
  GradeRecord,
  GradeTerm,
  AssessmentType,
} from "@/src/types/scoreEntry";
import {
  TERM_LABELS,
  ASSESSMENT_LABELS,
  ASSESSMENT_MAX,
} from "@/src/types/scoreEntry";
import type { ClassLevel } from "@/src/types/school";

// ─── Helpers ───────────────────────────────────────────────────────────────────

const LEVEL_ORDER: Record<ClassLevel, number> = {
  nursery: 0,
  primary: 1,
  junior_secondary: 2,
  senior_secondary: 3,
};

const LEVEL_LABELS: Record<ClassLevel, string> = {
  nursery: "Nursery",
  primary: "Primary",
  junior_secondary: "Junior Secondary",
  senior_secondary: "Senior Secondary",
};

const GRADE_THRESHOLDS = [
  { min: 70, grade: "A", color: "#16a34a" },
  { min: 60, grade: "B", color: "#2563eb" },
  { min: 50, grade: "C", color: "#d97706" },
  { min: 40, grade: "D", color: "#ea580c" },
  { min: 0, grade: "F", color: "#dc2626" },
];

function calcGrade(score: number, maxScore: number) {
  const pct = (score / maxScore) * 100;
  return GRADE_THRESHOLDS.find((t) => pct >= t.min) ?? GRADE_THRESHOLDS[4];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Grade badge ───────────────────────────────────────────────────────────────

function GradeBadge({
  score,
  maxScore,
}: {
  score: number | null;
  maxScore: number;
}) {
  if (score === null)
    return <span className="text-[12px] text-[#9ca3af]">—</span>;
  const { grade, color } = calcGrade(score, maxScore);
  return (
    <span
      className="inline-block min-w-[28px] rounded-[5px] px-1.5 py-0.5 text-center text-[12px] font-bold text-white"
      style={{ backgroundColor: color }}
    >
      {grade}
    </span>
  );
}

// ─── Summary bar ───────────────────────────────────────────────────────────────

function SummaryBar({
  scores,
  maxScore,
  totalStudents,
  submitted,
  submitting,
  onSubmit,
  onEdit,
}: {
  scores: Record<string, number | null>;
  maxScore: number;
  totalStudents: number;
  submitted: boolean;
  submitting: boolean;
  onSubmit: () => void;
  onEdit: () => void;
}) {
  const values = Object.values(scores).filter((v): v is number => v !== null);
  const entered = values.length;
  const avg =
    entered > 0 ? Math.round(values.reduce((s, v) => s + v, 0) / entered) : 0;
  const passThreshold = maxScore * 0.4;
  const passCount = values.filter((v) => v >= passThreshold).length;
  const allEntered = entered === totalStudents && totalStudents > 0;

  return (
    <div className="mt-4 flex items-center justify-between rounded-[10px] border border-[#e5e7eb] bg-[#f9fafb] px-5 py-3.5">
      <div className="flex items-center gap-5 text-[13px]">
        <span className="text-text-body">
          <span className="font-medium text-text-heading">{entered}</span>/
          {totalStudents} scored
        </span>
        {entered > 0 && (
          <>
            <span className="text-[#6b7280]">·</span>
            <span className="text-text-body">
              Avg:{" "}
              <span className="font-medium text-text-heading">
                {avg}/{maxScore}
              </span>
            </span>
            <span className="text-[#6b7280]">·</span>
            <span className="font-medium text-[#16a34a]">
              {passCount} passed
            </span>
            <span className="font-medium text-[#dc2626]">
              {entered - passCount} failed
            </span>
          </>
        )}
      </div>

      {submitted ? (
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-[8px] border border-[#e5e7eb] bg-white px-4 py-2 text-[13px] font-medium text-text-heading hover:bg-[#f3f4f6]"
        >
          <Edit2 className="h-[13px] w-[13px]" />
          Edit record
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={submitting || !allEntered}
          title={
            !allEntered ? "Enter scores for all students first" : undefined
          }
          className="rounded-[8px] bg-brand-green px-5 py-2 text-[13px] font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "Saving…" : "Submit scores"}
        </button>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function TeacherGradesPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();

  // Arm selection
  const [arms, setArms] = useState<ArmSelectOption[]>([]);
  const [armsLoaded, setArmsLoaded] = useState(false);
  const [selectedArmId, setSelectedArmId] = useState("");

  // Assessment selectors
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTerm, setSelectedTerm] = useState<GradeTerm>("second_term");
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentType>("first_ca");

  // Per-arm students (all setState in .then())
  const [students, setStudents] = useState<AttendanceStudentRow[]>([]);

  // Per-record data (all setState in .then())
  const [scores, setScores] = useState<Record<string, number | null>>({});
  const [existingRecord, setExistingRecord] = useState<GradeRecord | null>(
    null
  );
  const [readOnly, setReadOnly] = useState(false);

  // Freshness keys (all set in .then() or event handlers)
  const [armsLoaded_, setArmsLoaded_] = useState(false);
  void armsLoaded_; // alias — armsLoaded is the derived bool
  const [studentsKey, setStudentsKey] = useState("");
  const [dataKey, setDataKey] = useState("");
  const [submittedKey, setSubmittedKey] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // Derived
  const loadingArms = !armsLoaded;
  const loadingStudents = selectedArmId !== "" && studentsKey !== selectedArmId;
  const selectionKey =
    selectedArmId && selectedSubject
      ? `${selectedArmId}:${selectedSubject}:${selectedTerm}:${selectedAssessment}`
      : "";
  const loadingRecord =
    selectionKey !== "" && dataKey !== selectionKey && !loadingStudents;
  const justSubmitted =
    submittedKey !== "" && submittedKey === selectionKey && readOnly;

  const selectedArm = arms.find((a) => a.armId === selectedArmId);
  const subjects = selectedArm ? getSubjectsForLevel(selectedArm.level) : [];
  const maxScore = ASSESSMENT_MAX[selectedAssessment];

  // Load arms on mount
  useEffect(() => {
    let cancelled = false;
    getTeacherGradeArms(user?.id).then((data) => {
      if (cancelled) return;
      const sorted = [...data].sort(
        (a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]
      );
      setArms(sorted);
      setArmsLoaded(true);
      setArmsLoaded_(true);
      const armParam = searchParams.get("arm");
      if (armParam && sorted.find((a) => a.armId === armParam)) {
        setSelectedArmId(armParam);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id, searchParams]);

  // Load students when arm changes — resets subject selection too
  useEffect(() => {
    if (!selectedArmId) return;
    let cancelled = false;
    getStudentsForArm(selectedArmId).then((data) => {
      if (cancelled) return;
      const fresh: Record<string, null> = {};
      data.forEach((s) => {
        fresh[s.studentId] = null;
      });
      setStudents(data);
      setStudentsKey(selectedArmId);
      setScores(fresh);
      setSelectedSubject("");
      setExistingRecord(null);
      setReadOnly(false);
      setDataKey("");
      setSubmittedKey("");
    });
    return () => {
      cancelled = true;
    };
  }, [selectedArmId]);

  // Load existing record when full selection is ready
  useEffect(() => {
    if (!selectedArmId || !selectedSubject) return;
    let cancelled = false;
    getGradeRecord(
      selectedArmId,
      selectedSubject,
      selectedTerm,
      selectedAssessment
    ).then((record) => {
      if (cancelled) return;
      const key = `${selectedArmId}:${selectedSubject}:${selectedTerm}:${selectedAssessment}`;
      setDataKey(key);
      if (record) {
        setExistingRecord(record);
        setReadOnly(true);
        const scoreMap: Record<string, number | null> = {};
        record.entries.forEach((e) => {
          scoreMap[e.studentId] = e.score;
        });
        setScores(scoreMap);
      } else {
        setExistingRecord(null);
        setReadOnly(false);
        setScores({});
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedArmId, selectedSubject, selectedTerm, selectedAssessment]);

  const setScore = (studentId: string, raw: string) => {
    if (readOnly) return;
    const num = raw === "" ? null : Math.min(Number(raw), maxScore);
    setScores((prev) => ({ ...prev, [studentId]: num }));
  };

  const handleSubmit = async () => {
    const arm = arms.find((a) => a.armId === selectedArmId);
    if (!arm) return;
    setSubmitting(true);
    const entries = students.map((s) => ({
      studentId: s.studentId,
      studentName: s.studentName,
      admissionNumber: s.admissionNumber,
      score: scores[s.studentId] ?? null,
    }));
    const record = await submitGradeRecord({
      armId: selectedArmId,
      armName: arm.armName,
      subject: selectedSubject,
      term: selectedTerm,
      assessmentType: selectedAssessment,
      entries,
      submittedBy: user?.name ?? "Teacher",
    });
    setExistingRecord(record);
    setReadOnly(true);
    const key = `${selectedArmId}:${selectedSubject}:${selectedTerm}:${selectedAssessment}`;
    setSubmittedKey(key);
    setDataKey(key);
    setSubmitting(false);
  };

  // Group arms by level for <optgroup>
  const groupedArms = arms.reduce<Record<string, ArmSelectOption[]>>(
    (acc, arm) => {
      const label = LEVEL_LABELS[arm.level];
      if (!acc[label]) acc[label] = [];
      acc[label].push(arm);
      return acc;
    },
    {}
  );

  const selectCls =
    "h-[42px] w-full appearance-none rounded-[8px] border border-[#e5e7eb] bg-white px-[14px] pr-[36px] text-[14px] text-text-heading focus:border-brand-green focus:outline-none";

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="p-[30px]">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Score Entry
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          Enter CA and exam scores for your assigned class.
        </p>
      </div>

      {/* Selection controls */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {/* Arm */}
        <div className="relative">
          <select
            value={selectedArmId}
            onChange={(e) => setSelectedArmId(e.target.value)}
            className={selectCls}
            disabled={loadingArms}
          >
            <option value="">
              {loadingArms ? "Loading…" : "Select class arm"}
            </option>
            {Object.entries(groupedArms).map(([levelLabel, levelArms]) => (
              <optgroup key={levelLabel} label={levelLabel}>
                {levelArms.map((arm) => (
                  <option key={arm.armId} value={arm.armId}>
                    {arm.armName}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-[12px] h-[16px] w-[16px] -translate-y-1/2 text-[#6b7280]" />
        </div>

        {/* Subject */}
        <div className="relative">
          <select
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setDataKey(""); // force reload
            }}
            disabled={!selectedArmId || loadingStudents}
            className={selectCls}
          >
            <option value="">Select subject</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-[12px] h-[16px] w-[16px] -translate-y-1/2 text-[#6b7280]" />
        </div>

        {/* Term */}
        <div className="relative">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value as GradeTerm)}
            className={selectCls}
          >
            {(Object.entries(TERM_LABELS) as [GradeTerm, string][]).map(
              ([val, label]) => (
                <option key={val} value={val}>
                  {label}
                </option>
              )
            )}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-[12px] h-[16px] w-[16px] -translate-y-1/2 text-[#6b7280]" />
        </div>

        {/* Assessment type */}
        <div className="relative">
          <select
            value={selectedAssessment}
            onChange={(e) =>
              setSelectedAssessment(e.target.value as AssessmentType)
            }
            className={selectCls}
          >
            {(
              Object.entries(ASSESSMENT_LABELS) as [AssessmentType, string][]
            ).map(([val, label]) => (
              <option key={val} value={val}>
                {label} (/{ASSESSMENT_MAX[val]})
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-[12px] h-[16px] w-[16px] -translate-y-1/2 text-[#6b7280]" />
        </div>
      </div>

      {/* No arms assigned */}
      {!loadingArms && arms.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-[12px] border border-dashed border-[#e5e7eb] py-16 text-center">
          <BookOpen className="h-[40px] w-[40px] text-[#d1d5db]" />
          <p className="text-[15px] font-medium text-text-heading">
            No class arms assigned
          </p>
          <p className="max-w-[320px] text-[13px] text-text-body">
            You are not set as class teacher for any arm. Ask the school admin
            to assign you.
          </p>
        </div>
      )}

      {/* Waiting for selection */}
      {!loadingArms &&
        arms.length > 0 &&
        (!selectedArmId || !selectedSubject) && (
          <div className="flex flex-col items-center gap-3 rounded-[12px] border border-dashed border-[#e5e7eb] py-16 text-center">
            <BookOpen className="h-[40px] w-[40px] text-[#d1d5db]" />
            <p className="text-[15px] font-medium text-text-heading">
              Select a class arm and subject
            </p>
            <p className="text-[13px] text-text-body">
              Choose the class arm, subject, term, and assessment type above.
            </p>
          </div>
        )}

      {/* Loading skeleton */}
      {(loadingStudents || loadingRecord) && selectedSubject && (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[52px] animate-pulse rounded-[8px] bg-[#f3f4f6]"
            />
          ))}
        </div>
      )}

      {/* Score table */}
      {!loadingStudents &&
        !loadingRecord &&
        selectedArmId &&
        selectedSubject &&
        students.length > 0 && (
          <>
            {/* Submitted success banner */}
            {justSubmitted && existingRecord && (
              <div className="mb-4 flex items-center gap-2.5 rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3">
                <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-[#16a34a]" />
                <p className="text-[13px] text-[#15803d]">
                  Scores submitted successfully —{" "}
                  {formatDate(existingRecord.submittedAt)}
                </p>
              </div>
            )}

            {/* Read-only banner (existing record) */}
            {readOnly && !justSubmitted && existingRecord && (
              <div className="mb-4 flex items-center gap-2.5 rounded-[10px] border border-[#dbeafe] bg-[#eff6ff] px-4 py-3">
                <CheckCircle2 className="h-[18px] w-[18px] shrink-0 text-[#2563eb]" />
                <p className="text-[13px] text-[#1d4ed8]">
                  Scores already submitted on{" "}
                  {formatDate(existingRecord.submittedAt)}.
                  {existingRecord.published && (
                    <span className="ml-1 font-medium">Results published.</span>
                  )}
                </p>
              </div>
            )}

            {/* Table */}
            <div className="overflow-hidden rounded-[12px] border border-[#e5e7eb]">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                    <th className="py-3 pr-4 pl-5 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                      #
                    </th>
                    <th className="py-3 pr-4 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                      Student
                    </th>
                    <th className="py-3 pr-4 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                      Admission No.
                    </th>
                    <th className="py-3 pr-4 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                      Score (/{maxScore})
                    </th>
                    <th className="py-3 pr-5 text-left text-[12px] font-medium uppercase tracking-wide text-[#6b7280]">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f3f4f6]">
                  {students.map((s, i) => {
                    const score = scores[s.studentId] ?? null;
                    return (
                      <tr
                        key={s.studentId}
                        className="bg-white transition-colors hover:bg-[#fafafa]"
                      >
                        <td className="py-3 pr-4 pl-5 text-[13px] text-[#9ca3af]">
                          {i + 1}
                        </td>
                        <td className="py-3 pr-4 text-[14px] font-medium text-text-heading">
                          {s.studentName}
                        </td>
                        <td className="py-3 pr-4 font-mono text-[13px] text-text-body">
                          {s.admissionNumber}
                        </td>
                        <td className="py-3 pr-4">
                          {readOnly ? (
                            <span className="text-[14px] font-semibold text-text-heading">
                              {score ?? "—"}
                            </span>
                          ) : (
                            <input
                              type="number"
                              min={0}
                              max={maxScore}
                              value={score ?? ""}
                              onChange={(e) =>
                                setScore(s.studentId, e.target.value)
                              }
                              placeholder="0"
                              className="h-[36px] w-[80px] rounded-[6px] border border-[#e5e7eb] px-3 text-[14px] font-medium text-text-heading focus:border-brand-green focus:outline-none"
                            />
                          )}
                        </td>
                        <td className="py-3 pr-5">
                          <GradeBadge score={score} maxScore={maxScore} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <SummaryBar
              scores={scores}
              maxScore={maxScore}
              totalStudents={students.length}
              submitted={readOnly}
              submitting={submitting}
              onSubmit={handleSubmit}
              onEdit={() => {
                setReadOnly(false);
                setSubmittedKey("");
              }}
            />
          </>
        )}

      {/* No students in arm */}
      {!loadingStudents &&
        selectedArmId &&
        selectedSubject &&
        students.length === 0 && (
          <div className="flex flex-col items-center gap-2 rounded-[12px] border border-dashed border-[#e5e7eb] py-12 text-center">
            <p className="text-[14px] font-medium text-text-heading">
              No students in this arm
            </p>
            <p className="text-[13px] text-text-body">
              Students haven&apos;t been enrolled in {selectedArm?.armName} yet.
            </p>
          </div>
        )}
    </div>
  );
}
