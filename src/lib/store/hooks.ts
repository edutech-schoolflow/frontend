import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

/** Typed Redux hooks — use these instead of the plain react-redux ones. */
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
