import { CheckCircle, MinusCircle, Loader, XCircle } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import Image from "next/image";

const statusConfig: Record<
  string,
  { icon: React.ReactNode; className: string }
> = {
  Open: {
    icon: <MinusCircle size={12} />,
    className: "bg-blue-50 text-blue-600 border border-blue-200",
  },
  "In Progress": {
    icon: <Loader size={12} />,
    className: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  Resolved: {
    icon: <CheckCircle size={12} />,
    className: "bg-green-50 text-green-600 border border-green-200",
  },
  Sent: {
    icon: (
      <Image src="/icons/check-circle.svg" width={12} height={12} alt="sent" />
    ),
    className: "bg-green-50 text-green-600 border border-green-200",
  },
  Verified: {
    icon: <CheckCircle size={12} />,
    className: "bg-green-50 text-green-600 border border-green-200",
  },
  Pending: {
    icon: <Loader size={12} />,
    className: "bg-amber-50 text-amber-600 border border-amber-200",
  },
  Active: {
    icon: <CheckCircle size={12} />,
    className: "bg-green-50 text-green-600 border border-green-200",
  },
  Inactive: {
    icon: <MinusCircle size={12} />,
    className: "bg-red-50 text-red-600 border border-red-200",
  },
  Success: {
    icon: <CheckCircle size={12} />,
    className: "bg-green-50 text-green-600 border border-green-200",
  },
  Failed: {
    icon: <XCircle size={12} />,
    className: "bg-red-50 text-red-600 border border-red-200",
  },
  Scheduled: {
    icon: (
      <Image
        src="/icons/scheduled.svg"
        width={12}
        height={12}
        alt="scheduled"
      />
    ),
    className: "bg-brand-mint text-brand-green",
  },
  Drafts: {
    icon: <Image src="/icons/drafts.svg" width={12} height={12} alt="drafts" />,
    className: "bg-surface-subtle text-black",
  },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] ?? {
    icon: null,
    className: "bg-gray-100 text-gray-600 border border-gray-200",
  };

  return (
    <Badge className={config.className}>
      {config.icon}
      {status}
    </Badge>
  );
};

export default StatusBadge;
