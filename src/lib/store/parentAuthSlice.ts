import { createSlice, PayloadAction } from "@reduxjs/toolkit";

/** The authenticated parent account (mapped from GET /parent/auth/me). */
export interface ParentUser {
  fullName: string;
  phone: string;
  email?: string | null;
  phoneVerified: boolean;
  hasPaymentPin: boolean;
}

interface ParentAuthState {
  user: ParentUser | null;
  /** idle until the first /me probe resolves — guards wait on this. */
  status: "idle" | "authenticated" | "unauthenticated";
}

const initialState: ParentAuthState = { user: null, status: "idle" };

const parentAuthSlice = createSlice({
  name: "parentAuth",
  initialState,
  reducers: {
    setParentUser(state, action: PayloadAction<ParentUser>) {
      state.user = action.payload;
      state.status = "authenticated";
    },
    clearParentAuth(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setParentUser, clearParentAuth } = parentAuthSlice.actions;
export default parentAuthSlice.reducer;
