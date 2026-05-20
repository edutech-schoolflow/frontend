"use client";

import StatusBadge from "@/src/components/ui/StatusBadge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import CustomTable from "@/src/shared/CustomTable";
import { ColumnDef, PaginationState } from "@tanstack/react-table";
import { EllipsisVertical } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface Customer {
  name: string;
  phone: string;
  email: string;
  kycStatus: "Verified" | "Pending";
  status: "Active" | "Inactive";
  dateRegistered: string;
}

const customers: Customer[] = [
  {
    name: "Musa Ibrahim",
    phone: "+234 803 221 9081",
    email: "musa.ibrahim@email.c...",
    kycStatus: "Verified",
    status: "Active",
    dateRegistered: "12 Oct 2025",
  },
  {
    name: "Fatima Sani",
    phone: "+234 816 745 2209",
    email: "fatima.sani@email.com",
    kycStatus: "Pending",
    status: "Active",
    dateRegistered: "04 Nov 2025",
  },
  {
    name: "Ahmed Bello",
    phone: "+234 902 557 8810",
    email: "ahmed_bello@email.com",
    kycStatus: "Verified",
    status: "Active",
    dateRegistered: "18 Sep 2025",
  },
  {
    name: "Mary Okafor",
    phone: "+234 813 990 1211",
    email: "mary.okafor@email.com",
    kycStatus: "Verified",
    status: "Active",
    dateRegistered: "27 Aug 2025",
  },
  {
    name: "John Smith",
    phone: "+234 805 123 4567",
    email: "john.smith@email.com",
    kycStatus: "Verified",
    status: "Active",
    dateRegistered: "15 Sep 2024",
  },
  {
    name: "Aisha Bello",
    phone: "+234 906 234 5678",
    email: "aisha.bello@email.com",
    kycStatus: "Pending",
    status: "Inactive",
    dateRegistered: "01 Jan 2025",
  },
  {
    name: "David Chukwu",
    phone: "+234 708 345 6789",
    email: "david.chukwu@email.c...",
    kycStatus: "Verified",
    status: "Active",
    dateRegistered: "20 Mar 2023",
  },
  {
    name: "Fatima Abubakar",
    phone: "+234 810 456 7890",
    email: "fatima.abubakar@email...",
    kycStatus: "Verified",
    status: "Active",
    dateRegistered: "12 Apr 2026",
  },
  {
    name: "Samuel Ogunleye",
    phone: "+234 907 567 8901",
    email: "samuel.ogunleye@emai...",
    kycStatus: "Pending",
    status: "Inactive",
    dateRegistered: "09 Jun 2023",
  },
  {
    name: "Kabiru Yusuf",
    phone: "+234 706 223 1145",
    email: "kabiru.yusuf@email.com",
    kycStatus: "Pending",
    status: "Active",
    dateRegistered: "30 Sep 2025",
  },
];

const customerColumns: ColumnDef<Customer>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "phone", header: "Phone Number" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "kycStatus",
    header: "KYC Status",
    cell: ({ row }) => <StatusBadge status={row.original.kycStatus} />,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  { accessorKey: "dateRegistered", header: "Date Registered" },
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
            <Link
              href={`/customers/${row.index}`}
              className="flex items-center gap-2 rounded px-3 py-2 text-xs text-dark-blue hover:bg-surface-subtle"
            >
              View details
            </Link>
            <button className="flex items-center gap-2 rounded px-3 py-2 text-xs text-dark-blue hover:bg-surface-subtle">
              Edit details
            </button>
            <button className="flex items-center gap-2 rounded px-3 py-2 text-xs text-red-500 hover:bg-surface-subtle">
              Deactivate Customer
            </button>
          </div>
        </PopoverContent>
      </Popover>
    ),
  },
];

const CustomersTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  return (
    <CustomTable
      data={customers}
      columns={customerColumns}
      isLoading={false}
      showPagination={true}
      rowCount={200}
      pagination={pagination}
      setPagination={setPagination}
    />
  );
};

export default CustomersTable;
