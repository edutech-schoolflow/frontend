import { gradeStyle } from "./reportUtils";

export default function GradeBadge({ grade }: { grade: string }) {
  const { bg, text } = gradeStyle(grade);
  return (
    <span
      className="inline-flex items-center justify-center rounded-[4px] px-[10px] py-[2px] text-[12px] font-semibold"
      style={{ backgroundColor: bg, color: text }}
    >
      {grade}
    </span>
  );
}
