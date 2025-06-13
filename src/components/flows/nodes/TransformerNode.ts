import { ClassicPreset } from 'rete';
import { socket } from './StartNode';
import type { CustomNode, NodeType } from '../../../types/workflow';

export class TransformerNode extends ClassicPreset.Node implements CustomNode {
  public readonly nodeType: NodeType = 'transformer';
  public transformerName: string;
  public description: string;
  public code: string;
  public language: string;
  public width?: number;
  public height?: number;
  public parent?: string;

  constructor(transformerName: string = 'Transformer') {
    super(transformerName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.transformerName = transformerName;
    this.description = 'Code snippet for data transformation';
    this.code = '// Transform data here\nreturn data;';
    this.language = 'javascript';
  }
}