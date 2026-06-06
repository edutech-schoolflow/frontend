import { ReactNode } from "react";
import { cn } from "@/src/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; label: string };
  className?: string;
}

const StatsCard = ({
  label,
  value,
  icon,
  trend,
  className,
}: StatsCardProps) => (
  <div
    className={cn(
      "bg-white rounded-xl border border-border-default p-5",
      className
    )}
  >
    <div className="flex items-center justify-between">
      <p className="text-sm text-grey-text">{label}</p>
      {icon && <span className="opacity-60">{icon}</span>}
    </div>
    <p className="mt-2 text-2xl font-semibold text-dark-blue">{value}</p>
    {trend && (
      <p
        className={cn(
          "mt-1 text-xs",
          trend.value >= 0 ? "text-green-600" : "text-red-500"
        )}
      >
        {trend.value >= 0 ? "+" : ""}
        {trend.value}% {trend.label}
      </p>
    )}
  </div>
);

export default StatsCard;
