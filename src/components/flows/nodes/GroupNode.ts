import { ClassicPreset } from 'rete';
import { socket } from './StartNode';
import type { CustomNode, NodeType, Goal } from '../../../types/workflow';

export class GroupNode extends ClassicPreset.Node implements CustomNode {
  public readonly nodeType: NodeType = 'group';
  public groupName: string;
  public description: string;
  public squads: any[];
  public goals: Goal[];
  public width?: number;
  public height?: number;
  public parent?: string;

  constructor(groupName: string = 'Group') {
    super(groupName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.groupName = groupName;
    this.description = 'A collection of squads with defined goals';
    this.squads = [];
    this.goals = [];
  }
}