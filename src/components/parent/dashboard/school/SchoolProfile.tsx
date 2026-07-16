"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin, Phone, Mail } from "lucide-react";
import {
  getSchoolById,
  type SchoolPublicProfile,
} from "@/src/lib/api/parentSchools";
import type { SchoolListing } from "@/src/types/school";
import WhoToEnrolModal from "@/src/components/parent/dashboard/enrol/WhoToEnrolModal";

/** The school's PUBLIC profile — everything real, nothing invented (no fake ratings). */
export default function SchoolProfile() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [school, setSchool] = useState<SchoolPublicProfile | null | undefined>(
    undefined
  );
  const [showEnrol, setShowEnrol] = useState(false);

  useEffect(() => {
    getSchoolById(id).then((s) => setSchool(s ?? null));
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

  const types = (school.type ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  // What the enrol modal needs (id + name); the listing shape is its contract.
  const asListing: SchoolListing = {
    id: school.id,
    name: school.name,
    location: school.location ?? "",
    type: school.type ?? "",
    applicationFee: school.applicationFee,
    rating: "—",
    verified: school.verified,
    isRecommended: false,
  };

  return (
    <>
      {showEnrol && (
        <WhoToEnrolModal school={asListing} onClose={() => setShowEnrol(false)} />
      )}

      <div className="px-[88px] py-[31px] pb-[60px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-[24px] flex items-center gap-[8px] text-[14px] text-[#666] transition-colors hover:text-[#1b1b1b]"
        >
          <ArrowLeft className="h-[16px] w-[16px]" />
          Back to search
        </button>

        <div className="rounded-[10px] border border-[#e0e0e0] bg-white p-[32px]">
          {/* School header */}
          <div className="flex items-start gap-[20px]">
            {school.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={school.logoUrl}
                alt={school.name}
                className="h-[72px] w-[72px] shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#e8f8ef] text-[36px]">
                🏫
              </div>
            )}
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
              {school.location && (
                <p className="mt-[4px] text-[14px] text-[#888]">
                  {school.location}
                </p>
              )}
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

          <div className="my-[28px] h-px bg-[#f0f0f0]" />

          {/* Stats row — real numbers only */}
          <div className="grid grid-cols-3 gap-[20px]">
            <StatBox
              label="Application Fee"
              value={`₦${school.applicationFee.toLocaleString()}`}
            />
            <StatBox label="Classes Offered" value={String(school.classes.length)} />
            <StatBox
              label="Verification"
              value={school.verified ? "✓ Verified" : "Pending"}
            />
          </div>

          {/* Classes offered */}
          {school.classes.length > 0 && (
            <div className="mt-[24px]">
              <p className="text-[13px] font-medium uppercase tracking-[0.04em] text-[#888]">
                Classes offered
              </p>
              <div className="mt-[10px] flex flex-wrap gap-[8px]">
                {school.classes.map((c) => (
                  <span
                    key={c.name}
                    className="rounded-full border border-[#e0e0e0] px-[12px] py-[4px] text-[12px] text-[#555]"
                  >
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact */}
          {(school.address || school.phone || school.email) && (
            <div className="mt-[24px]">
              <p className="text-[13px] font-medium uppercase tracking-[0.04em] text-[#888]">
                Contact
              </p>
              <div className="mt-[10px] flex flex-col gap-[8px] text-[14px] text-[#555]">
                {school.address && (
                  <p className="flex items-center gap-[8px]">
                    <MapPin className="h-[15px] w-[15px] text-[#1ca95c]" />
                    {school.address}
                  </p>
                )}
                {school.phone && (
                  <p className="flex items-center gap-[8px]">
                    <Phone className="h-[15px] w-[15px] text-[#1ca95c]" />
                    {school.phone}
                  </p>
                )}
                {school.email && (
                  <p className="flex items-center gap-[8px]">
                    <Mail className="h-[15px] w-[15px] text-[#1ca95c]" />
                    {school.email}
                  </p>
                )}
              </div>
            </div>
          )}

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
