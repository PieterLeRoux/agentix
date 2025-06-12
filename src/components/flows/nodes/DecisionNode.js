import { ClassicPreset } from 'rete';
import { socket } from './StartNode';

export class DecisionNode extends ClassicPreset.Node {
  constructor(condition = 'Decision') {
    super(condition);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('yes', new ClassicPreset.Output(socket, 'Yes'));
    this.addOutput('no', new ClassicPreset.Output(socket, 'No'));
    
    // Store condition for display and configuration
    this.condition = condition;
    this.nodeType = 'decision';
  }
}