import { NodeEditor, ClassicPreset } from 'rete';
import { AreaPlugin } from 'rete-area-plugin';
import { ConnectionPlugin } from 'rete-connection-plugin';
import { ReactPlugin } from 'rete-react-plugin';
import { CustomNode, CustomConnection } from './workflow';

// ===== Rete.js Schemes =====

export type Schemes = {
  Node: CustomNode;
  Connection: CustomConnection;
};

// ===== Editor Types =====

export type ReteEditor = NodeEditor<any>;
export type ReteArea = AreaPlugin<any, any>;
export type ReteConnection = ConnectionPlugin<any, any>;
export type ReteReact = ReactPlugin<any, any>;

// ===== Socket Types =====

export interface SocketData {
  name: string;
  side: 'input' | 'output';
}

// ===== Control Types =====

export interface ControlData {
  id: string;
  readonly?: boolean;
  value?: any;
}

// ===== Node View Types =====

export interface NodeView {
  position: { x: number; y: number };
  element: HTMLElement;
}

// ===== Area Types =====

export interface AreaTransform {
  x: number;
  y: number;
  k: number; // zoom scale
}

// ===== Context Types =====

export interface NodeContext {
  payload: {
    id: string;
    label: string;
    nodeType: string;
    inputs: Record<string, any>;
    outputs: Record<string, any>;
    controls: Record<string, any>;
  };
}

export interface SocketContext {
  payload: {
    socket: ClassicPreset.Socket;
    side: 'input' | 'output';
  };
}

export interface ConnectionContext {
  payload: {
    source: string;
    target: string;
    sourceOutput: string;
    targetInput: string;
  };
}

// ===== Component Override Types =====

export interface ReactPresetOverrides {
  node?: (context: NodeContext) => React.ComponentType<any> | undefined;
  socket?: (context: SocketContext) => React.ComponentType<any> | undefined;
  connection?: (context: ConnectionContext) => React.ComponentType<any> | undefined;
}