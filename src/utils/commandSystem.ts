// Command pattern implementation for undo/redo functionality

// Core interfaces
export interface ICommand {
  execute(): Promise<any> | any;
  undo(): Promise<void> | void;
  description: string;
}

export interface CommandState {
  canUndo: boolean;
  canRedo: boolean;
  undoDescription: string | null;
  redoDescription: string | null;
}

export type CommandListener = (state: CommandState) => void;

export interface ICommandManager {
  executeCommand(command: ICommand): Promise<any> | any;
  undo(): boolean;
  redo(): boolean;
  canUndo(): boolean;
  canRedo(): boolean;
  clear(): void;
  getUndoDescription(): string | null;
  getRedoDescription(): string | null;
  addListener(listener: CommandListener): void;
  removeListener(listener: CommandListener): void;
}

// Editor and node interfaces
export interface Position {
  x: number;
  y: number;
}

export interface INode {
  id: string;
  label?: string;
  constructor?: {
    name: string;
  };
  [key: string]: any;
}

export interface IConnection {
  id: string;
  source: string;
  target: string;
  [key: string]: any;
}

export interface INodeView {
  position?: Position;
}

export interface IArea {
  translate(nodeId: string, position: Position): Promise<void>;
  nodeViews: Map<string, INodeView>;
}

export interface IEditor {
  addNode(node: INode): Promise<void>;
  removeNode(nodeId: string): Promise<void>;
  getNode(nodeId: string): INode;
  addConnection(connection: IConnection): Promise<void>;
  removeConnection(connectionId: string): Promise<void>;
  getConnection(connectionId: string): IConnection;
  getConnections(): IConnection[];
  area?: IArea;
}

export type CommandExecutor = () => Promise<any> | any;
export type CommandUndoer = () => Promise<void> | void;

export class Command implements ICommand {
  public readonly execute: CommandExecutor;
  public readonly undo: CommandUndoer;
  public readonly description: string;

  constructor(execute: CommandExecutor, undo: CommandUndoer, description: string = '') {
    this.execute = execute;
    this.undo = undo;
    this.description = description;
  }
}

export class CommandManager implements ICommandManager {
  private history: ICommand[] = [];
  private currentIndex: number = -1;
  private readonly maxHistorySize: number;
  private listeners: CommandListener[] = [];

  constructor(maxHistorySize: number = 50) {
    this.maxHistorySize = maxHistorySize;
  }

  executeCommand(command: ICommand): any {
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

  undo(): boolean {
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

  redo(): boolean {
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

  canUndo(): boolean {
    return this.currentIndex >= 0;
  }

  canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  clear(): void {
    this.history = [];
    this.currentIndex = -1;
    this.notifyListeners();
  }

  getUndoDescription(): string | null {
    if (!this.canUndo()) return null;
    return this.history[this.currentIndex].description;
  }

  getRedoDescription(): string | null {
    if (!this.canRedo()) return null;
    return this.history[this.currentIndex + 1].description;
  }

  // Observer pattern for state changes
  addListener(listener: CommandListener): void {
    this.listeners.push(listener);
  }

  removeListener(listener: CommandListener): void {
    this.listeners = this.listeners.filter((l: CommandListener) => l !== listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener({
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoDescription: this.getUndoDescription(),
      redoDescription: this.getRedoDescription(),
    }));
  }
}

// Workflow-specific command creators
export const createAddNodeCommand = (editor: IEditor, node: INode, position?: Position): ICommand => {
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
    `Add ${node.label || node.constructor?.name || 'Node'}`
  );
};

export const createRemoveNodeCommand = (editor: IEditor, nodeId: string): ICommand => {
  let nodeData: INode | null = null;
  let nodePosition: Position | null = null;
  let connections: IConnection[] = [];

  // Get node data immediately for description
  const initialNode = editor.getNode(nodeId);
  const nodeLabel = initialNode?.label || initialNode?.constructor?.name || 'Node';

  return new Command(
    async () => {
      // Store node data before removal
      const node = editor.getNode(nodeId);
      if (!node) {
        throw new Error(`Node with id ${nodeId} not found`);
      }
      nodeData = { ...node };
      
      if (editor.area) {
        const nodeView = editor.area.nodeViews.get(nodeId);
        nodePosition = nodeView?.position || null;
      }
      
      // Store connections
      connections = editor.getConnections().filter(
        (conn: IConnection) => conn.source === nodeId || conn.target === nodeId
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
      if (!nodeData) {
        throw new Error('Cannot recreate node: node data is null');
      }
      await editor.addNode(nodeData);
      
      if (nodePosition && editor.area) {
        await editor.area.translate(nodeId, nodePosition);
      }
      
      // Recreate connections
      for (const connection of connections) {
        await editor.addConnection(connection);
      }
    },
    `Remove ${nodeLabel}`
  );
};

export const createMoveNodeCommand = (editor: IEditor, nodeId: string, fromPosition: Position, toPosition: Position): ICommand => {
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

export const createAddConnectionCommand = (editor: IEditor, connection: IConnection): ICommand => {
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

export const createRemoveConnectionCommand = (editor: IEditor, connectionId: string): ICommand => {
  let connectionData: IConnection | null = null;

  return new Command(
    async () => {
      connectionData = editor.getConnection(connectionId);
      if (!connectionData) {
        throw new Error(`Connection with id ${connectionId} not found`);
      }
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

export const createUpdateNodeCommand = (editor: IEditor, nodeId: string, oldData: Partial<INode>, newData: Partial<INode>): ICommand => {
  return new Command(
    async () => {
      const node = editor.getNode(nodeId);
      if (!node) {
        throw new Error(`Node with id ${nodeId} not found`);
      }
      Object.assign(node, newData);
      return node;
    },
    async () => {
      const node = editor.getNode(nodeId);
      if (!node) {
        throw new Error(`Node with id ${nodeId} not found`);
      }
      Object.assign(node, oldData);
    },
    `Update ${oldData?.label || 'Node'}`
  );
};