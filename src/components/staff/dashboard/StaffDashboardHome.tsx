"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ChevronRight, BookOpen } from "lucide-react";
import { useStaffFeatures } from "@/src/context/StaffFeaturesContext";
import StaffCheckInWidget from "@/src/components/teacher/dashboard/home/StaffCheckInWidget";
import { getTeacherArms, getStudentsForArm } from "@/src/lib/api/attendance";
import { getStaffDashboardStats } from "@/src/lib/api/teachers";
import { getBursarSummary } from "@/src/lib/api/fees";
import { getSchoolApplications } from "@/src/lib/api/applications";
import {
  getTodayStaffAttendance,
  getStaffAttendanceSettings,
} from "@/src/lib/api/staffAttendance";
import { getSchoolStaff } from "@/src/lib/api/staff";
import type { ArmSelectOption } from "@/src/lib/api/attendance";
import type { AttendanceStudentRow } from "@/src/types/attendance";
import type { StaffDashboardStats } from "@/src/types/teacher";
import type { BursarSummary } from "@/src/types/fee";
import type { Application } from "@/src/types/application";

// ─── Shared helpers ────────────────────────────────────────────────────────────

function formatNaira(n: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);
}

function StatCard({
  label,
  value,
  color = "text-text-heading",
  bg = "bg-[#f9fafb]",
}: {
  label: string;
  value: string | number;
  color?: string;
  bg?: string;
}) {
  return (
    <div className={`rounded-[12px] ${bg} px-5 py-5`}>
      <p className={`text-[26px] font-semibold ${color}`}>{value}</p>
      <p className="mt-1 text-[12px] text-text-body">{label}</p>
    </div>
  );
}

function QuickAction({
  label,
  href,
  bg,
  color,
}: {
  label: string;
  href: string;
  bg: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-[12px] border border-[#e5e7eb] bg-white px-5 py-4 transition-shadow hover:shadow-md"
    >
      <div
        className={`flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-[10px] ${bg}`}
      >
        <div className={`h-[18px] w-[18px] rounded-full ${color} opacity-80`} />
      </div>
      <span className="text-[14px] font-medium text-text-heading">{label}</span>
    </Link>
  );
}

// ─── Teacher home ──────────────────────────────────────────────────────────────

function TeacherHome({ userId }: { userId: string | undefined }) {
  const [stats, setStats] = useState<StaffDashboardStats | null>(null);
  const [arms, setArms] = useState<
    (ArmSelectOption & { students: AttendanceStudentRow[] })[]
  >([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getStaffDashboardStats(userId),
      getTeacherArms(userId).then((opts) =>
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
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const quickActions = [
    {
      label: "Take Attendance",
      href: "/staff/dashboard/attendance",
      bg: "bg-[#e8f5ee]",
      color: "bg-brand-green",
    },
    {
      label: "Enter Scores",
      href: "/staff/dashboard/grades",
      bg: "bg-[#e8f0ff]",
      color: "bg-[#4a6cf7]",
    },
    {
      label: "Exam Questions",
      href: "/staff/dashboard/exams",
      bg: "bg-[#fff3e8]",
      color: "bg-[#f97316]",
    },
    {
      label: "My Classes",
      href: "/staff/dashboard/classes",
      bg: "bg-[#fce8ff]",
      color: "bg-[#a855f7]",
    },
    {
      label: "My Schools",
      href: "/staff/dashboard/schools",
      bg: "bg-[#f0f4ff]",
      color: "bg-[#6366f1]",
    },
    {
      label: "Compliance",
      href: "/staff/dashboard/compliance",
      bg: "bg-[#fefce8]",
      color: "bg-[#ca8a04]",
    },
  ];

  return (
    <>
      {stats && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard label="Assigned Arms" value={stats.armsCount} />
          <StatCard label="Students" value={stats.totalStudents} />
          <StatCard label="Exams Submitted" value={stats.examsSubmitted} />
          <StatCard
            label="Student Attendance"
            value={stats.attendanceMarkedToday ? "Done" : "Pending"}
            color={!stats.attendanceMarkedToday ? "text-[#f97316]" : undefined}
          />
        </div>
      )}

      <h2 className="mb-4 text-[15px] font-semibold text-text-heading">
        Quick actions
      </h2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {quickActions.map((a) => (
          <QuickAction key={a.href} {...a} />
        ))}
      </div>

      {arms.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
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
        </>
      )}
    </>
  );
}

// ─── Leadership home ───────────────────────────────────────────────────────────

function LeadershipHome() {
  const [staffCount, setStaffCount] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [cutoff, setCutoff] = useState("08:00");

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getSchoolStaff(),
      getTodayStaffAttendance(),
      getStaffAttendanceSettings(),
    ]).then(([{ staff }, checkIns, settings]) => {
      if (cancelled) return;
      const active = staff.filter((s) => s.status === "active");
      setStaffCount(active.length);
      setPresentCount(
        active.filter(
          (s) =>
            checkIns[s.id]?.status === "present" ||
            checkIns[s.id]?.status === "late"
        ).length
      );
      setCutoff(settings.checkInCutoff);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const quickActions = [
    {
      label: "School Overview",
      href: "/staff/dashboard/overview",
      bg: "bg-[#e8f5ee]",
      color: "bg-brand-green",
    },
    {
      label: "Staff Attendance",
      href: "/staff/dashboard/staff-attendance",
      bg: "bg-[#e8f0ff]",
      color: "bg-[#4a6cf7]",
    },
    {
      label: "My Schools",
      href: "/staff/dashboard/schools",
      bg: "bg-[#f0f4ff]",
      color: "bg-[#6366f1]",
    },
    {
      label: "Compliance",
      href: "/staff/dashboard/compliance",
      bg: "bg-[#fefce8]",
      color: "bg-[#ca8a04]",
    },
  ];

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total active staff" value={staffCount} />
        <StatCard
          label="Checked in today"
          value={presentCount}
          color="text-[#16a34a]"
          bg="bg-[#f0fdf4]"
        />
        <StatCard
          label="Not yet checked in"
          value={Math.max(0, staffCount - presentCount)}
          color="text-[#b45309]"
          bg="bg-[#fffbeb]"
        />
        <StatCard label="Check-in cut-off" value={cutoff} />
      </div>
      <h2 className="mb-4 text-[15px] font-semibold text-text-heading">
        Quick actions
      </h2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map((a) => (
          <QuickAction key={a.href} {...a} />
        ))}
      </div>
    </>
  );
}

// ─── Bursar home ───────────────────────────────────────────────────────────────

function BursarHome() {
  const [summary, setSummary] = useState<BursarSummary | null>(null);

  useEffect(() => {
    let cancelled = false;
    getBursarSummary("term-001").then((s) => {
      if (cancelled) return;
      setSummary(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const collectionPct = summary
    ? Math.round((summary.totalCollected / summary.totalExpected) * 100)
    : 0;

  const quickActions = [
    {
      label: "Fee Management",
      href: "/staff/dashboard/fees",
      bg: "bg-[#e8f5ee]",
      color: "bg-brand-green",
    },
    {
      label: "Invoices",
      href: "/staff/dashboard/invoices",
      bg: "bg-[#fffbeb]",
      color: "bg-[#b45309]",
    },
    {
      label: "My Schools",
      href: "/staff/dashboard/schools",
      bg: "bg-[#f0f4ff]",
      color: "bg-[#6366f1]",
    },
    {
      label: "Compliance",
      href: "/staff/dashboard/compliance",
      bg: "bg-[#fefce8]",
      color: "bg-[#ca8a04]",
    },
  ];

  return (
    <>
      {summary && (
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            label="Total expected"
            value={formatNaira(summary.totalExpected)}
          />
          <StatCard
            label="Collected"
            value={formatNaira(summary.totalCollected)}
            color="text-[#16a34a]"
            bg="bg-[#f0fdf4]"
          />
          <StatCard
            label="Outstanding"
            value={formatNaira(summary.totalOutstanding)}
            color="text-[#dc2626]"
            bg="bg-[#fef2f2]"
          />
          <StatCard
            label="Collection rate"
            value={`${collectionPct}%`}
            color={collectionPct >= 80 ? "text-[#16a34a]" : "text-[#b45309]"}
            bg="bg-[#f9fafb]"
          />
        </div>
      )}
      <h2 className="mb-4 text-[15px] font-semibold text-text-heading">
        Quick actions
      </h2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map((a) => (
          <QuickAction key={a.href} {...a} />
        ))}
      </div>
    </>
  );
}

// ─── Registrar home ────────────────────────────────────────────────────────────

function RegistrarHome() {
  const [apps, setApps] = useState<Application[]>([]);

  useEffect(() => {
    let cancelled = false;
    getSchoolApplications().then(({ data }) => {
      if (cancelled) return;
      setApps(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const pending = useMemo(
    () => apps.filter((a) => a.status === "under_review").length,
    [apps]
  );
  const scheduled = useMemo(
    () => apps.filter((a) => a.status === "exam_scheduled").length,
    [apps]
  );
  const admitted = useMemo(
    () => apps.filter((a) => a.status === "admitted").length,
    [apps]
  );

  const quickActions = [
    {
      label: "Admissions",
      href: "/staff/dashboard/admissions",
      bg: "bg-[#e8f5ee]",
      color: "bg-brand-green",
    },
    {
      label: "Students",
      href: "/staff/dashboard/students",
      bg: "bg-[#e8f0ff]",
      color: "bg-[#4a6cf7]",
    },
    {
      label: "My Schools",
      href: "/staff/dashboard/schools",
      bg: "bg-[#f0f4ff]",
      color: "bg-[#6366f1]",
    },
    {
      label: "Compliance",
      href: "/staff/dashboard/compliance",
      bg: "bg-[#fefce8]",
      color: "bg-[#ca8a04]",
    },
  ];

  return (
    <>
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total applications" value={apps.length} />
        <StatCard
          label="Pending review"
          value={pending}
          color="text-[#b45309]"
          bg="bg-[#fffbeb]"
        />
        <StatCard
          label="Exam scheduled"
          value={scheduled}
          color="text-[#2563eb]"
          bg="bg-[#eff6ff]"
        />
        <StatCard
          label="Admitted"
          value={admitted}
          color="text-[#16a34a]"
          bg="bg-[#f0fdf4]"
        />
      </div>
      <h2 className="mb-4 text-[15px] font-semibold text-text-heading">
        Quick actions
      </h2>
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map((a) => (
          <QuickAction key={a.href} {...a} />
        ))}
      </div>
    </>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export default function StaffDashboardHome() {
  const { features, profile, loading } = useStaffFeatures();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  const firstName = profile?.staff.firstName ?? "there";
  const isTeacher =
    features.can_mark_student_attendance || features.can_enter_grades;
  const isLeadership = features.can_view_school_overview;
  const isBursar = features.can_manage_fees;
  const isRegistrar = features.can_manage_admissions;

  return (
    <div className="p-[30px]">
      <div className="mb-7">
        <h1 className="text-[22px] font-semibold text-text-heading">
          Welcome back, {firstName}
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          {isTeacher && "Here's an overview of your classes this term."}
          {isLeadership && "Here's today's school overview."}
          {isBursar && "Here's the fee collection summary for this term."}
          {isRegistrar && "Here's the admissions pipeline overview."}
          {!isTeacher &&
            !isLeadership &&
            !isBursar &&
            !isRegistrar &&
            "Welcome to your staff portal."}
        </p>
      </div>

      <StaffCheckInWidget />

      {isTeacher && <TeacherHome userId={profile?.staff.userId} />}
      {isLeadership && <LeadershipHome />}
      {isBursar && <BursarHome />}
      {isRegistrar && <RegistrarHome />}
    </div>
  );
}
