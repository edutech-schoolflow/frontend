"use client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import { Button } from "@/src/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import CardWrapper from "@/src/shared/CardWrapper";
import CustomTable from "@/src/shared/CustomTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import {
  EllipsisVertical,
  Eye,
  Pencil,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useState } from "react";

interface MaintenanceRequest {
  requestId: string;
  issueType: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved";
  reportedOn: string;
  updatedOn: string;
}

interface ActivityLog {
  time: string;
  label: string;
  replies?: { author: string; message: string }[];
  expanded?: boolean;
}

const requests: MaintenanceRequest[] = [
  {
    requestId: "MNT-88421",
    issueType: "Faulty Meter",
    description: "Meter has been malfunctioning",
    status: "Open",
    reportedOn: "12 Nov 2025",
    updatedOn: "---",
  },
  {
    requestId: "MNT-77092",
    issueType: "Damaged Pole",
    description: "Intermittent power loss reported by mu...",
    status: "In Progress",
    reportedOn: "08 Nov 2025",
    updatedOn: "---",
  },
  {
    requestId: "MNT-55201",
    issueType: "Meter Malfunction",
    description: "Meter not displaying readings correctly",
    status: "Resolved",
    reportedOn: "01 Nov 2025",
    updatedOn: "02 Nov 2025",
  },
  {
    requestId: "MNT-88421",
    issueType: "Token Loading Issue",
    description: "Unable to load purchased tokens",
    status: "Open",
    reportedOn: "12 Nov 2025",
    updatedOn: "---",
  },
];

const activityLogs: ActivityLog[] = [
  {
    time: "12 Sept, 08:20 AM",
    label: "Report submitted",
    replies: [
      {
        author: "Musa Ibrahim",
        message: "Maintenance completed successfully. No issues reported.",
      },
    ],
    expanded: true,
  },
  {
    time: "12 Sept, 08:20 AM",
    label: "Report submitted",
  },
  {
    time: "12 Sept, 08:20 AM",
    label: "Report submitted",
  },
];

const MaintenanceRequestTab = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<MaintenanceRequest | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Record<number, boolean>>({
    0: true,
  });

  const columns: ColumnDef<MaintenanceRequest>[] = [
    { accessorKey: "requestId", header: "Request ID" },
    { accessorKey: "issueType", header: "Issue Type" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: "reportedOn", header: "Reported on" },
    { accessorKey: "updatedOn", header: "Updated on" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex h-7 w-7 items-center justify-center rounded-md border border-border-default text-grey-text hover:bg-surface-subtle">
              <EllipsisVertical size={14} />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-1">
            <div className="flex flex-col">
              <button
                className="flex items-center gap-2 rounded px-3 py-2 text-xs text-dark-blue hover:bg-surface-subtle"
                onClick={() => {
                  setSelectedRequest(row.original);
                  setReportOpen(true);
                }}
              >
                <Eye size={12} />
                View Request
              </button>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  return (
    <>
      <CardWrapper className="space-y-4 px-4 py-4">
        <div className="flex items-center justify-between">
          <p className="text-xs text-grey-text">
            Maintenance requests by this customer
          </p>
          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 rounded-md border border-border-default bg-white px-3 py-2 text-xs text-grey-text hover:bg-surface-subtle">
                <SlidersHorizontal size={13} />
                Filter
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-4">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium text-dark-blue">Status</p>
                  <Select>
                    <SelectTrigger className="w-full text-xs text-grey-text">
                      <SelectValue placeholder="-- Select status --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium text-dark-blue">
                    Issue Type
                  </p>
                  <Select>
                    <SelectTrigger className="w-full text-xs text-grey-text">
                      <SelectValue placeholder="-- Select issue type --" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="faulty-meter">Faulty Meter</SelectItem>
                      <SelectItem value="damaged-pole">Damaged Pole</SelectItem>
                      <SelectItem value="meter-malfunction">
                        Meter Malfunction
                      </SelectItem>
                      <SelectItem value="token-loading-issue">
                        Token Loading Issue
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-xs"
                    onClick={() => setFilterOpen(false)}
                  >
                    Reset
                  </Button>
                  <Button
                    className="flex-1 text-xs"
                    onClick={() => setFilterOpen(false)}
                  >
                    Filter
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <CustomTable
          data={requests}
          columns={columns}
          isLoading={false}
          showPagination={true}
          rowCount={requests.length}
          pagination={pagination}
          setPagination={setPagination}
        />
      </CardWrapper>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent
          showCloseButton={false}
          className="max-w-md max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-semibold text-dark-blue">
              Report Details — {selectedRequest?.requestId}
            </DialogTitle>
            <button
              onClick={() => setReportOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-grey-text hover:bg-surface-subtle"
            >
              <X size={14} />
            </button>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Issue Type:</p>
              <p className="text-xs font-medium text-dark-blue">
                {selectedRequest?.issueType}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Status:</p>
              <StatusBadge status={selectedRequest?.status ?? "Open"} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Reported on:</p>
              <p className="text-xs font-medium text-dark-blue">
                {selectedRequest?.reportedOn}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Last Updated:</p>
              <p className="text-xs font-medium text-dark-blue">
                {selectedRequest?.updatedOn}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Meter Number:</p>
              <p className="text-xs font-medium text-dark-blue">04158273991</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Address:</p>
              <p className="text-xs font-medium text-dark-blue">
                No. 14 Ahmadu Bello Way, Kano
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border-default pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-grey-text">
              Report Content
            </p>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Subject:</p>
              <p className="text-xs font-medium text-dark-blue">
                Meter Malfunction
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="rounded-md border-l-2 border-primary bg-brand-mint px-3 py-2">
                <p className="text-xs text-grey-text">Description:</p>
                <p className="text-xs text-dark-blue">
                  Meter not displaying readings correctly.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Attachments:</p>
              <button className="flex items-center gap-1 text-xs text-primary hover:underline">
                <Eye size={12} />
                View
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-border-default pt-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-grey-text">
              Activity Log
            </p>
            <div className="flex flex-col gap-0">
              {activityLogs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    {i < activityLogs.length - 1 && (
                      <div
                        className="w-px flex-1 bg-border-default"
                        style={{ minHeight: 24 }}
                      />
                    )}
                  </div>
                  <div className="pb-4 flex-1">
                    <p className="text-[11px] text-grey-text">{log.time}</p>
                    <p className="text-xs font-medium text-dark-blue">
                      {log.label}
                    </p>
                    {log.replies && log.replies.length > 0 && (
                      <div className="mt-2 rounded-md border border-border-default bg-white overflow-hidden">
                        {log.replies.map((reply, j) => (
                          <div key={j} className="px-3 py-2">
                            <div
                              className="flex items-center justify-between cursor-pointer"
                              onClick={() =>
                                setExpandedLogs((prev) => ({
                                  ...prev,
                                  [i]: !prev[i],
                                }))
                              }
                            >
                              <div className="flex flex-col gap-0.5">
                                <p className="text-[11px] font-medium text-dark-blue">
                                  {reply.author}
                                </p>
                                <p className="text-[11px] text-grey-text">
                                  {reply.message}
                                </p>
                              </div>
                              <button className="text-grey-text">
                                {expandedLogs[i] ? (
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <polyline points="18 15 12 9 6 15" />
                                  </svg>
                                ) : (
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                  >
                                    <polyline points="6 9 12 15 18 9" />
                                  </svg>
                                )}
                              </button>
                            </div>
                            {expandedLogs[i] && (
                              <input
                                placeholder="Type a reply..."
                                className="mt-2 w-full rounded border border-border-default bg-surface-subtle px-2 py-1.5 text-xs text-dark-blue outline-none"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {!log.replies && (
                      <button className="mt-1 flex items-center gap-1 text-[11px] text-primary hover:underline">
                        <Pencil size={10} />
                        Add Note
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MaintenanceRequestTab;
