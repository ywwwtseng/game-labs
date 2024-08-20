export class Command {
  execute() {
  }
  undo() {
  }
  redo() {
  }
}

export class CompositeCommand extends Command {
  constructor(commands) {
    super();
    this._commands = commands;
  }

  execute() {
    for (let command of this._commands) {
      command.execute();
    }
  }

  undo() {
    for (let i = this._commands.length - 1; i >= 0; i--) {
      this._commands[i].undo();
    }
  }

  redo() {
    for (let command of this._commands) {
      command.redo();
    }
  }
}

export class CommandManager {
  constructor() {
    this._undoStack = [];
    this._redoStack = [];
    this._maxSteps = 50;
  }

  executeCmd(command) {
    command.execute();

    if (command.merge) {
      this._undoStack.push(new CompositeCommand([this._undoStack.pop(), command]));
    } else {
      this._undoStack.push(command);
    }


    if (this._undoStack.length > this._maxSteps) {
      this._undoStack.shift();
    }

    this._redoStack = [];
  }

  undo() {
    if (this._undoStack.length === 0) return;
    const cmd = this._undoStack.pop();
    cmd.undo();

    this._redoStack.push(cmd);

    if (this._redoStack.length > this._maxSteps) {
      this._redoStack.shift();
    }
  }

  redo() {
    if (this._redoStack.length === 0) return;
    const cmd = this._redoStack.pop();

    
    cmd.redo();
    this._undoStack.push(cmd);

    if (this._undoStack.length > this._maxSteps) {
      this._undoStack.shift();
    }
  }
}