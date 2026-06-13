"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  ClipboardList,
  FileText,
  MessageCircle,
  BookOpen,
  School,
} from "lucide-react";
import {
  getTeacherDashboardStats,
  getTeacherTodaySchedule,
} from "@/src/lib/api/teachers";
import type { TeacherDashboardStats, TimetableSlot } from "@/src/types/teacher";

const QUICK_ACTIONS = [
  {
    label: "Take Attendance",
    href: "/teacher/dashboard/attendance",
    icon: CheckSquare,
    color: "bg-[#e8f5ee] text-[#1ca95c]",
  },
  {
    label: "Enter Scores",
    href: "/teacher/dashboard/scores",
    icon: ClipboardList,
    color: "bg-[#e8f0ff] text-[#4a6cf7]",
  },
  {
    label: "Post Assignment",
    href: "/teacher/dashboard/assignments",
    icon: FileText,
    color: "bg-[#fff3e8] text-[#ff8d28]",
  },
  {
    label: "Message Parent",
    href: "/teacher/dashboard/messages",
    icon: MessageCircle,
    color: "bg-[#fce8e8] text-[#e84040]",
  },
  {
    label: "Exam Questions",
    href: "/teacher/dashboard/exams",
    icon: BookOpen,
    color: "bg-[#e8f5ee] text-[#1ca95c]",
  },
  {
    label: "My Schools",
    href: "/teacher/dashboard/schools",
    icon: School,
    color: "bg-[#f5f5f5] text-[#666]",
  },
];

export default function TeacherDashboardHome() {
  const [stats, setStats] = useState<TeacherDashboardStats | undefined>(
    undefined
  );
  const [schedule, setSchedule] = useState<TimetableSlot[] | undefined>(
    undefined
  );

  useEffect(() => {
    getTeacherDashboardStats().then(setStats);
    getTeacherTodaySchedule().then(setSchedule);
  }, []);

  if (stats === undefined || schedule === undefined) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-[#1ca95c] border-t-transparent" />
      </div>
    );
  }

  const statCards = [
    { label: "Classes Today", value: stats.classesToday },
    { label: "Students Taught", value: stats.totalStudents },
    { label: "Pending Tasks", value: stats.pendingTasks },
  ];

  return (
    <div className="p-[30px]">
      {/* Stats row */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        {statCards.map((s) => (
          <div
            key={s.label}
            className="rounded-[10px] border border-[#e0e0e0] bg-white px-6 py-5"
          >
            <p className="text-[28px] font-semibold text-text-heading">
              {s.value}
            </p>
            <p className="mt-1 text-[13px] text-text-body">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="mb-4 text-[16px] font-semibold text-text-heading">
        Quick actions
      </h2>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {QUICK_ACTIONS.map((a) => {
          const Icon = a.icon;
          return (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-3 rounded-[10px] border border-[#e0e0e0] bg-white px-5 py-4 transition-shadow hover:shadow-md"
            >
              <div
                className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full ${a.color}`}
              >
                <Icon className="h-[18px] w-[18px]" />
              </div>
              <span className="text-[14px] font-medium text-text-heading">
                {a.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Today's schedule */}
      <h2 className="mb-4 text-[16px] font-semibold text-text-heading">
        Today&apos;s schedule
      </h2>
      {schedule.length === 0 ? (
        <div className="rounded-[10px] border border-[#e0e0e0] bg-white px-6 py-8 text-center">
          <p className="text-[14px] text-text-body">
            No classes scheduled today. Your timetable will appear here once
            your school assigns your classes.
          </p>
          <Link
            href="/teacher/dashboard/timetable"
            className="mt-3 inline-block text-[13px] font-medium text-brand-green hover:underline"
          >
            View full timetable →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {schedule.map((slot) => (
            <div
              key={`${slot.period}-${slot.classArm}`}
              className="flex items-center gap-4 rounded-[10px] border border-[#e0e0e0] bg-white px-5 py-4"
            >
              <span className="w-[80px] shrink-0 text-[12px] text-text-body">
                {slot.time}
              </span>
              <span className="text-[14px] font-medium text-text-heading">
                {slot.subject}
              </span>
              <span className="ml-auto text-[13px] text-text-body">
                {slot.classArm}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
