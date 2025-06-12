import { ClassicPreset } from 'rete';
import { socket } from './StartNode';

export class SquadNode extends ClassicPreset.Node {
  constructor(squadName = 'Squad') {
    super(squadName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.squadName = squadName;
    this.description = 'A collection of agents working together';
    this.agents = [];
    this.nodeType = 'squad';
  }
}