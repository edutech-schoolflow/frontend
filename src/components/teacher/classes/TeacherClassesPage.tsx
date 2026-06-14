"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  BookOpen,
  ClipboardList,
  BarChart2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getTeacherArms, getStudentsForArm } from "@/src/lib/api/attendance";
import { getSubjectsForLevel } from "@/src/lib/api/gradeEntry";
import { useAuth } from "@/src/context/AuthContext";
import type { ArmSelectOption } from "@/src/lib/api/attendance";
import type { AttendanceStudentRow } from "@/src/types/attendance";

interface ArmDetail extends ArmSelectOption {
  students: AttendanceStudentRow[];
  subjects: string[];
}

function ArmCard({ arm }: { arm: ArmDetail }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[14px] border border-[#e5e7eb] bg-white overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-[46px] w-[46px] items-center justify-center rounded-[12px] bg-[#f0fdf4]">
            <BookOpen className="h-[22px] w-[22px] text-brand-green" />
          </div>
          <div>
            <p className="text-[17px] font-semibold text-text-heading">
              {arm.armName}
            </p>
            <div className="mt-0.5 flex items-center gap-3">
              <span className="flex items-center gap-1 text-[13px] text-text-body">
                <Users className="h-[13px] w-[13px]" />
                {arm.students.length} student
                {arm.students.length !== 1 ? "s" : ""}
              </span>
              <span className="text-[13px] text-text-body">
                {arm.subjects.length} subject
                {arm.subjects.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/staff/dashboard/attendance?arm=${arm.armId}`}
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#e5e7eb] px-4 text-[13px] font-medium text-text-body hover:border-brand-green hover:text-brand-green transition-colors"
          >
            <ClipboardList className="h-[14px] w-[14px]" />
            Attendance
          </Link>
          <Link
            href={`/staff/dashboard/grades?arm=${arm.armId}`}
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#e5e7eb] px-4 text-[13px] font-medium text-text-body hover:border-brand-green hover:text-brand-green transition-colors"
          >
            <BarChart2 className="h-[14px] w-[14px]" />
            Grades
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-[36px] w-[36px] items-center justify-center rounded-[8px] border border-[#e5e7eb] text-text-body hover:border-brand-green hover:text-brand-green transition-colors"
            aria-label={open ? "Collapse" : "Expand"}
          >
            {open ? (
              <ChevronUp className="h-[16px] w-[16px]" />
            ) : (
              <ChevronDown className="h-[16px] w-[16px]" />
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[#f3f4f6] px-6 pb-5">
          {/* Subjects */}
          <div className="mb-4 pt-4">
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-text-body">
              Subjects
            </p>
            <div className="flex flex-wrap gap-2">
              {arm.subjects.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-0.5 text-[12px] text-text-body"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Students */}
          <div>
            <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-text-body">
              Students
            </p>
            <div className="divide-y divide-[#f3f4f6] rounded-[10px] border border-[#e5e7eb] overflow-hidden">
              {arm.students.length === 0 ? (
                <p className="px-4 py-3 text-[13px] text-text-body">
                  No students enrolled.
                </p>
              ) : (
                arm.students.map((student, idx) => (
                  <div
                    key={student.studentId}
                    className="flex items-center justify-between px-4 py-2.5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#f3f4f6] text-[12px] font-medium text-text-body">
                        {idx + 1}
                      </span>
                      <span className="text-[14px] text-text-heading">
                        {student.studentName}
                      </span>
                    </div>
                    <span className="text-[12px] text-text-body">
                      {student.admissionNumber}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function StaffClassesPage() {
  const { user } = useAuth();
  const [arms, setArms] = useState<ArmDetail[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getTeacherArms(user?.id).then((options) => {
      Promise.all(
        options.map((opt) =>
          getStudentsForArm(opt.armId).then((students) => ({
            ...opt,
            students,
            subjects: getSubjectsForLevel(opt.level),
          }))
        )
      ).then((details) => {
        if (!cancelled) {
          setArms(details);
          setLoaded(true);
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-[30px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          My Classes
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          Classes you are assigned to as class teacher this term.
        </p>
      </div>

      {arms.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#e5e7eb] py-[60px] text-center">
          <BookOpen className="mb-3 h-[36px] w-[36px] text-[#d1d5db]" />
          <p className="text-[15px] font-medium text-text-heading">
            No classes assigned
          </p>
          <p className="mt-1 text-[13px] text-text-body">
            You haven&apos;t been set as a class teacher for any arm yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {arms.map((arm) => (
            <ArmCard key={arm.armId} arm={arm} />
          ))}
        </div>
      )}
    </div>
  );
}
