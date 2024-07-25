import { configureStore } from "@reduxjs/toolkit";
import appStateReducer from "@/features/appState/appStateSlice";
import sceneSelectAreaReucer from "@/features/sceneSelectArea/sceneSelectAreaSlice";

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    sceneSelectArea: sceneSelectAreaReucer,
  },
});