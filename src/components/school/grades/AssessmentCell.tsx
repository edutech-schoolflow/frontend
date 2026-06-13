import type { MatrixCell } from "./grades.utils";

interface Props {
  cell: MatrixCell;
  onPublish: (recordId: string) => void;
  onView: () => void;
  publishing: boolean;
}

export default function AssessmentCell({
  cell,
  onPublish,
  onView,
  publishing,
}: Props) {
  if (cell.status === "not_submitted") {
    return (
      <td className="px-3 py-3 text-center">
        <span className="text-[13px] text-[#d1d5db]">—</span>
      </td>
    );
  }

  const isPublished = cell.status === "published";
  const pct =
    cell.totalCount > 0
      ? Math.round((cell.passCount / cell.totalCount) * 100)
      : 0;

  return (
    <td className="px-3 py-2.5 text-center">
      <button
        onClick={onView}
        className={`inline-flex w-full items-center justify-center rounded-[8px] px-3 py-1.5 transition-opacity hover:opacity-80 ${
          isPublished
            ? "bg-[#f0fdf4] text-[#16a34a]"
            : "bg-[#fffbeb] text-[#b45309]"
        }`}
        title="View student scores"
      >
        <span className="text-[11px] font-medium">{pct}% pass</span>
      </button>

      {!isPublished && cell.recordId && (
        <button
          onClick={() => onPublish(cell.recordId!)}
          disabled={publishing}
          className="mt-1 block w-full rounded-[5px] bg-[#1ca95c] px-2 py-0.5 text-[10px] font-medium text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
        >
          {publishing ? "…" : "Publish"}
        </button>
      )}
    </td>
  );
}
