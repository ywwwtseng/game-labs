import { configureStore } from "@reduxjs/toolkit";
import appStateReducer from "@/features/appState/appStateSlice";
import selectModeReucer from "@/features/selectMode/selectModeSlice";

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    selectMode: selectModeReucer,
  },
});