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

export const routes: Route[] = [
  {
    icon: (
      <Image src={"/icons/dashboard.svg"} alt="users" width={24} height={24} />
    ),
    label: "Dashboard",
    link: "",
  },
  {
    icon: (
      <Image
        src={"/icons/user-group-v2.svg"}
        alt="users"
        width={24}
        height={24}
      />
    ),
    label: "Customer Management",
    link: null,
    children: [
      { label: "Customers", link: "customers" },
      { label: "Meters", link: "meters" },
      { label: "Billing Accounts", link: "#" },
    ],
  },
  {
    icon: (
      <Image src={"/icons/finance.svg"} alt="users" width={24} height={24} />
    ),
    label: "Finance",
    link: null,
    children: [
      { label: "Payments", link: "#" },
      { label: "Tokens", link: "#" },
    ],
  },
  {
    icon: (
      <Image src={"/icons/warning-v2.svg"} alt="users" width={24} height={24} />
    ),
    label: "Operations",
    link: null,
    children: [
      { label: "Outages & Faults", link: "#" },
      { label: "Maintenance Requests", link: "#" },
      { label: "Service Centers", link: "#" },
    ],
  },
  {
    icon: (
      <Image src={"/icons/speaker.svg"} alt="users" width={24} height={24} />
    ),
    label: "Announcements",
    link: "announcements",
  },
  {
    icon: (
      <Image src={"/icons/barchart.svg"} alt="users" width={24} height={24} />
    ),
    label: "Reports & Exports",
    link: null,
    children: [
      { label: "Reports", link: "#" },
      { label: "Export Queue", link: "#" },
    ],
  },
  {
    icon: <Image src={"/icons/clock.svg"} alt="users" width={24} height={24} />,
    label: "Audit Log",
    link: "audit-log",
  },
];
