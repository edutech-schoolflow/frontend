import type { SchoolListing } from "@/src/types/school";
import EnrolSchoolCard from "./EnrolSchoolCard";

export default function SchoolGrid({
  schools,
  onApply,
}: {
  schools: SchoolListing[];
  onApply: (school: SchoolListing) => void;
}) {
  if (schools.length === 0)
    return (
      <p className="text-[14px] text-[#888]">No schools match your filters.</p>
    );

  const rows: SchoolListing[][] = [];
  for (let i = 0; i < schools.length; i += 3)
    rows.push(schools.slice(i, i + 3));

  return (
    <div className="flex flex-col gap-[19px]">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-[20px]">
          {row.map((s) => (
            <EnrolSchoolCard key={s.id} school={s} onApply={onApply} />
          ))}
        </div>
      ))}
    </div>
  );
}
