import Link from "next/link";
import type { SchoolListing } from "@/src/types/school";

interface Props {
  school: SchoolListing;
  onEnrol: () => void;
}

export default function SchoolCard({ school, onEnrol }: Props) {
  const types = school.type.split(",").map((t) => t.trim());
  const ratingNum = parseFloat(school.rating);

  return (
    <div className="flex flex-col rounded-[10px] border border-[#e0e0e0] bg-white p-[20px]">
      <div className="flex items-start gap-[12px]">
        <div className="flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full bg-[#e8f8ef] text-[20px]">
          🏫
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-[6px]">
            <p className="text-[15px] font-medium text-[#1b1b1b]">
              {school.name}
            </p>
            {school.verified && (
              <span className="rounded-full bg-[#e8f8ef] px-[8px] py-[2px] text-[10px] font-medium text-[#1ca95c]">
                ✓ Verified
              </span>
            )}
          </div>
          <p className="mt-[2px] text-[12px] text-[#888]">{school.location}</p>
        </div>
      </div>

      <div className="mt-[12px] flex flex-wrap gap-[6px]">
        {types.map((t) => (
          <span
            key={t}
            className="rounded-full bg-[#f5f5f5] px-[10px] py-[3px] text-[11px] text-[#555]"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-[12px] flex items-center justify-between">
        <span className="text-[13px] text-[#555]">
          <span className="text-yellow-500">★</span>{" "}
          {isNaN(ratingNum) ? school.rating : ratingNum.toFixed(1)}
        </span>
        <span className="text-[13px] font-medium text-[#1b1b1b]">
          ₦{school.applicationFee.toLocaleString()} fee
        </span>
      </div>

      <div className="mt-[16px] flex gap-[8px]">
        <Link
          href={`/parent/dashboard/school/${school.id}`}
          className="flex h-[38px] flex-1 items-center justify-center rounded-[6px] border border-[#1ca95c] text-[13px] font-medium text-[#1ca95c] transition-colors hover:bg-[#f7fdf9]"
        >
          View profile
        </Link>
        <button
          type="button"
          onClick={onEnrol}
          className="flex h-[38px] flex-1 items-center justify-center rounded-[6px] bg-[#1ca95c] text-[13px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Enrol
        </button>
      </div>
    </div>
  );
}
