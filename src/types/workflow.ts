import { ClassicPreset } from 'rete';

// ===== Core Workflow Types =====

export interface WorkflowData {
  id: string;
  name: string;
  description?: string;
  nodes: NodeData[];
  connections: ConnectionData[];
  metadata?: WorkflowMetadata;
}

export interface WorkflowMetadata {
  version: string;
  created: string;
  modified?: string;
  isTemplate: boolean;
  category: string;
  tags: string[];
}

// ===== Node Types =====

export type NodeType = 'teams' | 'delegates' | 'subflows' | 'transformer' | 'start' | 'end' | 'decision' | 'goal' | 'squad' | 'group' | 'agent' | 'humanAgent' | 'flow';

export interface NodeData {
  id: string;
  label: string;
  nodeType: NodeType;
  position: Position;
  data?: Record<string, any>;
  // Agent node properties
  agentName?: string;
  systemPrompt?: string;
  // Squad node properties
  squadName?: string;
  agents?: any[];
  // Goal node properties
  goalName?: string;
  success_criteria?: string;
  // Group node properties
  groupName?: string;
  // Transformer node properties
  transformerName?: string;
  code?: string;
  // Flow node properties
  flowName?: string;
  subFlowId?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface ConnectionData {
  id: string;
  source: string;
  sourceOutput: string;
  target: string;
  targetInput: string;
}

// ===== Rete.js Extended Types =====

export interface CustomNode extends ClassicPreset.Node {
  nodeType: NodeType;
  width?: number;
  height?: number;
  parent?: string;
}

export interface CustomConnection extends ClassicPreset.Connection<CustomNode, CustomNode> {}

// ===== Teams Node Types =====

export interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  deadline: string;
  assignedTo: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface Result {
  id: string;
  title: string;
  description: string;
  outcome: string;
  metrics: Record<string, string>;
  deliverables: string[];
  completedDate: string;
  status: 'pending' | 'completed';
  quality: 'poor' | 'fair' | 'good' | 'excellent';
}

export interface TeamsNodeData {
  teamName: string;
  goal: Goal;
  result: Result;
  agents: Agent[];
  nodeType: 'teams';
}

// ===== Delegates Node Types =====

export interface DelegationRules {
  strategy: 'round-robin' | 'load-balance' | 'priority-based';
  conditions: string[];
}

export interface DelegatesNodeData {
  delegateName: string;
  name: string;
  functions: string[];
  delegationRules: DelegationRules;
  testsPassed: boolean;
  nodeType: 'delegates';
}

// ===== SubFlows Node Types =====

export interface SubFlowsNodeData {
  subFlowName: string;
  subFlowId: string;
  nestedWorkflow: WorkflowData;
  nodeType: 'subflows';
}

// ===== Validation Types =====

export interface ValidationError {
  type: string;
  message: string;
  nodeId?: string;
  severity: 'error' | 'warning' | 'info';
  id: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  info: ValidationError[];
  all: ValidationError[];
}

// ===== Component Props Types =====

export interface NodeComponentProps {
  data: any;
  emit?: (data: any) => void;
  id?: string;
  selected?: boolean;
  onNodeClick?: () => void;
}

export interface FlowEditorProps {
  initialWorkflow?: WorkflowData;
  onWorkflowChange?: (workflow: WorkflowData) => void;
}

// ===== Hook Types =====

export interface UseKeyboardShortcutsOptions {
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onSelectAll?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onNew?: () => void;
  enabled: boolean;
}

export interface UseAutoSaveOptions {
  enabled: boolean;
  interval: number;
  onSave: () => void;
  hasUnsavedChanges: boolean;
  showNotification: (message: string, severity?: 'info' | 'success' | 'warning' | 'error') => void;
}

// ===== Factory Types =====

export interface NodeFactories {
  teams: (data?: Partial<TeamsNodeData>) => CustomNode;
  delegates: (data?: Partial<DelegatesNodeData>) => CustomNode;
  subflows: (data?: Partial<SubFlowsNodeData>) => CustomNode;
  [key: string]: (data?: any) => CustomNode;
}

// ===== Persistence Types =====

export interface SaveResult {
  success: boolean;
  error?: string;
}

export interface LoadResult {
  success: boolean;
  workflow?: WorkflowData;
  error?: string;
}

// ===== Command System Types =====

export interface Command {
  execute(): Promise<void>;
  undo(): Promise<void>;
  description: string;
}

export interface CommandManager {
  executeCommand(command: Command): Promise<void>;
  undo(): boolean;
  redo(): boolean;
  clear(): void;
  canUndo(): boolean;
  canRedo(): boolean;
  addListener(listener: (state: CommandManagerState) => void): void;
  removeListener(listener: (state: CommandManagerState) => void): void;
}

export interface CommandManagerState {
  canUndo: boolean;
  canRedo: boolean;
}