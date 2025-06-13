import { ClassicPreset } from 'rete';
import { socket } from './StartNode';
import type { CustomNode, NodeType } from '../../../types/workflow';

export class GoalNode extends ClassicPreset.Node implements CustomNode {
  public readonly nodeType: NodeType = 'goal';
  public goalName: string;
  public description: string;
  public success_criteria: string;
  public priority: 'low' | 'medium' | 'high';
  public width?: number;
  public height?: number;
  public parent?: string;

  constructor(goalName: string = 'Goal') {
    super(goalName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.goalName = goalName;
    this.description = 'A specific objective to achieve';
    this.success_criteria = '';
    this.priority = 'medium';
  }
}