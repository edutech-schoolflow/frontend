"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { getToken, clearToken } from "@/src/lib/api/client";
import client from "@/src/lib/api/client";
import type { StaffRole } from "@/src/types/staff";

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
  const [isLoading, setIsLoading] = useState(() => !!getToken());

  useEffect(() => {
    const token = getToken();
    if (!token) {
      return;
    }
    client
      .get("/auth/me")
      .then(({ data }) => setUser(data))
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  const logout = () => {
    clearToken();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
