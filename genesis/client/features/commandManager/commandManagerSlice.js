import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export class Command {
  execute() {}
  undo() {}
  redo() {}
}

class CompositeCommand extends Command {
  constructor(commands) {
    super();
    this._commands = commands;
  }

  execute(dispatch) {
    for (let command of this._commands) {
      command.execute(dispatch);
    }
  }

  undo(dispatch) {
    // 反向撤销，最后一个命令先撤销
    for (let i = this._commands.length - 1; i >= 0; i--) {
      this._commands[i].undo(dispatch);
    }
  }

  redo(dispatch) {
    // 按顺序重做
    for (let command of this._commands) {
      command.redo(dispatch);
    }
  }
}

export const executeCommands = createAsyncThunk(
  'commandManager/executeCommands',
  async ({ commands }, { getState, dispatch, ...props }) => {
    const compositeCommand  = commands.length === 1 ? commands[0] : new CompositeCommand(commands);
    compositeCommand.execute(dispatch);

    dispatch(operate({
      target: 'undoStack',
      operateName: 'push',
      elementN: [compositeCommand],
    }));

    const commandManager = selectedCommandManager(getState());

    if (commandManager.undoStack.length > commandManager.maxSteps) {
      dispatch(operate({
        target: 'undoStack',
        operateName: 'shift',
      }));
    }

    dispatch(operate({
      target: 'redoStack',
      operateName: 'clear',
    }));
  }
);

export const undo = createAsyncThunk(
  'commandManager/undo',
  async ({}, { getState, dispatch }) => {
    let commandManager = selectedCommandManager(getState());
    if (commandManager.undoStack.length === 0) {
      return;
    }

    const cmd = commandManager.undoStack[commandManager.undoStack.length - 1];
    command.undo(dispatch);

    dispatch(operate({
      target: 'redoStack',
      operateName: 'push',
      elementN: [cmd],
    }));

    commandManager = selectedCommandManager(getState());

    if (commandManager.redoStack.length > commandManager.maxSteps) {
      dispatch(operate({
        target: 'redoStack',
        operateName: 'shift',
      }));
    }
  }
);

export const redo = createAsyncThunk(
  'commandManager/redo',
  async ({}, { getState, dispatch }) => {
    let commandManager = selectedCommandManager(getState());
    if (commandManager.redoStack.length === 0) {
      return;
    }

    const cmd = commandManager.redoStack[commandManager.redoStack.length - 1];
    command.redo(dispatch);

    dispatch(operate({
      target: 'undoStack',
      operateName: 'push',
      elementN: [cmd],
    }));

    commandManager = selectedCommandManager(getState());

    if (commandManager.undoStack.length > commandManager.maxSteps) {
      dispatch(operate({
        target: 'undoStack',
        operateName: 'shift',
      }));
    }
  }
);

const initialState = {
  undoStack: [],
  redoStack: [],
  maxSteps: 20,
};


export const commandManagerSlice = createSlice({
  name: 'commandManager',
  initialState,
  reducers: {
    operate: (state, action) => {
      const { target, operateName, elementN } = action.payload;
      if (operateName === 'clear') {
        state[target] = [];
      } else {
        state[target][operateName](...(elementN || []));
      }
    },
  },
});

export const { operate } = commandManagerSlice.actions;

export const selectedCommandManager = (state) => state.commandManager;

export default commandManagerSlice.reducer;