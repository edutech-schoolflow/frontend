"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { ReactNode } from "react";

export interface RouteChild {
  label: string;
  link: string;
}

export interface Route {
  icon?: ReactNode;
  label: string;
  link: string | null;
  children?: RouteChild[];
  section?: string;
}

export const schoolRoutes: Route[] = [
  // ── Top-level (no section) ───────────────────────────────────────────
  {
    icon: (
      <Image src="/icons/secure.svg" alt="compliance" width={20} height={20} />
    ),
    label: "Compliance",
    link: "compliance",
  },
  {
    icon: (
      <Image
        src="/icons/dashboard.svg"
        alt="dashboard"
        width={20}
        height={20}
      />
    ),
    label: "Dashboard",
    link: "",
  },

  // ── Academic ──────────────────────────────────────────────────────────
  {
    icon: (
      <Image
        src="/icons/user-group-v2.svg"
        alt="classes"
        width={20}
        height={20}
      />
    ),
    label: "Classes",
    link: "classes",
    section: "Academic",
  },
  {
    icon: (
      <Image
        src="/icons/check-circle.svg"
        alt="attendance"
        width={20}
        height={20}
      />
    ),
    label: "Attendance",
    link: "attendance",
  },
  {
    icon: (
      <Image src="/icons/pen-paper.svg" alt="grades" width={20} height={20} />
    ),
    label: "Grades & Results",
    link: "grades",
  },
  {
    icon: <Image src="/icons/drafts.svg" alt="exams" width={20} height={20} />,
    label: "Exam Questions",
    link: "exams",
  },

  // ── People ────────────────────────────────────────────────────────────
  {
    icon: <Image src="/icons/user-v1.svg" alt="staff" width={20} height={20} />,
    label: "Staff",
    link: "staff",
    section: "People",
  },
  {
    icon: (
      <Image
        src="/icons/folder.svg"
        alt="applications"
        width={20}
        height={20}
      />
    ),
    label: "Applications",
    link: "applications",
  },

  // ── Communication ──────────────────────────────────────────────────────
  {
    icon: (
      <Image
        src="/icons/speaker.svg"
        alt="announcements"
        width={20}
        height={20}
      />
    ),
    label: "Announcements",
    link: "announcements",
    section: "Communication",
  },
  {
    icon: (
      <Image src="/icons/user-group.svg" alt="pta" width={20} height={20} />
    ),
    label: "PTA Group",
    link: "pta",
  },

  // ── Store ──────────────────────────────────────────────────────────────
  {
    icon: <ShoppingBag size={18} />,
    label: "School Store",
    link: "store",
    section: "Store",
  },

  // ── Finance ────────────────────────────────────────────────────────────
  {
    icon: <Image src="/icons/finance.svg" alt="fees" width={20} height={20} />,
    label: "Finance",
    link: null,
    section: "Finance",
    children: [
      { label: "Fee Types", link: "fees/types" },
      { label: "Invoices", link: "fees/invoices" },
      { label: "Bursar Dashboard", link: "bursar" },
    ],
  },

  // ── Admin ──────────────────────────────────────────────────────────────
  {
    icon: <Image src="/icons/clock.svg" alt="audit" width={20} height={20} />,
    label: "Audit Log",
    link: "audit-log",
    section: "Admin",
  },
];
