"use client";

import { useEffect, useState } from "react";
import {
  Search,
  MapPin,
  BookOpen,
  Banknote,
  Star,
  ChevronDown,
  ChevronUp,
  Check,
} from "lucide-react";
import { searchSchools } from "@/src/lib/api/schools";
import type { SchoolListing } from "@/src/types/school";
import WhoToEnrolModal from "./WhoToEnrolModal";

// ─── filter config ────────────────────────────────────────────────────────────

type FilterKey = "location" | "type" | "fees";

const FILTER_OPTIONS: Record<FilterKey, string[]> = {
  location: ["Lagos", "Abuja", "Kaduna", "Ibadan"],
  type: ["Nursery", "Primary", "Secondary"],
  fees: ["₦10–₦50k", "₦60k–₦100k", "₦110k–₦150k", "₦160k–₦200k"],
};

const FILTER_LABELS: Record<FilterKey, string> = {
  location: "Filter by location",
  type: "Filter by school type",
  fees: "Filter by school fees",
};

const STEPS = ["Step 1", "Step 2", "Step 3", "Step 4"];
const FILTER_KEYS: FilterKey[] = ["location", "type", "fees"];

// ─── filter chip ──────────────────────────────────────────────────────────────

function FilterChip({
  label,
  selected,
  onToggle,
}: {
  label: string;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex h-[30px] items-center gap-[6px] rounded-[10px] border px-[10px] text-[14px] text-[#1b1b1b] transition-colors whitespace-nowrap ${
        selected
          ? "border-[#1ca95c] bg-[#daffeb]"
          : "border-[#ccc] hover:border-[#aaa]"
      }`}
    >
      {selected ? (
        <div className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#1ca95c]">
          <Check className="h-[10px] w-[10px] text-white" strokeWidth={3} />
        </div>
      ) : (
        <div className="h-[18px] w-[18px] shrink-0 rounded-full border border-[#ccc]" />
      )}
      {label}
    </button>
  );
}

// ─── school card ──────────────────────────────────────────────────────────────

function SchoolCard({
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
          <div className="flex items-start gap-[7px]">
            <MapPin className="mt-px h-[13px] w-[13px] shrink-0 text-[#444]" />
            <p className="text-[14px] text-[#444]">{school.location}</p>
          </div>
          <div className="flex items-start gap-[7px]">
            <BookOpen className="mt-px h-[13px] w-[13px] shrink-0 text-[#444]" />
            <p className="text-[14px] text-[#444]">{school.type}</p>
          </div>
          <div className="flex items-start gap-[7px]">
            <Banknote className="mt-px h-[13px] w-[13px] shrink-0 text-[#444]" />
            <p className="text-[14px] text-[#444]">
              Application fee: ₦{school.applicationFee.toLocaleString()}
            </p>
          </div>
          <div className="flex items-start gap-[7px]">
            <Star className="mt-px h-[13px] w-[13px] shrink-0 text-[#444]" />
            <p className="text-[14px] text-[#444]">{school.rating}</p>
          </div>
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

// ─── school grid ──────────────────────────────────────────────────────────────

function SchoolGrid({
  schools,
  onApply,
}: {
  schools: SchoolListing[];
  onApply: (school: SchoolListing) => void;
}) {
  if (schools.length === 0) {
    return (
      <p className="text-[14px] text-[#888]">No schools match your filters.</p>
    );
  }
  const rows: SchoolListing[][] = [];
  for (let i = 0; i < schools.length; i += 3)
    rows.push(schools.slice(i, i + 3));
  return (
    <div className="flex flex-col gap-[19px]">
      {rows.map((row, i) => (
        <div key={i} className="flex gap-[20px]">
          {row.map((s) => (
            <SchoolCard key={s.id} school={s} onApply={onApply} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── main ─────────────────────────────────────────────────────────────────────

export default function EnrolStep1() {
  const [allSchools, setAllSchools] = useState<SchoolListing[]>([]);
  const [query, setQuery] = useState("");
  const [openFilters, setOpenFilters] = useState<Set<FilterKey>>(new Set());
  const [selected, setSelected] = useState<Record<FilterKey, string[]>>({
    location: [],
    type: [],
    fees: [],
  });
  const [selectedSchool, setSelectedSchool] = useState<SchoolListing | null>(
    null
  );

  useEffect(() => {
    searchSchools().then(setAllSchools);
  }, []);

  const togglePanel = (key: FilterKey) => {
    setOpenFilters((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  const toggleOption = (key: FilterKey, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const applyFilters = (schools: SchoolListing[]): SchoolListing[] =>
    schools.filter((school) => {
      const locOk =
        selected.location.length === 0 ||
        selected.location.some((loc) => school.location.includes(loc));
      const typeOk =
        selected.type.length === 0 ||
        selected.type.some((t) => school.type.includes(t));
      const queryOk =
        !query.trim() ||
        school.name.toLowerCase().includes(query.toLowerCase()) ||
        school.location.toLowerCase().includes(query.toLowerCase());
      return locOk && typeOk && queryOk;
    });

  const recommended = applyFilters(allSchools.filter((s) => s.isRecommended));
  const others = applyFilters(allSchools.filter((s) => !s.isRecommended));

  return (
    <>
      <div className="px-[88px] py-[31px] pb-[60px]">
        <div className="flex flex-col gap-[24px]">
          <h1 className="text-[24px] font-medium text-[#1b1b1b]">
            Enrol your child
          </h1>

          <div className="flex items-center gap-[5px]">
            {STEPS.map((step, i) => (
              <div key={step} className="flex w-[213px] flex-col gap-[7px]">
                <p
                  className={`text-[12px] ${i === 0 ? "text-[#1b1b1b]" : "text-[#aaa]"}`}
                >
                  {step}
                </p>
                <div
                  className={`h-[6px] rounded-[5px] ${i === 0 ? "bg-[#1ca95c]" : "bg-[#eee]"}`}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-[14px]">
            <p className="text-[20px] font-normal text-[#1b1b1b]">
              Choose a school
            </p>
            <div className="flex h-[46px] w-[447px] items-center gap-[15px] rounded-[10px] border border-[#ccc] px-[17px]">
              <Search className="h-[20px] w-[20px] shrink-0 text-[#aaa]" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search school by name or location"
                className="flex-1 bg-transparent text-[14px] text-[#1b1b1b] outline-none placeholder:text-[#aaa]"
              />
            </div>
          </div>
        </div>

        <div className="mt-[18px] flex gap-[23px]">
          {FILTER_KEYS.map((key) => {
            const isOpen = openFilters.has(key);
            const count = selected[key].length;
            return (
              <div key={key} className="flex w-[327px] flex-col gap-[11px]">
                <button
                  type="button"
                  onClick={() => togglePanel(key)}
                  className="flex w-full flex-col gap-[6px] text-left"
                >
                  <div className="flex w-full items-center justify-between">
                    <span
                      className={`text-[14px] transition-colors ${
                        count > 0 ? "font-medium text-[#1ca95c]" : "text-[#888]"
                      }`}
                    >
                      {FILTER_LABELS[key]}
                      {count > 0 && ` (${count})`}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-[18px] w-[18px] text-[#888]" />
                    ) : (
                      <ChevronDown className="h-[18px] w-[18px] text-[#888]" />
                    )}
                  </div>
                  <div className="h-px w-full bg-[#ccc]" />
                </button>

                {isOpen && (
                  <div className="flex flex-wrap gap-[8px]">
                    {FILTER_OPTIONS[key].map((opt) => (
                      <FilterChip
                        key={opt}
                        label={opt}
                        selected={selected[key].includes(opt)}
                        onToggle={() => toggleOption(key, opt)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-[31px] flex flex-col gap-[15px]">
          <p className="text-[16px] font-normal text-[#666]">
            Most recommended
          </p>
          <SchoolGrid schools={recommended} onApply={setSelectedSchool} />
        </div>

        <div className="mt-[31px] flex flex-col gap-[15px]">
          <p className="text-[16px] font-normal text-[#666]">Others</p>
          <SchoolGrid schools={others} onApply={setSelectedSchool} />
        </div>
      </div>

      {selectedSchool && (
        <WhoToEnrolModal
          school={selectedSchool}
          onClose={() => setSelectedSchool(null)}
        />
      )}
    </>
  );
}
