import AssessmentCell from "./AssessmentCell";
import type { SubjectMatrixRow } from "./grades.utils";
import { ASSESSMENT_LABELS } from "@/src/types/scoreEntry";
import type { AssessmentType } from "@/src/types/scoreEntry";
import { ASSESSMENT_COLS } from "./grades.utils";

interface Props {
  subjects: SubjectMatrixRow[];
  onPublish: (recordId: string) => void;
  onViewCell: (subject: string, type: AssessmentType) => void;
  publishingId: string | null;
}

export default function SubjectMatrix({
  subjects,
  onPublish,
  onViewCell,
  publishingId,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse">
        <thead>
          <tr className="border-b border-[#f3f4f6]">
            <th className="py-2 pr-4 pl-5 text-left text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
              Subject
            </th>
            {ASSESSMENT_COLS.map((type) => (
              <th
                key={type}
                className="px-3 py-2 text-center text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]"
              >
                {ASSESSMENT_LABELS[type as AssessmentType]}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f9fafb]">
          {subjects.map((row) => (
            <tr key={row.subject} className="hover:bg-[#fafafa]">
              <td className="py-2.5 pr-4 pl-5 text-[13px] font-medium text-text-heading">
                {row.subject}
              </td>
              {ASSESSMENT_COLS.map((type) => (
                <AssessmentCell
                  key={type}
                  cell={row.cells[type as AssessmentType]}
                  onPublish={onPublish}
                  onView={() => onViewCell(row.subject, type as AssessmentType)}
                  publishing={
                    publishingId === row.cells[type as AssessmentType].recordId
                  }
                />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
