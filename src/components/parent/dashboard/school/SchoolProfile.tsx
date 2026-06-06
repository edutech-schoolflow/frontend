"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getSchoolListingById } from "@/src/lib/api/schools";
import type { SchoolListing } from "@/src/types/school";
import WhoToEnrolModal from "@/src/components/parent/dashboard/enrol/WhoToEnrolModal";

export default function SchoolProfile() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [school, setSchool] = useState<SchoolListing | null | undefined>(
    undefined
  );
  const [showEnrol, setShowEnrol] = useState(false);

  useEffect(() => {
    getSchoolListingById(id).then((s) => setSchool(s ?? null));
  }, [id]);

  if (school === undefined) {
    return (
      <div className="flex justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-2 border-[#eee] border-t-[#1ca95c]" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="px-[88px] py-[60px]">
        <p className="text-[16px] text-[#888]">School not found.</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-[12px] text-[14px] text-[#1ca95c] underline"
        >
          Go back
        </button>
      </div>
    );
  }

  const types = school.type.split(",").map((t) => t.trim());
  const ratingNum = parseFloat(school.rating);
  const reviewMatch = school.rating.match(/\((\d+) reviews\)/);
  const reviewCount = reviewMatch ? reviewMatch[1] : null;

  return (
    <>
      {showEnrol && (
        <WhoToEnrolModal school={school} onClose={() => setShowEnrol(false)} />
      )}

      <div className="px-[88px] py-[31px] pb-[60px]">
        {/* Back */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-[24px] flex items-center gap-[8px] text-[14px] text-[#666] transition-colors hover:text-[#1b1b1b]"
        >
          <ArrowLeft className="h-[16px] w-[16px]" />
          Back to search
        </button>

        {/* Main card */}
        <div className="rounded-[10px] border border-[#e0e0e0] bg-white p-[32px]">
          {/* School header */}
          <div className="flex items-start gap-[20px]">
            <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#e8f8ef] text-[36px]">
              🏫
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-[10px]">
                <h1 className="text-[24px] font-medium text-[#1b1b1b]">
                  {school.name}
                </h1>
                {school.verified && (
                  <span className="rounded-full bg-[#e8f8ef] px-[10px] py-[3px] text-[12px] font-medium text-[#1ca95c]">
                    ✓ Verified
                  </span>
                )}
              </div>
              <p className="mt-[4px] text-[14px] text-[#888]">
                {school.location}
              </p>
              <div className="mt-[10px] flex flex-wrap gap-[8px]">
                {types.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-[#f5f5f5] px-[12px] py-[4px] text-[12px] text-[#555]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="my-[28px] h-px bg-[#f0f0f0]" />

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-[20px]">
            <StatBox
              label="Rating"
              value={
                <span>
                  <span className="text-yellow-500">★</span>{" "}
                  {isNaN(ratingNum) ? school.rating : ratingNum.toFixed(1)}
                  {reviewCount && (
                    <span className="ml-[4px] text-[12px] text-[#aaa]">
                      ({reviewCount} reviews)
                    </span>
                  )}
                </span>
              }
            />
            <StatBox
              label="Application Fee"
              value={`₦${school.applicationFee.toLocaleString()}`}
            />
            <StatBox label="Levels Offered" value={school.type} />
          </div>

          {/* Enrol button */}
          <button
            type="button"
            onClick={() => setShowEnrol(true)}
            className="mt-[32px] flex h-[54px] w-full items-center justify-center rounded-[6px] bg-[#1ca95c] text-[16px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Enrol my child here
          </button>
        </div>
      </div>
    </>
  );
}

function StatBox({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-[8px] bg-[#f9f9f9] px-[20px] py-[16px]">
      <p className="text-[12px] text-[#888]">{label}</p>
      <p className="mt-[6px] text-[15px] font-medium text-[#1b1b1b]">{value}</p>
    </div>
  );
}
