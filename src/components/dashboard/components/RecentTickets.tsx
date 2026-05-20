import CardWrapper from "@/src/shared/CardWrapper";
import CustomTable from "@/src/shared/CustomTable";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/src/components/ui/StatusBadge";

type TicketStatus = "Open" | "In Progress" | "Resolved";

interface Ticket {
  id: string;
  customer: string;
  category: string;
  status: TicketStatus;
  created: string;
}

const recentTickets: Ticket[] = [
  {
    id: "TKT-4921",
    customer: "Musa Ibrahim",
    category: "Billing Issue",
    status: "Open",
    created: "2 hrs ago",
  },
  {
    id: "TKT-4910",
    customer: "Fatima S.",
    category: "Meter Fault",
    status: "In Progress",
    created: "4 hrs ago",
  },
  {
    id: "TKT-4910",
    customer: "Fatima S.",
    category: "Meter Fault",
    status: "In Progress",
    created: "4 hrs ago",
  },
  {
    id: "TKT-4904",
    customer: "Ahmed Bello",
    category: "Token Issue",
    status: "Resolved",
    created: "Yesterday",
  },
  {
    id: "TKT-4898",
    customer: "Mary Elli",
    category: "Outage Report",
    status: "Open",
    created: "Yesterday",
  },
];

const ticketColumns: ColumnDef<Ticket>[] = [
  { accessorKey: "id", header: "Ticket ID" },
  { accessorKey: "customer", header: "Customer" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  { accessorKey: "created", header: "Created" },
];

const RecentTickets = () => (
  <CardWrapper className="w-full col-span-2 flex flex-col gap-6">
    <div className="flex items-center justify-between">
      <h2 className="text-sm font-semibold text-dark-blue">Recent Tickets</h2>
      <Link
        href="#"
        className="flex items-center gap-1 text-xs text-primary hover:underline"
      >
        View all <ArrowRight size={12} />
      </Link>
    </div>
    <CustomTable
      data={recentTickets}
      columns={ticketColumns}
      isLoading={false}
      showPagination={false}
    />
  </CardWrapper>
);

export default RecentTickets;
