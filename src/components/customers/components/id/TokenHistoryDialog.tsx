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

interface TokenRecord {
  token: string;
  units: string;
  amount: string;
  paymentMethod: string;
  date: string;
  status: "Delivered" | "Failed";
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: SavedAccount | null;
}

const tokenRecords: TokenRecord[] = [
  {
    token: "5619-5561-0784-9022",
    units: "38.2 units",
    amount: "₦10,000",
    paymentMethod: "Card",
    date: "02 Nov 2025",
    status: "Delivered",
  },
  {
    token: "4420-5582-9981-1101",
    units: "19.1 units",
    amount: "₦5,000",
    paymentMethod: "Mobile Money",
    date: "02 Nov 2025",
    status: "Delivered",
  },
  {
    token: "5619-5561-0784-9022",
    units: "38.2 units",
    amount: "₦10,000",
    paymentMethod: "Card",
    date: "02 Nov 2025",
    status: "Delivered",
  },
  {
    token: "5619-5561-0784-9022",
    units: "38.2 units",
    amount: "₦10,000",
    paymentMethod: "Card",
    date: "02 Nov 2025",
    status: "Delivered",
  },
];

const columns: ColumnDef<TokenRecord>[] = [
  {
    id: "details",
    header: "",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium text-dark-blue">
          {row.original.token}
        </p>
        <p className="text-[11px] text-grey-text">{row.original.units}</p>
        <p className="text-[11px] text-grey-text">
          Payment Method: {row.original.paymentMethod}
        </p>
        <p className="text-[11px] text-grey-text">{row.original.date}</p>
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

const TokenHistoryDialog = ({ open, onOpenChange, account }: Props) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-sm">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-sm font-semibold text-dark-blue">
            Token History — {account?.nickname}
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-default text-grey-text hover:bg-surface-subtle"
          >
            <X size={14} />
          </button>
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
      </DialogContent>
    </Dialog>
  );
};

export default TokenHistoryDialog;
