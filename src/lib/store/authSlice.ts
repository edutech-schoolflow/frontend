import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** The authenticated school-owner account (mapped from GET /school/auth/me). */
export interface SchoolUser {
  fullName: string;
  phone: string;
  email?: string | null;
  phoneVerified: boolean;
  schoolId: string;
  schoolStatus: string;
  kycStatus: string;
  subdomain?: string | null;
  isOwner: true;
}

interface AuthState {
  user: SchoolUser | null;
  /** idle until the first /me probe resolves — guards wait on this. */
  status: "idle" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = { user: null, status: "idle" };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSchoolUser(state, action: PayloadAction<SchoolUser>) {
      state.user = action.payload;
      state.status = "authenticated";
    },
    clearAuth(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setSchoolUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
