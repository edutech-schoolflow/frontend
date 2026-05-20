import { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
      <span className="text-2xl">📭</span>
    </div>
    <h3 className="text-base font-medium text-dark-blue">{title}</h3>
    {description && (
      <p className="mt-1 max-w-xs text-sm text-grey-text">{description}</p>
    )}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export default EmptyState;
