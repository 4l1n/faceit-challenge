import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

// Use this hook to dispatch actions instead of using useDispatch directly
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

// Use this hook to select state from the store instead of using useSelector directly
export const useAppSelector = useSelector.withTypes<RootState>();
