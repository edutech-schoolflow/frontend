"use client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import CardWrapper from "@/src/shared/CardWrapper";
import CustomTable from "@/src/shared/CustomTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import { useState } from "react";
import AccountDetailsDialog from "./AccountDetailsDialog";
import BillingHistoryDialog from "./BillingHistoryDialog";
import TokenHistoryDialog from "./TokenHistoryDialog";

interface SavedAccount {
  nickname: string;
  accountNumber: string;
  accountType: "Prepaid" | "Postpaid";
  address: string;
  tariff: string;
  status: "Active" | "Inactive";
  linkedOn: string;
}

const savedAccounts: SavedAccount[] = [
  {
    nickname: "Home — Kano",
    accountNumber: "03847562019",
    accountType: "Postpaid",
    address: "14 Ahmadu Bello Way, Kano",
    tariff: "R2",
    status: "Active",
    linkedOn: "12 Oct 2025",
  },
  {
    nickname: "Sultyyy",
    accountNumber: "45051953412",
    accountType: "Prepaid",
    address: "14 Ahmadu Bello Way, Kano",
    tariff: "R2",
    status: "Active",
    linkedOn: "12 Oct 2025",
  },
  {
    nickname: "Fatima Sani",
    accountNumber: "04158273991",
    accountType: "Prepaid",
    address: "Plot 45 Constitution Road...",
    tariff: "C1",
    status: "Active",
    linkedOn: "15 Sep 2025",
  },
];

const SavedAccountsTab = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [accountDetailsOpen, setAccountDetailsOpen] = useState(false);
  const [billingHistoryOpen, setBillingHistoryOpen] = useState(false);
  const [tokenHistoryOpen, setTokenHistoryOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<SavedAccount | null>(
    null
  );

  const columns: ColumnDef<SavedAccount>[] = [
    { accessorKey: "nickname", header: "Nickname" },
    { accessorKey: "accountNumber", header: "Account Number" },
    { accessorKey: "accountType", header: "Account Type" },
    { accessorKey: "address", header: "Address" },
    { accessorKey: "tariff", header: "Tariff" },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    { accessorKey: "linkedOn", header: "Linked On" },
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
                  setSelectedAccount(row.original);
                  setAccountDetailsOpen(true);
                }}
              >
                View details
              </button>
              {row.original.accountType === "Postpaid" ? (
                <button
                  className="flex items-center gap-2 rounded px-3 py-2 text-xs text-dark-blue hover:bg-surface-subtle"
                  onClick={() => {
                    setSelectedAccount(row.original);
                    setBillingHistoryOpen(true);
                  }}
                >
                  Billing history
                </button>
              ) : (
                <button
                  className="flex items-center gap-2 rounded px-3 py-2 text-xs text-dark-blue hover:bg-surface-subtle"
                  onClick={() => {
                    setSelectedAccount(row.original);
                    setTokenHistoryOpen(true);
                  }}
                >
                  Token history
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
      <CardWrapper className="space-y-4">
        <p className="text-xs text-grey-text">
          All meters and billing accounts linked to this customer
        </p>
        <CustomTable
          data={savedAccounts}
          columns={columns}
          isLoading={false}
          showPagination={true}
          rowCount={savedAccounts.length}
          pagination={pagination}
          setPagination={setPagination}
        />
      </CardWrapper>

      <AccountDetailsDialog
        open={accountDetailsOpen}
        onOpenChange={setAccountDetailsOpen}
        account={selectedAccount}
      />
      <BillingHistoryDialog
        open={billingHistoryOpen}
        onOpenChange={setBillingHistoryOpen}
        account={selectedAccount}
      />
      <TokenHistoryDialog
        open={tokenHistoryOpen}
        onOpenChange={setTokenHistoryOpen}
        account={selectedAccount}
      />
    </>
  );
};

export default SavedAccountsTab;
