"use client";

import Image from "next/image";
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
}

export const schoolRoutes: Route[] = [
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
  {
    icon: (
      <Image
        src="/icons/user-group-v2.svg"
        alt="students"
        width={20}
        height={20}
      />
    ),
    label: "Students",
    link: null,
    children: [
      { label: "All Students", link: "students" },
      { label: "Import Requests", link: "students/imports" },
    ],
  },
  {
    icon: <Image src="/icons/user-v1.svg" alt="staff" width={20} height={20} />,
    label: "Staff",
    link: "staff",
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
  {
    icon: <Image src="/icons/receipt.svg" alt="store" width={20} height={20} />,
    label: "Store",
    link: null,
    children: [
      { label: "Products", link: "store/products" },
      { label: "Orders", link: "store/orders" },
    ],
  },
  {
    icon: (
      <Image src="/icons/pen-paper.svg" alt="grades" width={20} height={20} />
    ),
    label: "Grades & Results",
    link: null,
    children: [
      { label: "Enter CA Scores", link: "grades/ca" },
      { label: "Enter Exam Scores", link: "grades/exam" },
      { label: "Publish Results", link: "grades/results" },
    ],
  },
  {
    icon: <Image src="/icons/finance.svg" alt="fees" width={20} height={20} />,
    label: "Finance",
    link: null,
    children: [
      { label: "Fee Types", link: "fees/types" },
      { label: "Invoices", link: "fees/invoices" },
      { label: "Bursar Dashboard", link: "bursar" },
    ],
  },
  {
    icon: (
      <Image src="/icons/user-group.svg" alt="pta" width={20} height={20} />
    ),
    label: "PTA Group",
    link: "pta",
  },
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
  },
  {
    icon: <Image src="/icons/clock.svg" alt="audit" width={20} height={20} />,
    label: "Audit Log",
    link: "audit-log",
  },
];
