"use client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import { Button } from "@/src/components/ui/button";
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
import { EllipsisVertical, Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import PaymentReceiptDialog from "./PaymentReceiptDialog";

interface Payment {
  transactionId: string;
  purpose: "Token" | "Bill";
  amount: string;
  paymentMethod: string;
  status: "Successful" | "Failed";
  date: string;
}

const payments: Payment[] = [
  {
    transactionId: "TXN-552319",
    purpose: "Token",
    amount: "₦10,000",
    paymentMethod: "Card",
    status: "Successful",
    date: "12 Nov 2025",
  },
  {
    transactionId: "TXN-024511",
    purpose: "Bill",
    amount: "₦28,900",
    paymentMethod: "Mobile Money",
    status: "Successful",
    date: "15 Sep 2025",
  },
  {
    transactionId: "TXN-024511",
    purpose: "Bill",
    amount: "₦28,900",
    paymentMethod: "Mobile Money",
    status: "Successful",
    date: "15 Sep 2025",
  },
  {
    transactionId: "TXN-024511",
    purpose: "Bill",
    amount: "₦28,900",
    paymentMethod: "Mobile Money",
    status: "Successful",
    date: "15 Sep 2025",
  },
  {
    transactionId: "TXN-449001",
    purpose: "Token",
    amount: "₦5,000",
    paymentMethod: "Card",
    status: "Failed",
    date: "21 Sept 2025",
  },
];

const statCards = [
  { label: "Total Payments", value: "₦145,000" },
  { label: "Total Token Purchases", value: "₦95,000" },
  { label: "Total Bill Payments", value: "₦50,000" },
  { label: "Last Payment", value: "12 Nov 2025" },
];

const PaymentsTab = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [filterOpen, setFilterOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const columns: ColumnDef<Payment>[] = [
    { accessorKey: "transactionId", header: "Transaction ID" },
    { accessorKey: "purpose", header: "Purpose" },
    { accessorKey: "amount", header: "Amount (₦)" },
    { accessorKey: "paymentMethod", header: "Payment Method" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: "date", header: "Date" },
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
                  setSelectedPayment(row.original);
                  setReceiptOpen(true);
                }}
              >
                View Receipt
              </button>
            </div>
          </PopoverContent>
        </Popover>
      ),
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          {statCards.map((card) => (
            <CardWrapper key={card.label} className="px-4 py-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-grey-text">{card.label}</p>
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-mint">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#3d52d5"
                    strokeWidth="2"
                  >
                    <rect x="2" y="5" width="20" height="14" rx="2" />
                    <line x1="2" y1="10" x2="22" y2="10" />
                  </svg>
                </div>
              </div>
              <p className="mt-2 text-lg font-semibold text-dark-blue">
                {card.value}
              </p>
            </CardWrapper>
          ))}
        </div>

        <CardWrapper className="space-y-4 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="relative w-65">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-text"
              />
              <Input
                placeholder="Search by transaction ID or amount"
                className="pl-8 text-xs"
              />
            </div>
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
                    <p className="text-xs font-medium text-dark-blue">
                      Payment Type
                    </p>
                    <Select>
                      <SelectTrigger className="w-full text-xs text-grey-text">
                        <SelectValue placeholder="-- Select payment type --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="token">Token</SelectItem>
                        <SelectItem value="bill">Bill</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <p className="text-xs font-medium text-dark-blue">Status</p>
                    <Select>
                      <SelectTrigger className="w-full text-xs text-grey-text">
                        <SelectValue placeholder="-- Select status --" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="successful">Successful</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
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
            data={payments}
            columns={columns}
            isLoading={false}
            showPagination={true}
            rowCount={200}
            pagination={pagination}
            setPagination={setPagination}
          />
        </CardWrapper>
      </div>

      <PaymentReceiptDialog
        open={receiptOpen}
        onOpenChange={setReceiptOpen}
        payment={selectedPayment}
      />
    </>
  );
};

export default PaymentsTab;
