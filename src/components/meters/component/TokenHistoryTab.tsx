"use client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
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
import { Filter, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface TokenRecord {
  date: string;
  amount: string;
  unit: string;
  token: string;
  status: "Delivered" | "Undelivered";
}

const tokenRecords: TokenRecord[] = [
  {
    date: "12 Nov 2025",
    amount: "₦50,000",
    unit: "42.6 units",
    token: "4859-5623-8712-9045-3217",
    status: "Delivered",
  },
  {
    date: "08 Nov 2025",
    amount: "₦70,000",
    unit: "42.6 units",
    token: "4895-5623-8712-9045-3217",
    status: "Undelivered",
  },
  {
    date: "01 Nov 2025",
    amount: "₦30,000",
    unit: "42.6 units",
    token: "4859-5623-8712-9045-3217",
    status: "Delivered",
  },
];

const TokenHistoryTab = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [resendOpen, setResendOpen] = useState(false);
  const [retryOpen, setRetryOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState<TokenRecord | null>(null);

  const columns: ColumnDef<TokenRecord>[] = [
    { accessorKey: "date", header: "Date" },
    { accessorKey: "amount", header: "Amount" },
    { accessorKey: "unit", header: "Unit" },
    { accessorKey: "token", header: "Token" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Popover>
          <PopoverTrigger asChild>
            <Button className="border-[0.6px] rounded-[6px] border-neutral-strokes bg-white text-xs font-normal text-text-heading leading-[-0.12px] flex gap-1 justify-center">
              <Filter className="h-3.5 w-3.5" strokeWidth={1} />
              Filter
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-44 p-1">
            <div className="flex flex-col">
              <button
                className="flex items-center gap-2 rounded px-3 py-2 text-xs text-dark-blue hover:bg-surface-subtle"
                onClick={() => {
                  setSelectedToken(row.original);
                  setResendOpen(true);
                }}
              >
                Resend Token
              </button>
              <button
                className="flex items-center gap-2 rounded px-3 py-2 text-xs text-dark-blue hover:bg-surface-subtle"
                onClick={() => {
                  setSelectedToken(row.original);
                  setRetryOpen(true);
                }}
              >
                Retry Delivery
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
            Token History of this customer
          </p>
          <div className="flex items-center gap-2">
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
                        <SelectValue placeholder="-- Select token status --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="undelivered">Undelivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium text-dark-blue">Unit</p>
                    <Input
                      placeholder="0.0"
                      type="number"
                      className="text-xs"
                    />
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
            <button className="flex items-center gap-1.5 rounded-md border border-border-default bg-white px-3 py-2 text-xs text-grey-text hover:bg-surface-subtle">
              Date
            </button>
          </div>
        </div>
        <CustomTable
          data={tokenRecords}
          columns={columns}
          isLoading={false}
          showPagination={true}
          rowCount={tokenRecords.length}
          pagination={pagination}
          setPagination={setPagination}
        />
      </CardWrapper>

      <Dialog open={resendOpen} onOpenChange={setResendOpen}>
        <DialogContent showCloseButton={false} className="max-w-sm text-center">
          <DialogTitle className="text-sm font-semibold text-dark-blue">
            Resend Token?
          </DialogTitle>
          <p className="text-xs text-grey-text">
            Do you want to resend the token &quot;{selectedToken?.token}&quot;
            to Musa Ibrahim?
          </p>
          <DialogFooter className="mt-2 flex gap-3 sm:justify-center">
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => setResendOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 text-xs"
              onClick={() => {
                setResendOpen(false);
                toast.success("Token resent successfully.");
              }}
            >
              Resend
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={retryOpen} onOpenChange={setRetryOpen}>
        <DialogContent showCloseButton={false} className="max-w-sm text-center">
          <DialogTitle className="text-sm font-semibold text-dark-blue">
            Resend Token?
          </DialogTitle>
          <p className="text-xs text-grey-text">
            Token &quot;{selectedToken?.token}&quot; wasn&apos;t delivered.
            Would you like to retry token delivery to Musa Ibrahim?
          </p>
          <DialogFooter className="mt-2 flex gap-3 sm:justify-center">
            <Button
              variant="outline"
              className="flex-1 text-xs"
              onClick={() => setRetryOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 text-xs"
              onClick={() => {
                setRetryOpen(false);
                toast.success("Token delivery retried successfully.");
              }}
            >
              Retry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TokenHistoryTab;
