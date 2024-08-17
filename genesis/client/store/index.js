import { configureStore } from '@reduxjs/toolkit';
import { reducer as appStateReducer } from '@/features/appState/appStateSlice';
import { reducer as editModeReducer } from '@/features/editMode/editModeSlice';
import { reducer as viewModeReducer } from '@/features/viewMode/viewModeSlice';
import { reducer as queryReducer } from '@/features/query/querySlice';
import { reducer as cameraReducer } from '@/features/camera/cameraSlice';
import { CommandManager } from '@/helpers/CommandManager';

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    editMode: editModeReducer,
    viewMode: viewModeReducer,
    query: queryReducer,
    camera: cameraReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: {
        commandManager: new CommandManager(),
        queryFns: new Map(),
      }
    }
  })
});
