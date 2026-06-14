"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import { getTeacherSchools } from "@/src/lib/api/teacherSchools";
import { useAuth } from "@/src/context/AuthContext";
import type { TeacherSchoolAffiliation } from "@/src/lib/api/teacherSchools";

const STATUS_STYLES: Record<
  TeacherSchoolAffiliation["status"],
  { label: string; color: string; bg: string }
> = {
  active: { label: "Active", color: "#16a34a", bg: "#f0fdf4" },
  invited: { label: "Invite pending", color: "#d97706", bg: "#fffbeb" },
  resigned: { label: "Resigned", color: "#6b7280", bg: "#f3f4f6" },
};

function AffiliationCard({
  affiliation,
}: {
  affiliation: TeacherSchoolAffiliation;
}) {
  const st = STATUS_STYLES[affiliation.status];

  return (
    <div className="rounded-[14px] border border-[#e5e7eb] bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        {/* School logo / initials */}
        <div className="flex items-start gap-4">
          <div className="flex h-[50px] w-[50px] shrink-0 items-center justify-center rounded-[12px] bg-[#f0fdf4]">
            <Building2 className="h-[24px] w-[24px] text-brand-green" />
          </div>
          <div>
            <p className="text-[17px] font-semibold text-text-heading">
              {affiliation.schoolName}
            </p>
            <p className="mt-0.5 text-[13px] text-text-body">
              {affiliation.position}
            </p>
          </div>
        </div>

        <span
          className="shrink-0 rounded-full px-3 py-1 text-[12px] font-semibold"
          style={{ color: st.color, backgroundColor: st.bg }}
        >
          {st.label}
        </span>
      </div>

      {/* Details grid */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {affiliation.address && (
          <div className="flex items-start gap-2 text-[13px] text-text-body">
            <MapPin className="mt-0.5 h-[14px] w-[14px] shrink-0 text-[#9ca3af]" />
            <span>{affiliation.address}</span>
          </div>
        )}
        {affiliation.phone && (
          <div className="flex items-center gap-2 text-[13px] text-text-body">
            <Phone className="h-[14px] w-[14px] shrink-0 text-[#9ca3af]" />
            <span>{affiliation.phone}</span>
          </div>
        )}
        {affiliation.email && (
          <div className="flex items-center gap-2 text-[13px] text-text-body">
            <Mail className="h-[14px] w-[14px] shrink-0 text-[#9ca3af]" />
            <span>{affiliation.email}</span>
          </div>
        )}
        {affiliation.assignedArms.length > 0 && (
          <div className="flex items-start gap-2 text-[13px] text-text-body">
            <BookOpen className="mt-0.5 h-[14px] w-[14px] shrink-0 text-[#9ca3af]" />
            <span>{affiliation.assignedArms.join(", ")}</span>
          </div>
        )}
      </div>

      {/* Invite actions */}
      {affiliation.status === "invited" && (
        <div className="mt-5 flex gap-3 border-t border-[#f3f4f6] pt-5">
          <button className="flex-1 rounded-[8px] bg-brand-green py-2.5 text-[14px] font-medium text-white hover:opacity-90 transition-opacity">
            Accept invitation
          </button>
          <button className="flex-1 rounded-[8px] border border-[#e5e7eb] py-2.5 text-[14px] font-medium text-text-body hover:border-[#dc2626] hover:text-[#dc2626] transition-colors">
            Decline
          </button>
        </div>
      )}

      {/* Compliance note */}
      {affiliation.status === "active" && affiliation.complianceVerified && (
        <div className="mt-4 flex items-center gap-2 rounded-[10px] border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-2.5">
          <ShieldCheck className="h-[14px] w-[14px] shrink-0 text-brand-green" />
          <p className="text-[12px] text-[#15803d]">
            Compliance verified for this school
          </p>
        </div>
      )}
    </div>
  );
}

export default function TeacherSchoolsPage() {
  const { user } = useAuth();
  const [affiliations, setAffiliations] = useState<TeacherSchoolAffiliation[]>(
    []
  );
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getTeacherSchools(user?.id).then((data) => {
      if (!cancelled) {
        setAffiliations(data);
        setLoaded(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  const active = affiliations.filter((a) => a.status === "active");
  const invited = affiliations.filter((a) => a.status === "invited");
  const resigned = affiliations.filter((a) => a.status === "resigned");

  if (!loaded) {
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
          Schools you are affiliated with and pending invitations.
        </p>
      </div>

      {affiliations.length === 0 ? (
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
        <div className="flex flex-col gap-6">
          {invited.length > 0 && (
            <section>
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-text-body">
                Pending invitations ({invited.length})
              </p>
              <div className="flex flex-col gap-4">
                {invited.map((a) => (
                  <AffiliationCard key={a.schoolId} affiliation={a} />
                ))}
              </div>
            </section>
          )}

          {active.length > 0 && (
            <section>
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-text-body">
                Active ({active.length})
              </p>
              <div className="flex flex-col gap-4">
                {active.map((a) => (
                  <AffiliationCard key={a.schoolId} affiliation={a} />
                ))}
              </div>
            </section>
          )}

          {resigned.length > 0 && (
            <section>
              <p className="mb-3 text-[13px] font-semibold uppercase tracking-wide text-text-body">
                Past schools ({resigned.length})
              </p>
              <div className="flex flex-col gap-4">
                {resigned.map((a) => (
                  <AffiliationCard key={a.schoolId} affiliation={a} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
