import { ClassicPreset } from 'rete';
import { socket } from './socket';
import { WorkflowData, NodeType } from '../../../types/workflow';

export class SubFlowsNode extends ClassicPreset.Node {
  public subFlowName: string;
  public nodeType: NodeType = 'subflows';
  public subFlowId: string;
  public nestedWorkflow: WorkflowData;
  public width: number = 240;
  public height: number = 160;

  constructor(subFlowName: string = 'Sub Workflow') {
    super(subFlowName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Flow Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Flow Output'));
    
    // Store configuration
    this.subFlowName = subFlowName;
    
    // Sub-flow configuration with sample nested workflow
    this.subFlowId = `subflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    this.nestedWorkflow = {
      id: this.subFlowId,
      name: `${subFlowName} - Internal Process`,
      description: `Nested workflow for ${subFlowName}`,
      nodes: [
        {
          id: 'nested_team_001',
          label: 'Processing Team',
          nodeType: 'teams',
          position: { x: 100, y: 100 }
        },
        {
          id: 'nested_delegate_001', 
          label: 'Data Validator',
          nodeType: 'delegates',
          position: { x: 350, y: 100 }
        }
      ],
      connections: [
        {
          id: 'nested_conn_001',
          source: 'nested_team_001',
          sourceOutput: 'output',
          target: 'nested_delegate_001',
          targetInput: 'input'
        }
      ],
      metadata: {
        version: '1.0',
        created: new Date().toISOString(),
        isTemplate: false,
        category: 'subflow',
        tags: ['nested', 'subflow']
      }
    };
    
    // Make it medium-large
    this.width = 240;
    this.height = 160;
  }
}