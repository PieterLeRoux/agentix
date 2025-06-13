import { ClassicPreset } from 'rete';
import { socket } from './StartNode';
import type { CustomNode, NodeType } from '../../../types/workflow';

export class DecisionNode extends ClassicPreset.Node implements CustomNode {
  public readonly nodeType: NodeType = 'decision';
  public condition: string;
  public width?: number;
  public height?: number;
  public parent?: string;

  constructor(condition: string = 'Decision') {
    super(condition);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('yes', new ClassicPreset.Output(socket, 'Yes'));
    this.addOutput('no', new ClassicPreset.Output(socket, 'No'));
    
    // Store condition for display and configuration
    this.condition = condition;
  }
}