import { ClassicPreset } from 'rete';
import { socket } from './StartNode';
import type { CustomNode, NodeType } from '../../../types/workflow';

export class AgentNode extends ClassicPreset.Node implements CustomNode {
  public readonly nodeType: NodeType = 'agent';
  public agentName: string;
  public systemPrompt: string;
  public model: string;
  public width?: number;
  public height?: number;
  public parent?: string;

  constructor(agentName: string = 'AI Agent') {
    super(agentName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.agentName = agentName;
    this.systemPrompt = 'You are a helpful AI assistant.';
    this.model = 'gpt-4';
  }
}