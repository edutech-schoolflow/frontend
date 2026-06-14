"use client";

import { Building2, MapPin, Phone, Mail, CheckCircle2 } from "lucide-react";
import { useStaffFeatures } from "@/src/context/StaffFeaturesContext";
import { ROLE_LABELS } from "@/src/types/staff";
import type { StaffSchoolEntry } from "@/src/lib/api/staffProfile";

function SchoolCard({
  entry,
  isActive,
  isPartTime,
  onSwitch,
}: {
  entry: StaffSchoolEntry;
  isActive: boolean;
  isPartTime: boolean;
  onSwitch: () => void;
}) {
  const { staff, school } = entry;

  return (
    <div
      className={`rounded-[14px] border bg-white p-6 transition-shadow ${
        isActive ? "border-brand-green shadow-sm" : "border-[#e5e7eb]"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[12px] bg-[#f0fdf4]">
            <Building2 className="h-[24px] w-[24px] text-brand-green" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[17px] font-semibold text-text-heading">
                {school.name}
              </p>
              {isActive && (
                <span className="flex items-center gap-1 rounded-full bg-[#f0fdf4] px-2.5 py-0.5 text-[11px] font-medium text-brand-green">
                  <CheckCircle2 className="h-[11px] w-[11px]" />
                  Active
                </span>
              )}
            </div>
            <p className="mt-0.5 text-[13px] text-text-body">
              {staff.position} · {ROLE_LABELS[staff.role]}
            </p>
            {staff.employmentType === "part_time" && (
              <span className="mt-1.5 inline-block rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-[11px] font-medium text-[#2563eb]">
                Part-time
              </span>
            )}
          </div>
        </div>
      </div>

      {/* School details */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex items-start gap-2 text-[13px] text-text-body">
          <MapPin className="mt-0.5 h-[14px] w-[14px] shrink-0 text-[#9ca3af]" />
          <span>
            {school.address}, {school.city}, {school.state}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-text-body">
          <Phone className="h-[14px] w-[14px] shrink-0 text-[#9ca3af]" />
          <span>{school.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-[13px] text-text-body">
          <Mail className="h-[14px] w-[14px] shrink-0 text-[#9ca3af]" />
          <span>{school.email}</span>
        </div>
      </div>

      {/* Switch button for part-time */}
      {isPartTime && !isActive && (
        <div className="mt-5 border-t border-[#f3f4f6] pt-5">
          <button
            onClick={onSwitch}
            className="w-full rounded-[8px] bg-brand-green py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
          >
            Switch to {school.name}
          </button>
        </div>
      )}
    </div>
  );
}

export default function TeacherSchoolsPage() {
  const {
    mySchools: schools,
    activeSchoolId,
    isPartTime,
    switchSchool,
    loading,
  } = useStaffFeatures();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-[80px]">
        <div className="h-[32px] w-[32px] animate-spin rounded-full border-[3px] border-brand-green border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="p-[30px]">
      <div className="mb-6">
        <h1 className="text-[22px] font-semibold text-text-heading">
          My Schools
        </h1>
        <p className="mt-0.5 text-[14px] text-text-body">
          {isPartTime
            ? "You are a part-time staff member. Switch between schools to view each school's dashboard and features."
            : "The school you are currently affiliated with."}
        </p>
      </div>

      {schools.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#e5e7eb] py-[60px] text-center">
          <Building2 className="mb-3 h-[36px] w-[36px] text-[#d1d5db]" />
          <p className="text-[15px] font-medium text-text-heading">
            No school affiliations
          </p>
          <p className="mt-1 text-[13px] text-text-body">
            You are not currently affiliated with any school.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {schools.map((entry) => {
            const isActive =
              entry.school.id === activeSchoolId ||
              (!activeSchoolId && entry === schools[0]);
            return (
              <SchoolCard
                key={entry.staff.id}
                entry={entry}
                isActive={isActive}
                isPartTime={isPartTime}
                onSwitch={() => switchSchool(entry.school.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
