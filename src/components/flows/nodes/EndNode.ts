import { ClassicPreset } from 'rete';
import { socket } from './StartNode';
import type { CustomNode, NodeType } from '../../../types/workflow';

export class EndNode extends ClassicPreset.Node implements CustomNode {
  public readonly nodeType: NodeType = 'end';
  public endName: string;
  public width?: number;
  public height?: number;
  public parent?: string;

  constructor(name: string = 'End') {
    super(name);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    
    // Store configuration
    this.endName = name;
  }
}