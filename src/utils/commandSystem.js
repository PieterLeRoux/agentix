// Command pattern implementation for undo/redo functionality

export class Command {
  constructor(execute, undo, description = '') {
    this.execute = execute;
    this.undo = undo;
    this.description = description;
  }
}

export class CommandManager {
  constructor(maxHistorySize = 50) {
    this.history = [];
    this.currentIndex = -1;
    this.maxHistorySize = maxHistorySize;
    this.listeners = [];
  }

  executeCommand(command) {
    try {
      // Execute the command
      const result = command.execute();
      
      // Remove any commands after the current index (when we're not at the end)
      if (this.currentIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.currentIndex + 1);
      }
      
      // Add the new command
      this.history.push(command);
      this.currentIndex++;
      
      // Trim history if it exceeds max size
      if (this.history.length > this.maxHistorySize) {
        this.history.shift();
        this.currentIndex--;
      }
      
      this.notifyListeners();
      return result;
    } catch (error) {
      console.error('Command execution failed:', error);
      throw error;
    }
  }

  undo() {
    if (!this.canUndo()) return false;
    
    try {
      const command = this.history[this.currentIndex];
      command.undo();
      this.currentIndex--;
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Undo failed:', error);
      return false;
    }
  }

  redo() {
    if (!this.canRedo()) return false;
    
    try {
      this.currentIndex++;
      const command = this.history[this.currentIndex];
      command.execute();
      this.notifyListeners();
      return true;
    } catch (error) {
      console.error('Redo failed:', error);
      this.currentIndex--;
      return false;
    }
  }

  canUndo() {
    return this.currentIndex >= 0;
  }

  canRedo() {
    return this.currentIndex < this.history.length - 1;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
    this.notifyListeners();
  }

  getUndoDescription() {
    if (!this.canUndo()) return null;
    return this.history[this.currentIndex].description;
  }

  getRedoDescription() {
    if (!this.canRedo()) return null;
    return this.history[this.currentIndex + 1].description;
  }

  // Observer pattern for state changes
  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener({
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoDescription: this.getUndoDescription(),
      redoDescription: this.getRedoDescription(),
    }));
  }
}

// Workflow-specific command creators
export const createAddNodeCommand = (editor, node, position) => {
  return new Command(
    async () => {
      await editor.addNode(node);
      if (position && editor.area) {
        await editor.area.translate(node.id, position);
      }
      return node;
    },
    async () => {
      await editor.removeNode(node.id);
    },
    `Add ${node.label || node.constructor.name}`
  );
};

export const createRemoveNodeCommand = (editor, nodeId) => {
  let nodeData = null;
  let nodePosition = null;
  let connections = [];

  return new Command(
    async () => {
      // Store node data before removal
      const node = editor.getNode(nodeId);
      nodeData = { ...node };
      
      if (editor.area) {
        nodePosition = editor.area.nodeViews.get(nodeId)?.position;
      }
      
      // Store connections
      connections = editor.getConnections().filter(
        conn => conn.source === nodeId || conn.target === nodeId
      );
      
      // Remove connections first
      for (const connection of connections) {
        await editor.removeConnection(connection.id);
      }
      
      // Remove node
      await editor.removeNode(nodeId);
    },
    async () => {
      // Recreate node
      await editor.addNode(nodeData);
      
      if (nodePosition && editor.area) {
        await editor.area.translate(nodeId, nodePosition);
      }
      
      // Recreate connections
      for (const connection of connections) {
        await editor.addConnection(connection);
      }
    },
    `Remove ${nodeData?.label || 'Node'}`
  );
};

export const createMoveNodeCommand = (editor, nodeId, fromPosition, toPosition) => {
  return new Command(
    async () => {
      if (editor.area) {
        await editor.area.translate(nodeId, toPosition);
      }
    },
    async () => {
      if (editor.area) {
        await editor.area.translate(nodeId, fromPosition);
      }
    },
    `Move Node`
  );
};

export const createAddConnectionCommand = (editor, connection) => {
  return new Command(
    async () => {
      await editor.addConnection(connection);
      return connection;
    },
    async () => {
      await editor.removeConnection(connection.id);
    },
    `Add Connection`
  );
};

export const createRemoveConnectionCommand = (editor, connectionId) => {
  let connectionData = null;

  return new Command(
    async () => {
      connectionData = editor.getConnection(connectionId);
      await editor.removeConnection(connectionId);
    },
    async () => {
      if (connectionData) {
        await editor.addConnection(connectionData);
      }
    },
    `Remove Connection`
  );
};

export const createUpdateNodeCommand = (editor, nodeId, oldData, newData) => {
  return new Command(
    async () => {
      const node = editor.getNode(nodeId);
      Object.assign(node, newData);
      return node;
    },
    async () => {
      const node = editor.getNode(nodeId);
      Object.assign(node, oldData);
      return node;
    },
    `Update ${oldData.label || 'Node'}`
  );
};