import { ClassicPreset } from 'rete';
import type { CustomNode, NodeType } from '../../../types/workflow';

export const socket = new ClassicPreset.Socket('socket');

export class StartNode extends ClassicPreset.Node implements CustomNode {
  public readonly nodeType: NodeType = 'start';
  public startName: string;
  public width?: number;
  public height?: number;
  public parent?: string;

  constructor(name: string = 'Start') {
    super(name);
    
    this.addOutput('output', new ClassicPreset.Output(socket, 'Start'));
    
    // Store configuration
    this.startName = name;
  }
}