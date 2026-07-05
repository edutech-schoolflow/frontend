import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import parentAuthReducer from "./parentAuthSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    parentAuth: parentAuthReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
