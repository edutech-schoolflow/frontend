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
import { EllipsisVertical, Eye, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

interface Outage {
  refId: string;
  issueType: string;
  description: string;
  status: "Open" | "In Progress" | "Resolved";
  reportedOn: string;
  resolvedOn: string;
}

const outages: Outage[] = [
  {
    refId: "RPT-88421",
    issueType: "Power Outage",
    description: "Main line down on 5th Avenue causing...",
    status: "Open",
    reportedOn: "12 Nov 2025",
    resolvedOn: "---",
  },
  {
    refId: "RPT-77092",
    issueType: "Faulty Line",
    description: "Intermittent power loss reported by mu...",
    status: "In Progress",
    reportedOn: "08 Nov 2025",
    resolvedOn: "---",
  },
  {
    refId: "RPT-55201",
    issueType: "Low Voltage",
    description: "Customer reported dim lights an dappli...",
    status: "Resolved",
    reportedOn: "01 Nov 2025",
    resolvedOn: "02 Nov 2025",
  },
  {
    refId: "RPT-88421",
    issueType: "Power Outage",
    description: "Scheduled maintenance extended caus...",
    status: "Open",
    reportedOn: "12 Nov 2025",
    resolvedOn: "---",
  },
];

const OutagesTab = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedOutage, setSelectedOutage] = useState<Outage | null>(null);

  const columns: ColumnDef<Outage>[] = [
    { accessorKey: "refId", header: "Ref ID" },
    { accessorKey: "issueType", header: "Issue Type" },
    { accessorKey: "description", header: "Description" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: "reportedOn", header: "Reported on" },
    { accessorKey: "resolvedOn", header: "Resolved on" },
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
                  setSelectedOutage(row.original);
                  setReportOpen(true);
                }}
              >
                <Eye size={12} />
                View Report
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
            Outages reported by this customer
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
                      <SelectItem value="power-outage">Power Outage</SelectItem>
                      <SelectItem value="faulty-line">Faulty Line</SelectItem>
                      <SelectItem value="low-voltage">Low Voltage</SelectItem>
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
          data={outages}
          columns={columns}
          isLoading={false}
          showPagination={true}
          rowCount={outages.length}
          pagination={pagination}
          setPagination={setPagination}
        />
      </CardWrapper>

      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogContent showCloseButton={false} className="max-w-md">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-sm font-semibold text-dark-blue">
              Report Details — {selectedOutage?.refId}
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
                {selectedOutage?.issueType}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Status:</p>
              <StatusBadge status={selectedOutage?.status ?? "Open"} />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Created:</p>
              <p className="text-xs font-medium text-dark-blue">
                {selectedOutage?.reportedOn}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-xs text-grey-text">Last Updated:</p>
              <p className="text-xs font-medium text-dark-blue">
                {selectedOutage?.reportedOn}
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
                Voltage Fluctuations
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="rounded-md bg-brand-mint px-3 py-2">
                <p className="text-xs text-grey-text">Description:</p>
                <p className="text-xs text-dark-blue">
                  Voltage fluctuation since yesterday evening.
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
              {[
                "12 Sept, 08:20 AM",
                "12 Sept, 08:20 AM",
                "12 Sept, 08:20 AM",
              ].map((time, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary">
                      <div className="h-2 w-2 rounded-full bg-white" />
                    </div>
                    {i < 2 && (
                      <div
                        className="w-px flex-1 bg-border-default"
                        style={{ minHeight: 24 }}
                      />
                    )}
                  </div>
                  <div className="pb-4">
                    <p className="text-[11px] text-grey-text">{time}</p>
                    <p className="text-xs font-medium text-dark-blue">
                      Report submitted
                    </p>
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

export default OutagesTab;
