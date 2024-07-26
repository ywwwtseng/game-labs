import { configureStore } from "@reduxjs/toolkit";
import appStateReducer from "@/features/appState/appStateSlice";
import selectModeReducer from "@/features/selectMode/selectModeSlice";
import drawModeReducer from "@/features/drawMode/drawModeSlice";

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    selectMode: selectModeReducer,
    drawMode: drawModeReducer,
  },
});