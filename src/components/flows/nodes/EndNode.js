import { ClassicPreset } from 'rete';
import { socket } from './StartNode';

export class EndNode extends ClassicPreset.Node {
  constructor(name = 'End') {
    super(name);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    
    // Store configuration
    this.endName = name;
    this.nodeType = 'end';
  }
}