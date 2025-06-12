// Workflow template management utilities

import { ClassicPreset } from 'rete';
import basicWorkflow from '../workflows/basic-workflow.json';
import advancedWorkflow from '../workflows/advanced-workflow.json';

// Available workflow templates
export const WORKFLOW_TEMPLATES = {
  'basic-workflow': basicWorkflow,
  'advanced-workflow': advancedWorkflow,
};

// Get all available templates
export const getWorkflowTemplates = () => {
  return Object.values(WORKFLOW_TEMPLATES);
};

// Get a specific template by ID
export const getWorkflowTemplate = (templateId) => {
  return WORKFLOW_TEMPLATES[templateId] || null;
};

// Load a template into the editor
export const loadWorkflowTemplate = async (templateId, editor, area, nodeFactories) => {
  try {
    const template = getWorkflowTemplate(templateId);
    if (!template) {
      throw new Error(`Template '${templateId}' not found`);
    }

    // Clear existing workflow
    const existingNodes = editor.getNodes();
    const existingConnections = editor.getConnections();
    
    for (const connection of existingConnections) {
      await editor.removeConnection(connection.id);
    }
    
    for (const node of existingNodes) {
      await editor.removeNode(node.id);
    }

    // Create nodes from template
    const nodeMap = new Map();
    for (const nodeData of template.nodes) {
      const factory = nodeFactories[nodeData.nodeType];
      if (factory) {
        // Create node with template data
        const node = factory(nodeData.data);
        node.id = nodeData.id;
        node.label = nodeData.label;
        
        await editor.addNode(node);
        nodeMap.set(nodeData.id, node);
      }
    }

    // Position nodes after all are created (with small delay to ensure area is ready)
    await new Promise(resolve => setTimeout(resolve, 200));
    for (const nodeData of template.nodes) {
      if (area && nodeData.position && nodeMap.has(nodeData.id)) {
        await area.translate(nodeData.id, nodeData.position);
      }
    }

    // Create connections from template
    for (const connectionData of template.connections) {
      const sourceNode = nodeMap.get(connectionData.source);
      const targetNode = nodeMap.get(connectionData.target);
      
      if (sourceNode && targetNode) {
        const sourceOutput = sourceNode.outputs[connectionData.sourceOutput];
        const targetInput = targetNode.inputs[connectionData.targetInput];
        
        if (sourceOutput && targetInput) {
          const connection = new ClassicPreset.Connection(
            sourceNode,
            connectionData.sourceOutput,
            targetNode,
            connectionData.targetInput
          );
          await editor.addConnection(connection);
        }
      }
    }

    return { 
      success: true, 
      workflow: template,
      message: `Loaded template: ${template.name}`
    };
  } catch (error) {
    console.error('Failed to load workflow template:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Check if editor is empty (should load default template)
export const shouldLoadDefaultTemplate = (editor) => {
  return editor.getNodes().length === 0;
};

// Load default template if editor is empty
export const loadDefaultTemplateIfEmpty = async (editor, area, nodeFactories, showNotification) => {
  if (shouldLoadDefaultTemplate(editor)) {
    const result = await loadWorkflowTemplate('basic-workflow', editor, area, nodeFactories);
    if (result.success && showNotification) {
      showNotification(result.message, 'info');
    }
    return result;
  }
  return { success: false, error: 'Editor not empty' };
};