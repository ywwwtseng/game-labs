import { configureStore } from '@reduxjs/toolkit';
import appStateReducer from '@/features/appState/appStateSlice';
import editModeReducer from '@/features/editMode/editModeSlice';
import queryReducer from '@/features/query/querySlice';
import { CommandManager } from '@/helpers/CommandManager';

export const store = configureStore({
  reducer: {
    appState: appStateReducer,
    editMode: editModeReducer,
    query: queryReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    thunk: {
      extraArgument: {
        commandManager: new CommandManager()
      }
    }
  })
});
