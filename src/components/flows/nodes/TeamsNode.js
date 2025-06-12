import { ClassicPreset } from 'rete';
import { socket } from './socket';

export class TeamsNode extends ClassicPreset.Node {
  constructor(teamName = 'Creative Team') {
    super(teamName);
    
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    
    // Store configuration
    this.teamName = teamName;
    this.nodeType = 'teams';
    
    // Goal and result objects - define default creative team goal
    this.goal = {
      id: 'goal_' + Math.random().toString(36).substr(2, 9),
      title: "Launch Creative Campaign",
      description: "Develop and execute an innovative multi-channel marketing campaign that increases brand awareness by 30%",
      priority: "high",
      deadline: "2024-03-15",
      assignedTo: "Creative Director",
      status: "in-progress"
    };
    
    this.result = {
      id: 'result_' + Math.random().toString(36).substr(2, 9),
      title: "Campaign Launch Success",
      description: "Successfully launched multi-channel marketing campaign with measurable impact",
      outcome: "Exceeded brand awareness target by 35%",
      metrics: {
        engagement: "25% increase",
        reach: "2.5M impressions",
        conversions: "18% uplift"
      },
      deliverables: ["Creative assets", "Campaign analytics", "Performance report"],
      completedDate: "2024-03-10",
      status: "completed",
      quality: "excellent"
    };
    
    // Default creative team
    this.agents = [
      { id: '1', name: 'Creative Director', role: 'creative-director', icon: '🤖' },
      { id: '2', name: 'Designer', role: 'designer', icon: '🤖' },
      { id: '3', name: 'Copywriter', role: 'copywriter', icon: '🤖' },
      { id: '4', name: 'Strategist', role: 'strategist', icon: '🤖' },
      { id: '5', name: 'Analyst', role: 'analyst', icon: '🤖' }
    ];
    
    // Node should be larger to accommodate agent list
    this.width = 320;
    this.height = 220;
  }
}