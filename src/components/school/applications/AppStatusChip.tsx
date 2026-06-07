import type { ApplicationStatus } from "@/src/types/application";

const CONFIG: Record<ApplicationStatus, { label: string; cls: string }> = {
  under_review: {
    label: "Under Review",
    cls: "bg-amber-50 text-amber-700 border-amber-200",
  },
  exam_scheduled: {
    label: "Exam Scheduled",
    cls: "bg-blue-50 text-blue-700 border-blue-200",
  },
  admitted: {
    label: "Admitted",
    cls: "bg-green-50 text-green-700 border-green-200",
  },
  not_admitted: {
    label: "Not Admitted",
    cls: "bg-red-50 text-red-700 border-red-200",
  },
};

export default function AppStatusChip({
  status,
}: {
  status: ApplicationStatus;
}) {
  const { label, cls } = CONFIG[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-[10px] py-[3px] text-[12px] font-medium ${cls}`}
    >
      {label}
    </span>
  );
}
