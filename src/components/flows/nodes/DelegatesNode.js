import { ClassicPreset } from 'rete';
import { socket } from './socket';

export class DelegatesNode extends ClassicPreset.Node {
  constructor(delegateName = 'Delegate') {
    super(delegateName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.delegateName = delegateName;
    this.nodeType = 'delegates';
    this.name = 'Data Transformer';
    
    // Transform functions
    this.functions = [
      'validateInput()',
      'transformData()'
    ];
    
    // Delegation configuration
    this.delegationRules = {
      strategy: 'round-robin', // round-robin, load-balance, priority-based
      conditions: []
    };
    
    // Test status
    this.testsPassed = true; // Default to tests passed
    
    this.width = 220;
    this.height = 140;
  }
}