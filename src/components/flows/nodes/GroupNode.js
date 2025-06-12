import { ClassicPreset } from 'rete';
import { socket } from './StartNode';

export class GroupNode extends ClassicPreset.Node {
  constructor(groupName = 'Group') {
    super(groupName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.groupName = groupName;
    this.description = 'A collection of squads with defined goals';
    this.squads = [];
    this.goals = [];
    this.nodeType = 'group';
  }
}