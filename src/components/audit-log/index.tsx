"use client";

import StatusBadge from "../ui/StatusBadge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import CustomTable from "@/src/shared/CustomTable";
import CardWrapper from "@/src/shared/CardWrapper";
import {
  CalendarDays,
  Filter,
  MoreHorizontal,
  EyeIcon,
  Search,
} from "lucide-react";
import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import AuditFilter from "./components/AuditFilter";
import { DateRange } from "react-day-picker";
import DateRangePicker from "../ui/calendar-v2";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

interface AuditRecord {
  timestamp: string;
  actor: string;
  role: string;
  module: string;
  actionType: string;
  entityType: string;
  entityId: string;
  status: "Failed" | "Success";
}

const audits: AuditRecord[] = [
  {
    timestamp: "3:45 PM",
    actor: "Musa Ibrahim",
    role: "Admin",
    module: "Operations",
    actionType: "Create",
    entityType: "Customer",
    entityId: "CUST-36291",
    status: "Failed",
  },
  {
    timestamp: "2:30 PM",
    actor: "System",
    role: "System",
    module: "Announcement",
    actionType: "Send",
    entityType: "Billing account",
    entityId: "ANN-34241",
    status: "Success",
  },
  {
    timestamp: "2:30 PM",
    actor: "Fatima Sani",
    role: "Admin",
    module: "Finance",
    actionType: "Export",
    entityType: "Meter",
    entityId: "EXP-42932",
    status: "Success",
  },
  {
    timestamp: "6:34 PM",
    actor: "David Chukwu",
    role: "Admin",
    module: "Customers",
    actionType: "Status change",
    entityType: "Payment",
    entityId: "TXN-39283",
    status: "Failed",
  },
  {
    timestamp: "7:23 AM",
    actor: "System",
    role: "System",
    module: "Reports",
    actionType: "Export",
    entityType: "Ticket",
    entityId: "TCK-32823",
    status: "Success",
  },
  {
    timestamp: "9:23 AM",
    actor: "Musa Ibrahim",
    role: "Admin",
    module: "Settings",
    actionType: "Login",
    entityType: "Announcement",
    entityId: "ANN-49292",
    status: "Success",
  },
  {
    timestamp: "10:34 AM",
    actor: "Fatima Sani",
    role: "Admin",
    module: "Finance",
    actionType: "Export",
    entityType: "Meter",
    entityId: "EXP-19283",
    status: "Failed",
  },
  {
    timestamp: "1:23 PM",
    actor: "System",
    role: "System",
    module: "Customers",
    actionType: "Update",
    entityType: "Customer",
    entityId: "CUST-32932",
    status: "Success",
  },
  {
    timestamp: "2:31 PM",
    actor: "David Chukwu",
    role: "Admin",
    module: "Reports",
    actionType: "Export",
    entityType: "Billing account",
    entityId: "EXP-34034",
    status: "Failed",
  },
  {
    timestamp: "9:32 AM",
    actor: "System",
    role: "System",
    module: "Settings",
    actionType: "Login",
    entityType: "Customer",
    entityId: "ADM-00012",
    status: "Success",
  },
];

const AuditLogTable = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedAudit, setSelectedAudit] = useState<AuditRecord | null>(null);

  const auditColumns: ColumnDef<AuditRecord>[] = [
    { accessorKey: "timestamp", header: "Timestamp" },
    { accessorKey: "actor", header: "Actor" },
    { accessorKey: "role", header: "Role" },
    { accessorKey: "module", header: "Module" },
    { accessorKey: "actionType", header: "Action Type" },
    { accessorKey: "entityType", header: "Entity Type" },
    { accessorKey: "entityId", header: "Entity ID" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: "actions",
      header: "",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-10 w-8 border-[0.7px] border-neutral-strokes rounded-xl p-2 bg-white hover:bg-fade-primary focus-visible:outline-offset-0 focus-visible:ring-transparent cursor-pointer">
                <MoreHorizontal className="w-4 h-4 text-dark-blue" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="flex items-center gap-1.5 text-xs font-medium p-4 pr-6 tracking-[-0.12px] self-stretch"
                onClick={() => setSelectedAudit(row.original)}
              >
                <EyeIcon className="h-3.75 w-3.75" /> View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <CardWrapper>
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2.5 px-3.75 py-3 border rounded-[7px] bg-surface-muted cursor-pointer">
          <Search className="w-4 h-4" />
          <input
            type="text"
            placeholder="Search by actor name/ ID"
            className="bg-transparent outline-none text-neutral-input-text text-[13px] italic leading-[-0.13px] w-full"
          />
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button className="border-[0.6px] rounded-[6px] border-neutral-strokes bg-white text-xs font-normal text-text-heading leading-[-0.12px] flex gap-1 justify-center">
                <Filter className="h-3.5 w-3.5" strokeWidth={1} />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
              <AuditFilter />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button className="border-[0.6px] rounded-[6px] border-neutral-strokes bg-white text-xs font-normal text-text-heading leading-[-0.12px] flex gap-1">
                <CalendarDays className="h-3.5 w-3.5" strokeWidth={1} />
                Date
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DateRangePicker
                selected={dateRange}
                onSelect={setDateRange}
                fromYear={2015}
                toYear={new Date().getFullYear()}
                disabled={(val) =>
                  val > new Date() || val < new Date("2015-01-01")
                }
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <CustomTable
        data={audits}
        columns={auditColumns}
        isLoading={false}
        showPagination={true}
        rowCount={200}
        pagination={pagination}
        setPagination={setPagination}
      />

      <Dialog
        open={!!selectedAudit}
        onOpenChange={() => setSelectedAudit(null)}
      >
        <DialogContent className="max-w-118.75">
          <DialogHeader>
            <DialogTitle className="text-text-heading">
              Audit Log Entry - AUD-49203
            </DialogTitle>
          </DialogHeader>
          <hr />
          <div className="flex flex-col gap-3.75">
            <div className="flex justify-between">
              <span className="text-grey-text text-[13px] ">Timestamp:</span>
              <span className="text-sm font-medium leading-4.5">
                {selectedAudit?.timestamp}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-grey-text text-[13px] ">Actor:</span>
              <span className="text-sm font-medium leading-4.5">
                {selectedAudit?.actor}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-grey-text text-[13px] ">
                Actor Role/ Type
              </span>
              <span className="text-sm font-medium leading-4.5">
                {selectedAudit?.role}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-grey-text text-[13px] ">IP Address:</span>
              <span className="text-sm font-medium leading-4.5">---</span>
            </div>
            <div className="flex justify-between">
              <span className="text-grey-text text-[13px] ">Module:</span>
              <span className="text-sm font-medium leading-4.5">
                {selectedAudit?.module}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-grey-text text-[13px] ">Action Type:</span>
              <span className="text-sm font-medium leading-4.5">
                {selectedAudit?.actionType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-grey-text text-[13px] ">Entity Type:</span>
              <span className="text-sm font-medium leading-4.5">
                {selectedAudit?.entityType}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-grey-text text-[13px] ">Entity ID:</span>
              <span className="text-sm font-medium leading-4.5">
                {selectedAudit?.entityId}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-grey-text text-[13px]">status:</span>
              <StatusBadge status={selectedAudit?.status ?? "Successful"} />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </CardWrapper>
  );
};

export default AuditLogTable;
