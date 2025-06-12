import { ClassicPreset } from 'rete';
import { socket } from './StartNode';

export class FlowNode extends ClassicPreset.Node {
  constructor(flowName = 'Sub Flow') {
    super(flowName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.flowName = flowName;
    this.description = 'Reference to another workflow';
    this.subFlowId = '';
    this.parameters = {};
    this.nodeType = 'flow';
  }
}