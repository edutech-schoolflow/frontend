"use client";

import { useMemo } from "react";
import { useIdentity } from "@/src/lib/api/useIdentity";
import { useWorkspace } from "@/src/context/WorkspaceContext";
import { StaffFeaturesContext } from "@/src/context/StaffFeaturesContext";
import { SCHOOL_OWNER_FEATURES } from "@/src/types/staffFeatures";
import StoreContent from "@/src/views/staff/store/page";
import type { MyStaffProfile } from "@/src/lib/api/staffProfile";

export default function SchoolStorePage() {
  const { data: me } = useIdentity();
  const ws = useWorkspace();

  const mockProfile = useMemo<MyStaffProfile | null>(() => {
    if (!me) return null;
    const parts = me.fullName.trim().split(" ");
    return {
      staff: {
        id: ws.myContext.id,
        schoolId: ws.organizationId,
        firstName: parts[0] ?? "",
        lastName: parts.slice(1).join(" "),
        email: me.email ?? "",
        phone: "",
        role: "school_admin",
        position: "School Owner",
        status: "active",
        createdAt: new Date().toISOString(),
        isOwner: true,
      },
      features: SCHOOL_OWNER_FEATURES,
      isSchoolAdmin: true,
    };
  }, [me, ws]);

  const ctx = useMemo(
    () => ({
      features: SCHOOL_OWNER_FEATURES,
      profile: mockProfile,
      loading: false,
      mySchools: [],
      activeSchoolId: ws.organizationId ?? null,
      isPartTime: false,
      switchSchool: () => {},
    }),
    [mockProfile, ws.organizationId]
  );

  return (
    <StaffFeaturesContext.Provider value={ctx}>
      <StoreContent />
    </StaffFeaturesContext.Provider>
  );
}
