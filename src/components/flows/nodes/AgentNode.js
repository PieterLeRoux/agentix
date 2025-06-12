import { ClassicPreset } from 'rete';
import { socket } from './StartNode';

export class AgentNode extends ClassicPreset.Node {
  constructor(agentName = 'AI Agent') {
    super(agentName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.agentName = agentName;
    this.systemPrompt = 'You are a helpful AI assistant.';
    this.model = 'gpt-4';
    this.nodeType = 'agent';
  }
}