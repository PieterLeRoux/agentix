// Flow persistence utilities for localStorage

const STORAGE_KEY = 'axis_workflows';

interface WorkflowData {
  id?: string;
  name?: string;
  metadata?: {
    created?: string;
    modified?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface WorkflowResult {
  success: boolean;
  error?: string;
  id?: string;
  workflow?: WorkflowData;
  workflows?: WorkflowData[];
}

export const saveWorkflow = (workflow: WorkflowData): WorkflowResult => {
  try {
    const workflows = getStoredWorkflows();
    const workflowId = workflow.id || generateWorkflowId();
    
    const workflowData = {
      ...workflow,
      id: workflowId,
      metadata: {
        ...workflow.metadata,
        modified: new Date().toISOString(),
        created: workflow.metadata?.created || new Date().toISOString(),
      }
    };

    workflows[workflowId] = workflowData;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    
    return { success: true, id: workflowId };
  } catch (error) {
    console.error('Failed to save workflow:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const loadWorkflow = (workflowId: string): WorkflowResult => {
  try {
    const workflows = getStoredWorkflows();
    const workflow = workflows[workflowId];
    
    if (!workflow) {
      return { success: false, error: 'Workflow not found' };
    }
    
    return { success: true, workflow };
  } catch (error) {
    console.error('Failed to load workflow:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const getAllWorkflows = (): WorkflowResult => {
  try {
    const workflows = getStoredWorkflows();
    const workflowList = Object.values(workflows) as WorkflowData[];
    return { 
      success: true, 
      workflows: workflowList.sort((a: WorkflowData, b: WorkflowData) => 
        new Date(b.metadata?.modified || 0).getTime() - new Date(a.metadata?.modified || 0).getTime()
      )
    };
  } catch (error) {
    console.error('Failed to get workflows:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const deleteWorkflow = (workflowId: string): WorkflowResult => {
  try {
    const workflows = getStoredWorkflows();
    delete workflows[workflowId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workflows));
    
    return { success: true };
  } catch (error) {
    console.error('Failed to delete workflow:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const exportWorkflow = (workflow: WorkflowData): WorkflowResult => {
  try {
    const dataStr = JSON.stringify(workflow, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${workflow.name || 'workflow'}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    console.error('Failed to export workflow:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const importWorkflow = (file: File): Promise<WorkflowResult> => {
  return new Promise((resolve) => {
    try {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        try {
          const workflow = JSON.parse(e.target?.result as string);
          resolve({ success: true, workflow });
        } catch (parseError) {
          resolve({ success: false, error: 'Invalid workflow file' });
        }
      };
      reader.onerror = () => {
        resolve({ success: false, error: 'Failed to read file' });
      };
      reader.readAsText(file);
    } catch (error) {
      resolve({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });
};

// Private helper functions
const getStoredWorkflows = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn('Failed to parse stored workflows, resetting storage');
    localStorage.removeItem(STORAGE_KEY);
    return {};
  }
};

const generateWorkflowId = () => {
  return `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Workflow serialization helpers
export const serializeWorkflow = (editor: any, name: string = 'Untitled Workflow'): WorkflowData | null => {
  try {
    const nodes = editor.getNodes().map((node: any) => ({
      id: node.id,
      label: node.label,
      nodeType: node.nodeType,
      position: { x: 0, y: 0 }, // Will be updated with actual positions
      data: {
        // Store node-specific data
        agentName: node.agentName,
        systemPrompt: node.systemPrompt,
        model: node.model,
        instructions: node.instructions,
        condition: node.condition,
        startName: node.startName,
        endName: node.endName,
      }
    }));

    const connections = editor.getConnections().map((connection: any) => ({
      id: connection.id,
      source: connection.source,
      sourceOutput: connection.sourceOutput,
      target: connection.target,
      targetInput: connection.targetInput,
    }));

    return {
      name,
      nodes,
      connections,
      metadata: {
        version: '1.0',
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      }
    };
  } catch (error) {
    console.error('Failed to serialize workflow:', error);
    return null;
  }
};

export const deserializeWorkflow = async (workflow: WorkflowData, editor: any, nodeFactories: any): Promise<WorkflowResult> => {
  try {
    // Clear existing workflow
    const existingNodes = editor.getNodes();
    const existingConnections = editor.getConnections();
    
    for (const connection of existingConnections) {
      await editor.removeConnection(connection.id);
    }
    
    for (const node of existingNodes) {
      await editor.removeNode(node.id);
    }

    // Create nodes
    const nodeMap = new Map();
    for (const nodeData of workflow.nodes) {
      const factory = nodeFactories[nodeData.nodeType];
      if (factory) {
        const node = factory(nodeData.data);
        node.id = nodeData.id;
        await editor.addNode(node);
        nodeMap.set(nodeData.id, node);
      }
    }

    // Create connections
    for (const connectionData of workflow.connections) {
      const sourceNode = nodeMap.get(connectionData.source);
      const targetNode = nodeMap.get(connectionData.target);
      
      if (sourceNode && targetNode) {
        const connection = new editor.getSchemes().Connection(
          sourceNode,
          connectionData.sourceOutput,
          targetNode,
          connectionData.targetInput
        );
        await editor.addConnection(connection);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to deserialize workflow:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};