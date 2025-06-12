import { ClassicPreset } from 'rete';
import { socket } from './StartNode';

export class GoalNode extends ClassicPreset.Node {
  constructor(goalName = 'Goal') {
    super(goalName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.goalName = goalName;
    this.description = 'A specific objective to achieve';
    this.success_criteria = '';
    this.priority = 'medium';
    this.nodeType = 'goal';
  }
}