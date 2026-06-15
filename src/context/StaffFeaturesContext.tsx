"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import { getMyStaffProfile, getMySchools } from "@/src/lib/api/staffProfile";
import type {
  MyStaffProfile,
  StaffSchoolEntry,
} from "@/src/lib/api/staffProfile";
import { DEFAULT_FEATURES } from "@/src/types/staffFeatures";
import type { StaffFeatures } from "@/src/types/staffFeatures";

export const STAFF_TEST_USER_KEY = "staff_test_user_id";
export const STAFF_ACTIVE_SCHOOL_KEY = "staff_active_school_id";

interface Value {
  features: StaffFeatures;
  profile: MyStaffProfile | null;
  loading: boolean;
  mySchools: StaffSchoolEntry[];
  activeSchoolId: string | null;
  isPartTime: boolean;
  switchSchool: (schoolId: string) => void;
}

export const StaffFeaturesContext = createContext<Value>({
  features: DEFAULT_FEATURES,
  profile: null,
  loading: true,
  mySchools: [],
  activeSchoolId: null,
  isPartTime: false,
  switchSchool: () => {},
});

export function StaffFeaturesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();

  const [profile, setProfile] = useState<MyStaffProfile | null>(null);
  const [mySchools, setMySchools] = useState<StaffSchoolEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [testUserId] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem(STAFF_TEST_USER_KEY)
      : null
  );
  const [activeSchoolId, setActiveSchoolId] = useState<string | null>(() =>
    typeof window !== "undefined"
      ? localStorage.getItem(STAFF_ACTIVE_SCHOOL_KEY)
      : null
  );

  const effectiveUserId = testUserId ?? user?.id;

  // Load the list of schools this user belongs to.
  useEffect(() => {
    if (!effectiveUserId) return;
    getMySchools(effectiveUserId).then(setMySchools);
  }, [effectiveUserId]);

  // Load the staff profile for the currently active school.
  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    getMyStaffProfile(effectiveUserId, activeSchoolId).then((p) => {
      if (cancelled) return;
      setProfile(p);
      setLoading(false);
      if (p?.isSchoolAdmin) router.replace("/school/dashboard");
    });
    return () => {
      cancelled = true;
    };
  }, [effectiveUserId, activeSchoolId, router]);

  const switchSchool = useCallback((schoolId: string) => {
    localStorage.setItem(STAFF_ACTIVE_SCHOOL_KEY, schoolId);
    setActiveSchoolId(schoolId);
  }, []);

  const isPartTime = mySchools.length > 1;

  return (
    <StaffFeaturesContext.Provider
      value={{
        features: profile?.features ?? DEFAULT_FEATURES,
        profile,
        loading,
        mySchools,
        activeSchoolId: profile?.staff.schoolId ?? activeSchoolId,
        isPartTime,
        switchSchool,
      }}
    >
      {children}
    </StaffFeaturesContext.Provider>
  );
}

export function useStaffFeatures() {
  return useContext(StaffFeaturesContext);
}
