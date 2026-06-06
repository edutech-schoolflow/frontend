import Image from "next/image";
import { UserRound } from "lucide-react";
import type { ChildProfile } from "@/src/types/parent";

export default function ChildAvatar({ child }: { child: ChildProfile }) {
  const initials = [child.firstName, child.lastName]
    .filter(Boolean)
    .map((n) => n![0])
    .join("");
  return child.photoUrl ? (
    <Image
      src={child.photoUrl}
      alt={child.firstName}
      width={28}
      height={28}
      className="rounded-full object-cover"
    />
  ) : (
    <div className="flex h-[28px] w-[28px] items-center justify-center rounded-full bg-[#e8f5ee] text-[11px] font-medium text-[#1ca95c]">
      {initials || <UserRound className="h-[14px] w-[14px]" />}
    </div>
  );
}
