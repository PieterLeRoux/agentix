import { ClassicPreset } from 'rete';

export class StartNode extends ClassicPreset.Node {
  constructor(name = 'Start') {
    super(name);
    
    this.addOutput('output', new ClassicPreset.Output(socket, 'Start'));
    
    // Store configuration
    this.startName = name;
    this.nodeType = 'start';
  }
}

export const socket = new ClassicPreset.Socket('socket');