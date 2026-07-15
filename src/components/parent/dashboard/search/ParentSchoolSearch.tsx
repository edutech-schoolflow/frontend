"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { searchSchools } from "@/src/lib/api/parentSchools";
import type { SchoolListing } from "@/src/types/school";
import WhoToEnrolModal from "@/src/components/parent/dashboard/enrol/WhoToEnrolModal";
import SchoolCard from "./SchoolCard";

const TYPE_FILTERS = ["Nursery", "Primary", "Secondary"];

export default function ParentSchoolSearch() {
  const [schools, setSchools] = useState<SchoolListing[] | undefined>(
    undefined
  );
  const [query, setQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [enrollSchool, setEnrollSchool] = useState<SchoolListing | null>(null);

  useEffect(() => {
    searchSchools().then(setSchools);
  }, []);

  const filtered = useMemo(() => {
    if (!schools) return [];
    const q = query.trim().toLowerCase();
    return schools.filter((s) => {
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q);
      const matchesType =
        selectedTypes.length === 0 ||
        selectedTypes.some((t) =>
          s.type.toLowerCase().includes(t.toLowerCase())
        );
      const matchesVerified = !verifiedOnly || s.verified;
      return matchesQuery && matchesType && matchesVerified;
    });
  }, [schools, query, selectedTypes, verifiedOnly]);

  const toggleType = (t: string) =>
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );

  return (
    <>
      {enrollSchool && (
        <WhoToEnrolModal
          school={enrollSchool}
          onClose={() => setEnrollSchool(null)}
        />
      )}

      <div className="px-[88px] py-[31px] pb-[60px]">
        <div className="mb-[28px]">
          <h1 className="text-[24px] font-medium text-[#1b1b1b]">
            Find a School
          </h1>
          <p className="mt-[6px] text-[14px] text-[#666]">
            Search and filter schools to find the right fit for your child.
          </p>
        </div>

        <div className="mb-[14px] flex h-[46px] items-center gap-[10px] rounded-[10px] border border-[#ccc] bg-white px-[14px]">
          <Search className="h-[16px] w-[16px] shrink-0 text-[#aaa]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by school name or location…"
            className="flex-1 text-[14px] text-[#1b1b1b] outline-none placeholder:text-[#aaa]"
          />
        </div>

        <div className="mb-[24px] flex items-center gap-[10px]">
          <span className="text-[13px] text-[#666]">Type:</span>
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleType(t)}
              className={`rounded-full px-[14px] py-[5px] text-[13px] transition-colors ${
                selectedTypes.includes(t)
                  ? "bg-[#1ca95c] text-white"
                  : "border border-[#ccc] text-[#555] hover:border-[#1ca95c] hover:text-[#1ca95c]"
              }`}
            >
              {t}
            </button>
          ))}
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => setVerifiedOnly((v) => !v)}
              className="flex items-center gap-[8px]"
            >
              <div
                className={`relative h-[20px] w-[36px] rounded-full transition-colors ${verifiedOnly ? "bg-[#1ca95c]" : "bg-[#ccc]"}`}
              >
                <div
                  className={`absolute top-[2px] h-[16px] w-[16px] rounded-full bg-white shadow transition-transform ${verifiedOnly ? "translate-x-[18px]" : "translate-x-[2px]"}`}
                />
              </div>
              <span className="text-[13px] text-[#555]">Verified only</span>
            </button>
          </div>
        </div>

        {schools !== undefined && (
          <p className="mb-[16px] text-[13px] text-[#888]">
            {filtered.length} school{filtered.length !== 1 ? "s" : ""} found
          </p>
        )}

        {schools === undefined && (
          <div className="flex justify-center py-[60px]">
            <div className="h-[32px] w-[32px] animate-spin rounded-full border-2 border-[#eee] border-t-[#1ca95c]" />
          </div>
        )}

        {schools !== undefined && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-[12px] py-[60px]">
            <p className="text-[16px] font-medium text-[#1b1b1b]">
              No schools found
            </p>
            <p className="text-[14px] text-[#888]">
              Try adjusting your search or filters.
            </p>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="grid grid-cols-3 gap-[20px]">
            {filtered.map((school) => (
              <SchoolCard
                key={school.id}
                school={school}
                onEnrol={() => setEnrollSchool(school)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
