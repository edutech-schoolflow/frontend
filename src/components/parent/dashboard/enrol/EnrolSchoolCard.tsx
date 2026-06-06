import { MapPin, BookOpen, Banknote, Star } from "lucide-react";
import type { SchoolListing } from "@/src/types/school";

export default function EnrolSchoolCard({
  school,
  onApply,
}: {
  school: SchoolListing;
  onApply: (school: SchoolListing) => void;
}) {
  return (
    <div className="flex w-[330px] shrink-0 flex-col gap-[22px] rounded-[5px] border border-[#eee] bg-white px-[17px] py-[14px]">
      <div className="flex flex-col gap-[10px]">
        <div className="flex items-center gap-[14px]">
          <p className="text-[18px] font-medium text-[#1b1b1b]">
            {school.name}
          </p>
          {school.verified && (
            <div className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full bg-[#1ca95c] text-[9px] font-bold text-white">
              ✓
            </div>
          )}
        </div>
        <div className="flex flex-col gap-[7px]">
          {[
            { Icon: MapPin, text: school.location },
            { Icon: BookOpen, text: school.type },
            {
              Icon: Banknote,
              text: `Application fee: ₦${school.applicationFee.toLocaleString()}`,
            },
            { Icon: Star, text: school.rating },
          ].map(({ Icon, text }) => (
            <div key={text} className="flex items-start gap-[7px]">
              <Icon className="mt-px h-[13px] w-[13px] shrink-0 text-[#444]" />
              <p className="text-[14px] text-[#444]">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-[10px]">
        <button
          type="button"
          onClick={() => onApply(school)}
          className="flex h-[34px] w-[138px] items-center justify-center rounded-[5px] bg-[#1ca95c] text-[12px] text-white transition-opacity hover:opacity-90"
        >
          Apply now
        </button>
        <button
          type="button"
          className="flex h-[34px] w-[149px] items-center justify-center rounded-[5px] border border-[#1ca95c] text-[12px] text-[#1ca95c] transition-opacity hover:opacity-80"
        >
          View more details
        </button>
      </div>
    </div>
  );
}
