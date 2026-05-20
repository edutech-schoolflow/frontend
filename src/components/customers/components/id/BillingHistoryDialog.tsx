"use client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";
import CustomTable from "@/src/shared/CustomTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { X } from "lucide-react";
import { useState } from "react";

interface SavedAccount {
  nickname: string;
  accountNumber: string;
  accountType: "Prepaid" | "Postpaid";
  address: string;
  tariff: string;
  status: "Active" | "Inactive";
  linkedOn: string;
}

interface BillingRecord {
  period: string;
  amount: string;
  dueDate: string;
  paymentDate: string;
  status: "Paid" | "Unpaid";
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: SavedAccount | null;
}

const billingRecords: BillingRecord[] = [
  {
    period: "Oct 2025",
    amount: "₦32,500",
    dueDate: "10 Nov 2025",
    paymentDate: "--",
    status: "Unpaid",
  },
  {
    period: "Sep 2025",
    amount: "₦28,900",
    dueDate: "10 Oct 2025",
    paymentDate: "05 Oct 2025",
    status: "Paid",
  },
  {
    period: "Aug 2025",
    amount: "₦22,600",
    dueDate: "10 Sept 2025",
    paymentDate: "12 Sept 2025",
    status: "Paid",
  },
  {
    period: "Jul 2025",
    amount: "₦28,900",
    dueDate: "10 Aug 2025",
    paymentDate: "05 Aug 2025",
    status: "Paid",
  },
];

const columns: ColumnDef<BillingRecord>[] = [
  {
    id: "details",
    header: "",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-dark-blue">
          {row.original.period}
        </p>
        <p className="text-[11px] text-grey-text">
          Due Date: {row.original.dueDate}
        </p>
        <p className="text-[11px] text-grey-text">
          Payment Date: {row.original.paymentDate}
        </p>
      </div>
    ),
  },
  {
    id: "amountStatus",
    header: "",
    cell: ({ row }) => (
      <div className="flex flex-col items-end gap-1">
        <p className="text-xs font-medium text-dark-blue">
          {row.original.amount}
        </p>
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
];

const BillingHistoryDialog = ({ open, onOpenChange, account }: Props) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-sm">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-sm font-semibold text-dark-blue">
            Billing History — {account?.nickname}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-grey-text hover:bg-surface-subtle"
          >
            <X size={14} />
          </button>
        </div>
        <CustomTable
          data={billingRecords}
          columns={columns}
          isLoading={false}
          showPagination={true}
          rowCount={billingRecords.length}
          pagination={pagination}
          setPagination={setPagination}
        />
      </DialogContent>
    </Dialog>
  );
};

export default BillingHistoryDialog;
