import { ClassicPreset } from 'rete';
import { socket } from './socket';
import { DelegationRules, NodeType } from '../../../types/workflow';

export class DelegatesNode extends ClassicPreset.Node {
  public delegateName: string;
  public nodeType: NodeType = 'delegates';
  public name: string;
  public functions: string[];
  public delegationRules: DelegationRules;
  public testsPassed: boolean;
  public width: number = 220;
  public height: number = 140;

  constructor(delegateName: string = 'Delegate') {
    super(delegateName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.delegateName = delegateName;
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