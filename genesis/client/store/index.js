import { configureStore } from '@reduxjs/toolkit';
import { reducer as appStateReducer } from '@/features/appState/appStateSlice';
import { reducer as editModeReducer } from '@/features/editMode/editModeSlice';
import { reducer as queryReducer } from '@/features/query/querySlice';
import { CommandManager } from '@/helpers/CommandManager';

window.a = new Map();
export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    editMode: editModeReducer,
    query: queryReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: {
        commandManager: new CommandManager(),
        queryFns: window.a,
      }
    }
  })
});
