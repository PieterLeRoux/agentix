import { ClassicPreset } from 'rete';
import { socket } from './StartNode';
import type { CustomNode, NodeType } from '../../../types/workflow';

export class HumanAgentNode extends ClassicPreset.Node implements CustomNode {
  public readonly nodeType: NodeType = 'humanAgent';
  public agentName: string;
  public instructions: string;
  public width?: number;
  public height?: number;
  public parent?: string;

  constructor(agentName: string = 'Human Agent') {
    super(agentName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.agentName = agentName;
    this.instructions = 'Please review and provide input';
  }
}