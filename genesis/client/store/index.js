import { configureStore } from '@reduxjs/toolkit';
import appStateReducer from '@/features/appState/appStateSlice';
import editModeReducer from '@/features/editMode/editModeSlice';
import drawModeReducer from '@/features/drawMode/drawModeSlice';
import queryReducer from '@/features/query/querySlice';

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    editMode: editModeReducer,
    drawMode: drawModeReducer,
    query: queryReducer,
  },
});
