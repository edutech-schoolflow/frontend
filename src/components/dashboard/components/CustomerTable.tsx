import CardWrapper from "@/src/shared/CardWrapper";
import CustomTable from "@/src/shared/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/src/components/ui/StatusBadge";

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
    email: "musa.ibrahim@email.com",
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
];

const CustomerTable = () => (
  <CardWrapper>
    <div className="flex items-center justify-between pb-8">
      <h2 className="text-sm font-semibold text-dark-blue">Customers</h2>
      <Link
        href="#"
        className="flex items-center gap-1 text-xs text-primary hover:underline"
      >
        View all <ArrowRight size={12} />
      </Link>
    </div>
    <CustomTable
      data={customers}
      columns={customerColumns}
      isLoading={false}
      showPagination={false}
    />
  </CardWrapper>
);

export default CustomerTable;
