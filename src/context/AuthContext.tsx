"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { StaffRole } from "@/src/types/staff";

// NOTE: legacy in-memory auth for the not-yet-migrated portals (parent/staff still on mocks).
// The school portal has moved to Redux + TanStack Query against the real backend
// (see lib/store/authSlice + lib/api/useSchoolAuth). Migrate the others the same way.

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: StaffRole | "parent";
  schoolId?: string;
  subdomain?: string;
  isOwner?: boolean; // true only for the school account that registered on SchoolFlow
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  setUser: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const logout = () => {
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading: false, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
