import { ClassicPreset } from 'rete';
import { socket } from './StartNode';

export class TransformerNode extends ClassicPreset.Node {
  constructor(transformerName = 'Transformer') {
    super(transformerName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.transformerName = transformerName;
    this.description = 'Code snippet for data transformation';
    this.code = '// Transform data here\nreturn data;';
    this.language = 'javascript';
    this.nodeType = 'transformer';
  }
}