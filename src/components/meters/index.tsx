"use client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import { Button } from "@/src/components/ui/button";
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
import { CalendarDays, Download, EllipsisVertical, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SearchInput } from "../ui/SearchInput";
import DateRangePicker from "../ui/calendar-v2";
import { DateRange } from "react-day-picker";

interface Meter {
  meterNumber: string;
  linkedCustomer: string;
  tariff: string;
  serviceAddress: string;
  status: "Active" | "Inactive";
  dateLinked: string;
}

const meters: Meter[] = [
  {
    meterNumber: "0239845209",
    linkedCustomer: "Musa Ibrahim",
    tariff: "R2",
    serviceAddress: "4 Madiana Crescent, Kano, Nigeria",
    status: "Active",
    dateLinked: "12 Oct 2025",
  },
  {
    meterNumber: "0438275018",
    linkedCustomer: "Fatima Sani",
    tariff: "R2",
    serviceAddress: "4 Madiana Crescent, Kano, Nigeria",
    status: "Active",
    dateLinked: "04 Nov 2025",
  },
  {
    meterNumber: "1920313812",
    linkedCustomer: "Ahmed Bello",
    tariff: "R2",
    serviceAddress: "4 Madiana Crescent, Kano, Nigeria",
    status: "Active",
    dateLinked: "18 Sep 2025",
  },
  {
    meterNumber: "2048208143",
    linkedCustomer: "Mary Okafor",
    tariff: "R2",
    serviceAddress: "4 Madiana Crescent, Kano, Nigeria",
    status: "Active",
    dateLinked: "27 Aug 2025",
  },
  {
    meterNumber: "3592038453",
    linkedCustomer: "John Smith",
    tariff: "R2",
    serviceAddress: "4 Madiana Crescent, Kano, Nigeria",
    status: "Active",
    dateLinked: "15 Sep 2024",
  },
  {
    meterNumber: "2482046296",
    linkedCustomer: "Aisha Bello",
    tariff: "R2",
    serviceAddress: "4 Madiana Crescent, Kano, Nigeria",
    status: "Inactive",
    dateLinked: "01 Jan 2025",
  },
  {
    meterNumber: "4492402449",
    linkedCustomer: "David Chukwu",
    tariff: "R2",
    serviceAddress: "4 Madiana Crescent, Kano, Nigeria",
    status: "Active",
    dateLinked: "20 Mar 2025",
  },
  {
    meterNumber: "5759350357",
    linkedCustomer: "Fatima Abubakar",
    tariff: "R2",
    serviceAddress: "4 Madiana Crescent, Kano, Nigeria",
    status: "Active",
    dateLinked: "12 Apr 2026",
  },
  {
    meterNumber: "2040357587",
    linkedCustomer: "Samuel Ogunleye",
    tariff: "R2",
    serviceAddress: "4 Madiana Crescent, Kano, Nigeria",
    status: "Inactive",
    dateLinked: "09 Jun 2023",
  },
  {
    meterNumber: "0275935375",
    linkedCustomer: "Kabiru Yusuf",
    tariff: "R2",
    serviceAddress: "4 Madiana Crescent, Kano, Nigeria",
    status: "Active",
    dateLinked: "30 Sep 2025",
  },
];

const Meters = () => {
  const router = useRouter();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const columns: ColumnDef<Meter>[] = [
    { accessorKey: "meterNumber", header: "Meter Number" },
    { accessorKey: "linkedCustomer", header: "Linked Customer" },
    { accessorKey: "tariff", header: "Tariff" },
    { accessorKey: "serviceAddress", header: "Service Address" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: "dateLinked", header: "Date Linked" },
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
                onClick={() =>
                  router.push(`/meters/${row.original.meterNumber}`)
                }
              >
                View details
              </button>
              {row.original.status === "Active" ? (
                <button
                  className="flex items-center gap-2 rounded px-3 py-2 text-xs text-red-500 hover:bg-surface-subtle"
                  onClick={() => {
                    setSelectedMeter(row.original);
                    setDeactivateOpen(true);
                  }}
                >
                  Deactivate meter
                </button>
              ) : (
                <button
                  className="flex items-center gap-2 rounded px-3 py-2 text-xs text-dark-blue hover:bg-surface-subtle"
                  onClick={() => {
                    setSelectedMeter(row.original);
                  }}
                >
                  Activate meter
                </button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  return (
    <>
      <CardWrapper>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <SearchInput placeholder="Search by name or meter number" />

            <div className="flex items-center gap-2">
              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button className="border-[0.6px] rounded-[6px] border-neutral-strokes bg-white text-xs font-normal text-text-heading leading-[-0.12px] flex gap-1 justify-center">
                    <Filter className="h-3.5 w-3.5" strokeWidth={1} />
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64 p-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-medium text-dark-blue">
                        Status
                      </p>
                      <Select>
                        <SelectTrigger className="w-full text-xs text-grey-text">
                          <SelectValue placeholder="-- Select status --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <p className="text-xs font-medium text-dark-blue">
                        Tariff
                      </p>
                      <Select>
                        <SelectTrigger className="w-full text-xs text-grey-text">
                          <SelectValue placeholder="-- Select tariff --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="r2">R2</SelectItem>
                          <SelectItem value="c1">C1</SelectItem>
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

              <Popover>
                <PopoverTrigger asChild>
                  <Button className="border-[0.6px] rounded-[6px] border-neutral-strokes bg-white text-xs font-normal text-text-heading leading-[-0.12px] flex gap-1">
                    <CalendarDays className="h-3.5 w-3.5" strokeWidth={1} />
                    Date Linked
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

              <Button className="flex items-center gap-1.5 text-xs">
                <Download size={13} />
                Export CSV
              </Button>
            </div>
          </div>

          <CustomTable
            data={meters}
            columns={columns}
            isLoading={false}
            showPagination={true}
            rowCount={200}
            pagination={pagination}
            setPagination={setPagination}
          />
        </div>
      </CardWrapper>

      {deactivateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <p className="text-sm font-semibold text-dark-blue">
                  Deactivate this meter?
                </p>
                <p className="text-xs text-grey-text">
                  Are you sure you want to deactivate this meter? Once
                  deactivated, the meter will no longer be available for
                  transactions or linked activities.
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <Button
                variant="outline"
                className="flex-1 text-xs"
                onClick={() => setDeactivateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1 text-xs"
                onClick={() => setDeactivateOpen(false)}
              >
                Deactivate
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Meters;
