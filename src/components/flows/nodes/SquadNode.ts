import { ClassicPreset } from 'rete';
import { socket } from './StartNode';
import type { CustomNode, NodeType, Agent } from '../../../types/workflow';

export class SquadNode extends ClassicPreset.Node implements CustomNode {
  public readonly nodeType: NodeType = 'squad';
  public squadName: string;
  public description: string;
  public agents: Agent[];
  public width?: number;
  public height?: number;
  public parent?: string;

  constructor(squadName: string = 'Squad') {
    super(squadName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.squadName = squadName;
    this.description = 'A collection of agents working together';
    this.agents = [];
  }
}