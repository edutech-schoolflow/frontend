"use client";

import { useMemo } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { StaffFeaturesContext } from "@/src/context/StaffFeaturesContext";
import { SCHOOL_OWNER_FEATURES } from "@/src/types/staffFeatures";
import StoreContent from "@/src/app/staff/dashboard/store/page";
import type { MyStaffProfile } from "@/src/lib/api/staffProfile";

export default function SchoolStorePage() {
  const { user } = useAuth();

  const mockProfile = useMemo<MyStaffProfile | null>(() => {
    if (!user) return null;
    const parts = user.name.trim().split(" ");
    return {
      staff: {
        id: user.id,
        schoolId: user.schoolId ?? "",
        firstName: parts[0] ?? "",
        lastName: parts.slice(1).join(" "),
        email: user.email ?? "",
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
  }, [user]);

  const ctx = useMemo(
    () => ({
      features: SCHOOL_OWNER_FEATURES,
      profile: mockProfile,
      loading: false,
      mySchools: [],
      activeSchoolId: user?.schoolId ?? null,
      isPartTime: false,
      switchSchool: () => {},
    }),
    [mockProfile, user?.schoolId]
  );

  return (
    <StaffFeaturesContext.Provider value={ctx}>
      <StoreContent />
    </StaffFeaturesContext.Provider>
  );
}
