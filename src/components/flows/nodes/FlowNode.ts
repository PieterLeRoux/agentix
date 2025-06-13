import { ClassicPreset } from 'rete';
import { socket } from './StartNode';
import type { CustomNode, NodeType } from '../../../types/workflow';

export class FlowNode extends ClassicPreset.Node implements CustomNode {
  public readonly nodeType: NodeType = 'flow';
  public flowName: string;
  public description: string;
  public subFlowId: string;
  public parameters: Record<string, any>;
  public width?: number;
  public height?: number;
  public parent?: string;

  constructor(flowName: string = 'Sub Flow') {
    super(flowName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.flowName = flowName;
    this.description = 'Reference to another workflow';
    this.subFlowId = '';
    this.parameters = {};
  }
}