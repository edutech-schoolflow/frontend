"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStaffWithPermissions } from "@/src/lib/api/staffProfile";
import { STAFF_TEST_USER_KEY } from "@/src/context/StaffFeaturesContext";
import { FEATURE_LABELS } from "@/src/types/staffFeatures";
import type { StaffWithPermissions } from "@/src/lib/api/staffProfile";
import type { StaffFeatures } from "@/src/types/staffFeatures";
import type { TeacherAssignment } from "@/src/types/school";

const ROLE_LABELS: Record<string, string> = {
  teacher: "Teacher",
  principal: "Principal",
  vice_principal: "Vice Principal",
  bursar: "Bursar",
  registrar: "Registrar",
  school_admin: "School Admin",
  super_admin: "Super Admin",
};

function enabledCount(f: StaffFeatures) {
  return (Object.values(f) as boolean[]).filter(Boolean).length;
}

function AssignmentSummary({
  assignments,
}: {
  assignments?: TeacherAssignment[];
}) {
  if (!assignments?.length) return null;
  return (
    <div className="mt-2 flex flex-col gap-1">
      {assignments.map((a, i) => (
        <span key={i} className="text-[11px] text-[#6b7280]">
          {a.type === "class_teacher" ? "Class teacher" : "Subject teacher"} —{" "}
          <span className="font-medium text-text-heading">{a.armName}</span>
          {a.subjects.length > 0 && (
            <span className="text-[#9ca3af]"> ({a.subjects.join(", ")})</span>
          )}
        </span>
      ))}
    </div>
  );
}

function ActiveBadge({ userId }: { userId: string }) {
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(localStorage.getItem(STAFF_TEST_USER_KEY) === userId);
  }, [userId]);
  if (!active) return null;
  return (
    <span className="ml-2 rounded-full bg-brand-green px-2 py-0.5 text-[11px] font-medium text-white">
      Active
    </span>
  );
}

export default function StaffTestLoginPage() {
  const router = useRouter();
  const [list, setList] = useState<StaffWithPermissions[]>([]);
  // Always null on first render (server + client hydration), then set client-side.
  // Lazy initializer with typeof window would cause SSR/client HTML mismatch.
  const [currentId, setCurrentId] = useState<string | null>(null);

  useEffect(() => {
    getStaffWithPermissions().then((staff) => {
      setList(staff);
      setCurrentId(localStorage.getItem(STAFF_TEST_USER_KEY));
    });
  }, []);

  function loginAs(userId: string) {
    localStorage.setItem(STAFF_TEST_USER_KEY, userId);
    setCurrentId(userId);
    router.push("/select-context");
  }

  function clearSession() {
    localStorage.removeItem(STAFF_TEST_USER_KEY);
    setCurrentId(null);
  }

  return (
    <div className="min-h-screen bg-[#f9fafb] p-8">
      <div className="mx-auto max-w-[680px]">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-[22px] font-semibold text-text-heading">
            Staff test logins
          </h1>
          <p className="mt-1 text-[14px] text-text-body">
            Switch between staff accounts to test different permission sets.
            Changes made to permissions from the school settings page are
            reflected here in real time.
          </p>
        </div>

        {/* Current session banner */}
        {currentId && (
          <div className="mt-4 mb-6 flex items-center justify-between rounded-[10px] border border-[#d1fae5] bg-[#f0fdf4] px-4 py-3">
            <p className="text-[13px] text-[#15803d]">
              Test session active —{" "}
              <span className="font-semibold">
                {
                  list.find((x) => x.staff.userId === currentId)?.staff
                    .firstName
                }{" "}
                {list.find((x) => x.staff.userId === currentId)?.staff.lastName}
              </span>
            </p>
            <button
              onClick={clearSession}
              className="text-[12px] font-medium text-[#dc2626] hover:underline"
            >
              Clear session
            </button>
          </div>
        )}

        {/* Staff list */}
        <div className="flex flex-col gap-3">
          {list.map(({ staff, features }) => {
            const initials = `${staff.firstName[0]}${staff.lastName[0]}`;
            const enabled = enabledCount(features);
            const total = Object.keys(FEATURE_LABELS).length;
            const isActive = staff.userId === currentId;

            return (
              <div
                key={staff.id}
                className={`rounded-[12px] border bg-white p-4 transition-shadow ${
                  isActive ? "border-brand-green shadow-sm" : "border-[#e5e7eb]"
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-full bg-[#e8f5ee] text-[13px] font-bold text-brand-green">
                    {initials}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <p className="text-[14px] font-semibold text-text-heading">
                        {staff.firstName} {staff.lastName}
                      </p>
                      <ActiveBadge userId={staff.userId!} />
                    </div>
                    <p className="text-[12px] text-text-body">{staff.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-2.5 py-0.5 text-[11px] font-medium text-text-body">
                        {ROLE_LABELS[staff.role] ?? staff.role}
                      </span>
                      <span className="rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-2.5 py-0.5 text-[11px] text-text-body">
                        {enabled}/{total} features enabled
                      </span>
                    </div>

                    <AssignmentSummary assignments={staff.assignments} />

                    {/* Enabled features */}
                    {enabled > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {(
                          Object.entries(features) as [
                            keyof StaffFeatures,
                            boolean,
                          ][]
                        )
                          .filter(([, v]) => v)
                          .map(([k]) => (
                            <span
                              key={k}
                              className="rounded-full bg-[#f0fdf4] px-2 py-0.5 text-[10px] text-[#15803d]"
                            >
                              {FEATURE_LABELS[k]}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Login button */}
                  <button
                    onClick={() => loginAs(staff.userId!)}
                    disabled={isActive}
                    className={`shrink-0 rounded-[8px] px-4 py-2 text-[13px] font-medium transition-colors ${
                      isActive
                        ? "bg-[#f3f4f6] text-text-body cursor-default"
                        : "bg-brand-green text-white hover:bg-[#17904f]"
                    }`}
                  >
                    {isActive ? "Active" : "Log in as"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-[12px] text-text-body">
          To change what each person can access, go to{" "}
          <a
            href="/select-context"
            className="text-brand-green hover:underline"
          >
            School Settings → Staff Permissions
          </a>
          .
        </p>
      </div>
    </div>
  );
}
