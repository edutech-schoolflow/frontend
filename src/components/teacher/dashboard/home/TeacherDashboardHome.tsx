"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  ClipboardList,
  BookOpen,
  School,
  Users,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import { getTeacherDashboardStats } from "@/src/lib/api/teachers";
import { getTeacherArms, getStudentsForArm } from "@/src/lib/api/attendance";
import { useAuth } from "@/src/context/AuthContext";
import type { TeacherDashboardStats } from "@/src/types/teacher";
import type { ArmSelectOption } from "@/src/lib/api/attendance";
import type { AttendanceStudentRow } from "@/src/types/attendance";
import StaffCheckInWidget from "./StaffCheckInWidget";

const QUICK_ACTIONS = [
  {
    label: "Take Attendance",
    href: "/staff/dashboard/attendance",
    icon: CheckSquare,
    bg: "bg-[#e8f5ee]",
    color: "text-[#1ca95c]",
  },
  {
    label: "Enter Scores",
    href: "/staff/dashboard/grades",
    icon: ClipboardList,
    bg: "bg-[#e8f0ff]",
    color: "text-[#4a6cf7]",
  },
  {
    label: "Exam Questions",
    href: "/staff/dashboard/exams",
    icon: BookOpen,
    bg: "bg-[#fff3e8]",
    color: "text-[#f97316]",
  },
  {
    label: "My Classes",
    href: "/staff/dashboard/classes",
    icon: Users,
    bg: "bg-[#fce8ff]",
    color: "text-[#a855f7]",
  },
  {
    label: "My Schools",
    href: "/staff/dashboard/schools",
    icon: School,
    bg: "bg-[#f0f4ff]",
    color: "text-[#6366f1]",
  },
  {
    label: "Compliance",
    href: "/staff/dashboard/compliance",
    icon: ShieldCheck,
    bg: "bg-[#fefce8]",
    color: "text-[#ca8a04]",
  },
];

interface ArmSummary extends ArmSelectOption {
  students: AttendanceStudentRow[];
}

export default function TeacherDashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState<TeacherDashboardStats | undefined>(
    undefined
  );
  const [arms, setArms] = useState<ArmSummary[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getTeacherDashboardStats(user?.id),
      getTeacherArms(user?.id).then((opts) =>
        Promise.all(
          opts.map((opt) =>
            getStudentsForArm(opt.armId).then((students) => ({
              ...opt,
              students,
            }))
          )
        )
      ),
    ]).then(([s, a]) => {
      if (cancelled) return;
      setStats(s);
      setArms(a);
      setLoaded(true);
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

  const statCards = [
    { label: "Assigned Arms", value: stats!.armsCount },
    { label: "Students", value: stats!.totalStudents },
    { label: "Exams Submitted", value: stats!.examsSubmitted },
    {
      label: "Attendance Today",
      value: stats!.attendanceMarkedToday ? "Done" : "Pending",
      highlight: !stats!.attendanceMarkedToday,
    },
  ];

  return (
    <div className="p-[30px]">
      {/* Greeting */}
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Welcome back, {user?.name?.split(" ")[0] ?? "Teacher"}
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          Here&apos;s an overview of your classes this term.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-[12px] border border-[#e5e7eb] bg-white px-5 py-5"
          >
            <p
              className={`text-[26px] font-semibold ${
                s.highlight ? "text-[#f97316]" : "text-text-heading"
              }`}
            >
              {s.value}
            </p>
            <p className="mt-1 text-[12px] text-text-body">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Staff check-in widget */}
      <StaffCheckInWidget />

      {/* Quick actions */}
      <h2 className="mb-4 text-[15px] font-semibold text-text-heading">
        Quick actions
      </h2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {QUICK_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-3 rounded-[12px] border border-[#e5e7eb] bg-white px-5 py-4 transition-shadow hover:shadow-md"
            >
              <div
                className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] ${a.bg}`}
              >
                <Icon className={`h-[18px] w-[18px] ${a.color}`} />
              </div>
              <span className="text-[14px] font-medium text-text-heading">
                {a.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Assigned classes */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[15px] font-semibold text-text-heading">
          Assigned classes
        </h2>
        <Link
          href="/staff/dashboard/classes"
          className="flex items-center gap-1 text-[13px] font-medium text-brand-green hover:underline"
        >
          View all <ChevronRight className="h-[13px] w-[13px]" />
        </Link>
      </div>

      {arms.length === 0 ? (
        <div className="rounded-[12px] border border-dashed border-[#e5e7eb] bg-white px-6 py-8 text-center">
          <p className="text-[14px] text-text-body">
            No classes assigned yet. Your school admin will assign arms to you.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {arms.map((arm) => (
            <div
              key={arm.armId}
              className="flex items-center justify-between rounded-[12px] border border-[#e5e7eb] bg-white px-5 py-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-[10px] bg-[#f0fdf4]">
                  <BookOpen className="h-[18px] w-[18px] text-brand-green" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-text-heading">
                    {arm.armName}
                  </p>
                  <p className="text-[12px] text-text-body">
                    {arm.students.length} student
                    {arm.students.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/staff/dashboard/attendance?arm=${arm.armId}`}
                  className="rounded-[8px] border border-[#e5e7eb] px-3 py-1.5 text-[12px] font-medium text-text-body hover:border-brand-green hover:text-brand-green transition-colors"
                >
                  Attendance
                </Link>
                <Link
                  href={`/staff/dashboard/grades?arm=${arm.armId}`}
                  className="rounded-[8px] border border-[#e5e7eb] px-3 py-1.5 text-[12px] font-medium text-text-body hover:border-brand-green hover:text-brand-green transition-colors"
                >
                  Grades
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
