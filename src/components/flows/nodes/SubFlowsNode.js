import { ClassicPreset } from 'rete';
import { socket } from './socket';

export class SubFlowsNode extends ClassicPreset.Node {
  constructor(subFlowName = 'Sub Workflow') {
    super(subFlowName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Flow Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Flow Output'));
    
    // Store configuration
    this.subFlowName = subFlowName;
    this.nodeType = 'subflows';
    
    // Sub-flow configuration (foundation for Phase 4)
    this.subFlowId = null;
    this.nestedWorkflow = null;
    
    // Make it medium-large
    this.width = 240;
    this.height = 160;
  }
}