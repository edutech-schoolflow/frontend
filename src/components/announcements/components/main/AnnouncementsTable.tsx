"use Client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import CustomTable from "@/src/shared/CustomTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  MoreHorizontal,
  EyeIcon,
  SquarePen,
  Copy,
  CheckSquare,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Announcement {
  id: string;
  title: string;
  channel: string;
  audience: string;
  status: "Scheduled" | "Sent" | "Drafts";
  scheduledDate: string;
  sentDate: string;
}

const announcements: Announcement[] = [
  {
    id: "ANN-001",
    title: "Scheduled Power Outage",
    channel: "In-App",
    audience: "All Users",
    status: "Scheduled",
    scheduledDate: "04 Nov 2025",
    sentDate: "---",
  },
  {
    id: "ANN-002",
    title: "New Mobile App Feature Ava...",
    channel: "Push Notification",
    audience: "Prepaid Users",
    status: "Sent",
    scheduledDate: "04 Nov 2025",
    sentDate: "04 Nov 2025",
  },
  {
    id: "ANN-003",
    title: "Prepaid Meter Token Purcha...",
    channel: "In-App",
    audience: "All Users",
    status: "Drafts",
    scheduledDate: "04 Nov 2025",
    sentDate: "18 Sep 2025",
  },
  {
    id: "ANN-004",
    title: "Bill Payment Reminder",
    channel: "Push Notification",
    audience: "Postpaid Users",
    status: "Scheduled",
    scheduledDate: "04 Nov 2025",
    sentDate: "---",
  },
  {
    id: "ANN-005",
    title: "Kano State Network Upgrad...",
    channel: "Push Notification",
    audience: "Prepaid Users",
    status: "Sent",
    scheduledDate: "04 Nov 2025",
    sentDate: "15 Sep 2024",
  },
  {
    id: "ANN-006",
    title: "New Mobile App Feature Ava...",
    channel: "In-App",
    audience: "All Users",
    status: "Drafts",
    scheduledDate: "04 Nov 2025",
    sentDate: "01 Jan 2025",
  },
  {
    id: "ANN-007",
    title: "Bill Payment Reminder",
    channel: "Push Notification",
    audience: "Location-Based",
    status: "Scheduled",
    scheduledDate: "04 Nov 2025",
    sentDate: "---",
  },
  {
    id: "ANN-008",
    title: "Prepaid Meter Token Purcha...",
    channel: "Push Notification",
    audience: "Postpaid Users",
    status: "Sent",
    scheduledDate: "04 Nov 2025",
    sentDate: "12 Apr 2026",
  },
  {
    id: "ANN-009",
    title: "Kano State Network Upgrad...",
    channel: "In-App",
    audience: "All Users",
    status: "Drafts",
    scheduledDate: "04 Nov 2025",
    sentDate: "09 Jun 2023",
  },
  {
    id: "ANN-010",
    title: "Scheduled Power Outage",
    channel: "Push Notification",
    audience: "Location-Based",
    status: "Sent",
    scheduledDate: "04 Nov 2025",
    sentDate: "---",
  },
];

const announcementColumns: ColumnDef<Announcement>[] = [
  { accessorKey: "title", header: "Title" },
  { accessorKey: "channel", header: "Channel" },
  { accessorKey: "audience", header: "Audience" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  { accessorKey: "scheduledDate", header: "Scheduled date" },
  { accessorKey: "sentDate", header: "Sent date" },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-10 w-8 border-[0.7px] border-neutral-strokes rounded-xl p-2 bg-white hover:bg-fade-primary focus-visible:outline-offset-0 focus-visible:ring-transparent cursor-pointer">
              <MoreHorizontal className="w-4 h-4 text-dark-blue" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {status === "Sent" && (
              <div className="flex flex-col justify-start">
                <Link
                  href={`/announcements/${row.original.id}`}
                  className="flex items-center gap-1.5 text-xs font-medium p-3 pr-6 text-dark-blue hover:bg-surface-subtle"
                >
                  <EyeIcon className="h-3.75 w-3.75" />
                  View Details
                </Link>
                <button className="flex items-center gap-2 rounded p-3 pr-6 text-xs text-dark-blue hover:bg-surface-subtle">
                  <Copy className="h-3.75 w-3.75" />
                  Duplicate
                </button>
              </div>
            )}
            {status === "Scheduled" && (
              <div className="flex flex-col justify-start">
                <Link
                  href={`/announcements/${row.original.id}`}
                  className="flex gap-1.5 p-3 pr-6 text-xs font-medium text-dark-blue hover:bg-surface-subtle"
                >
                  <EyeIcon className="h-3.75 w-3.75" />
                  View Details
                </Link>
                <button className="flex items-center gap-2 rounded p-3 pr-6 text-xs text-dark-blue hover:bg-surface-subtle">
                  <Copy className="h-3.75 w-3.75" />
                  Duplicate
                </button>
                <button className="flex items-center gap-2 rounded p-3 pr-6 text-xs text-dark-blue hover:bg-surface-subtle">
                  <SquarePen className="h-3.75 w-3.75" />
                  Edit
                </button>
              </div>
            )}

            {status === "Drafts" && (
              <div className="flex flex-col justify-start">
                <button className="flex items-center gap-2 rounded p-3 pr-6 text-xs text-dark-blue hover:bg-surface-subtle">
                  <CheckSquare className="h-3.75 w-3.75" />
                  Launch
                </button>
                <Link
                  href={`/announcements/${row.original.id}`}
                  className="flex items-center gap-1.5 text-xs font-medium p-3 pr-6 text-dark-blue hover:bg-surface-subtle"
                >
                  <EyeIcon className="h-3.75 w-3.75" />
                  View Details
                </Link>
                <button className="flex items-center gap-2 rounded p-3 pr-6 text-xs text-dark-blue hover:bg-surface-subtle">
                  <SquarePen className="h-3.75 w-3.75" />
                  Edit
                </button>
                <button className="flex items-center gap-2 rounded p-3 pr-6 text-xs text-dark-blue hover:bg-surface-subtle">
                  <Copy className="h-3.75 w-3.75" />
                  Duplicate
                </button>
              </div>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const AnnouncementsTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <CustomTable
      data={announcements}
      columns={announcementColumns}
      isLoading={false}
      showPagination={true}
      rowCount={200}
      pagination={pagination}
      setPagination={setPagination}
    />
  );
};

export default AnnouncementsTable;
