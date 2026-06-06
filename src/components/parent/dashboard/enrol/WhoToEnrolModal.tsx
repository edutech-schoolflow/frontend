"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X, UserRound } from "lucide-react";
import { getChildProfiles } from "@/src/lib/api/parents";
import type { SchoolListing } from "@/src/types/school";
import type { ChildProfile } from "@/src/types/parent";

export default function WhoToEnrolModal({
  school,
  onClose,
}: {
  school: SchoolListing;
  onClose: () => void;
}) {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);

  useEffect(() => {
    getChildProfiles().then(setProfiles);
  }, []);

  const handleSelect = (childId: string) => {
    router.push(
      `/parent/dashboard/enrol?childId=${childId}&schoolId=${school.id}`
    );
  };

  const handleNew = () => {
    router.push(`/parent/dashboard/enrol?schoolId=${school.id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-[500px] rounded-[12px] bg-white px-[32px] py-[32px]">
        {/* Header */}
        <div className="mb-[24px] flex items-center justify-between">
          <p className="text-[18px] font-medium text-[#1b1b1b]">
            Who do you want to enrol?
          </p>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[32px] w-[32px] items-center justify-center rounded-full transition-colors hover:bg-[#f5f5f5]"
          >
            <X className="h-[18px] w-[18px] text-[#666]" />
          </button>
        </div>

        {/* Child list */}
        <div className="flex flex-col gap-[10px]">
          {profiles.map((child) => {
            const fullName = [child.firstName, child.middleName, child.lastName]
              .filter(Boolean)
              .join(" ");
            return (
              <button
                key={child.id}
                type="button"
                onClick={() => handleSelect(child.id)}
                className="flex items-center gap-[14px] rounded-[8px] border border-[#e0e0e0] px-[16px] py-[12px] text-left transition-colors hover:border-[#1ca95c] hover:bg-[#f7fdf9]"
              >
                <div className="h-[40px] w-[40px] shrink-0 overflow-hidden rounded-full border border-[#eee] bg-[#f5f5f5]">
                  {child.photoUrl ? (
                    <img
                      src={child.photoUrl}
                      alt={fullName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <UserRound className="h-[20px] w-[20px] text-[#ccc]" />
                    </div>
                  )}
                </div>
                <p className="text-[15px] font-medium text-[#1b1b1b]">
                  {fullName}
                </p>
              </button>
            );
          })}
        </div>

        {/* Divider */}
        <p className="my-[20px] text-center text-[14px] text-[#888]">or</p>

        {/* New child */}
        <button
          type="button"
          onClick={handleNew}
          className="flex h-[54px] w-full items-center justify-center rounded-[8px] bg-[#1ca95c] text-[16px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Enrol a new child
        </button>
      </div>
    </div>
  );
}
