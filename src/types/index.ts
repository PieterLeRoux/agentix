// Global type definitions for Agentix
import { ReactNode } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  description?: string;
  capabilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type AgentType = 'research' | 'writing' | 'analysis' | 'review' | 'orchestrator';
export type AgentStatus = 'idle' | 'active' | 'processing' | 'error' | 'maintenance';

export interface Squad {
  id: string;
  name: string;
  description?: string;
  agents: Agent[];
  status: SquadStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type SquadStatus = 'idle' | 'active' | 'completed' | 'failed';

export interface Flow {
  id: string;
  name: string;
  description?: string;
  nodes: FlowNode[];
  connections: FlowConnection[];
  status: FlowStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type FlowStatus = 'draft' | 'active' | 'paused' | 'completed' | 'failed';

export interface FlowNode {
  id: string;
  type: NodeType;
  position: Position;
  data: NodeData;
}

export type NodeType = 'agent' | 'squad' | 'group' | 'transformer';

export interface Position {
  x: number;
  y: number;
}

export interface NodeData {
  label: string;
  description?: string;
  configuration?: Record<string, unknown>;
}

export interface FlowConnection {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface DashboardMetrics {
  activeFlows: number;
  totalAgents: number;
  successRate: number;
  avgResponseTime: string;
  tasksProcessed: number;
  uptime: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: unknown;
}

export interface ActivityItem {
  id: number;
  type: string;
  name: string;
  user: string;
  time: string;
  status: 'success' | 'error' | 'warning';
  duration: string;
}

export interface SystemHealthItem {
  service: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: string;
  responseTime: string;
}

export interface ThemeConfig {
  mode: 'light' | 'dark';
}

export interface AppSettings {
  theme: ThemeConfig;
  notifications: boolean;
  autoSave: boolean;
}

// Rete.js related types
export interface ReteNode {
  id: string;
  label: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
  controls: Record<string, unknown>;
}

export interface ReteConnection {
  id: string;
  source: string;
  target: string;
  sourceOutput: string;
  targetInput: string;
}

// Component prop types
export interface LayoutProps {
  children: ReactNode;
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export interface NavigationProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'temporary';
}

export interface SettingsProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

export interface FlowEditorProps {
  flow?: Flow;
  onSave?: (flow: Flow) => void;
  onClose?: () => void;
}