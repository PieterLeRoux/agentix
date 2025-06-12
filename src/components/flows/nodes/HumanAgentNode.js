import { ClassicPreset } from 'rete';
import { socket } from './StartNode';

export class HumanAgentNode extends ClassicPreset.Node {
  constructor(agentName = 'Human Agent') {
    super(agentName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.agentName = agentName;
    this.instructions = 'Please review and provide input';
    this.nodeType = 'human';
  }
}