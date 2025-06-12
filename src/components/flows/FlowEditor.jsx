import { useEffect, useRef, useState, useCallback } from 'react';
import { createRoot } from 'react-dom/client';
import { NodeEditor, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { ReactPlugin, Presets as ReactPresets } from 'rete-react-plugin';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDrop } from 'react-dnd';
import { Box, Snackbar, Alert, useTheme } from '@mui/material';
import { TeamsNode } from './nodes/TeamsNode';
import { DelegatesNode } from './nodes/DelegatesNode';
import { SubFlowsNode } from './nodes/SubFlowsNode';
import { CustomNode } from './components/CustomNode';
import { TeamsNodeComponent } from './components/TeamsNodeComponent';
import { DelegatesNodeComponent } from './components/DelegatesNodeComponent';
import { CustomSocket } from './components/CustomSocket';
import { CustomConnection } from './components/CustomConnection';
import NodePalette from './NodePalette';
import PropertiesPanel from './PropertiesPanel';
import FlowToolbar from './FlowToolbar';
import { SelectionBox } from './SelectionBox';
import { Minimap } from './Minimap';
import { WorkflowLibrary } from './WorkflowLibrary';
import { ContextMenu } from './ContextMenu';
import { saveWorkflow, serializeWorkflow, getAllWorkflows } from '../../utils/flowPersistence';
import { loadDefaultTemplateIfEmpty, loadWorkflowTemplate } from '../../utils/workflowTemplates';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useAutoSave } from '../../hooks/useAutoSave';
import { CommandManager, createAddNodeCommand, createRemoveNodeCommand, createUpdateNodeCommand } from '../../utils/commandSystem';
import { WorkflowValidator } from '../../utils/workflowValidation';

const nodeFactories = {
  teams: (data = {}) => {
    const node = new TeamsNode(data.teamName || 'Creative Team');
    node.agents = data.agents || node.agents;
    // Only override if data specifically provides goal/result, otherwise keep defaults
    if (data.goal !== undefined) node.goal = data.goal;
    if (data.result !== undefined) node.result = data.result;
    return node;
  },
  delegates: (data = {}) => {
    const node = new DelegatesNode(data.delegateName || 'Delegate');
    node.delegationRules = data.delegationRules || node.delegationRules;
    node.name = data.name || node.name;
    node.functions = data.functions || node.functions;
    // Only override if data specifically provides testsPassed, otherwise keep default
    if (data.testsPassed !== undefined) node.testsPassed = data.testsPassed;
    return node;
  },
  subflows: (data = {}) => {
    const node = new SubFlowsNode(data.subFlowName || 'Sub Workflow');
    node.subFlowId = data.subFlowId || node.subFlowId;
    node.nestedWorkflow = data.nestedWorkflow || node.nestedWorkflow;
    return node;
  },
};

function DropCanvas({ onDrop, children }) {
  const [{ isOver }, drop] = useDrop({
    accept: 'NODE',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (offset) {
        onDrop(item.nodeType, { x: offset.x - 250, y: offset.y - 100 }); // Adjust for node palette
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <Box
      ref={drop}
      sx={{
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
        backgroundColor: isOver ? 'action.hover' : 'background.default',
        transition: 'background-color 0.2s',
      }}
    >
      {children}
    </Box>
  );
}

const FlowEditor = () => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const areaRef = useRef(null);
  const commandManagerRef = useRef(new CommandManager());
  const validatorRef = useRef(new WorkflowValidator());
  
  // Enhanced state management
  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedNodes, setSelectedNodes] = useState(new Set());
  const [workflowName, setWorkflowName] = useState('Untitled Workflow');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  
  // Command system state
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [clipboard, setClipboard] = useState(null);
  
  // View state
  const [zoomLevel, setZoomLevel] = useState(1);
  const [minimapVisible, setMinimapVisible] = useState(true);
  
  // Validation state
  const [validationResult, setValidationResult] = useState({ isValid: true, errors: [], warnings: [], all: [] });
  
  // UI state
  const [workflowLibraryOpen, setWorkflowLibraryOpen] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
  };

  // Auto-save integration
  const { startAutoSave, stopAutoSave, resetAutoSave } = useAutoSave({
    enabled: autoSaveEnabled,
    interval: 30000, // 30 seconds
    onSave: () => handleSave(),
    hasUnsavedChanges,
    showNotification,
  });

  // Command system integration
  useEffect(() => {
    const commandManager = commandManagerRef.current;
    const listener = (state) => {
      setCanUndo(state.canUndo);
      setCanRedo(state.canRedo);
    };
    
    commandManager.addListener(listener);
    return () => commandManager.removeListener(listener);
  }, []);

  // Validation system
  const validateWorkflow = useCallback(() => {
    if (!editorRef.current) return;
    
    const result = validatorRef.current.validate(editorRef.current);
    setValidationResult(result);
    
    // Update node validation states
    const nodes = editorRef.current.getNodes();
    nodes.forEach(node => {
      const nodeErrors = result.all.filter(error => error.nodeId === node.id && error.severity === 'error');
      const nodeWarnings = result.all.filter(error => error.nodeId === node.id && error.severity === 'warning');
      
      node.validationErrors = nodeErrors;
      node.validationWarnings = nodeWarnings;
    });
    
    // Trigger re-render
    if (areaRef.current) {
      areaRef.current.update('node', nodes.map(n => n.id));
    }
    
    return result;
  }, []);

  // Enhanced toolbar handlers
  const handleNew = useCallback(async () => {
    if (hasUnsavedChanges) {
      const confirmNew = window.confirm('You have unsaved changes. Are you sure you want to create a new workflow?');
      if (!confirmNew) return;
    }
    
    // Clear workflow inline
    if (editorRef.current) {
      const nodes = editorRef.current.getNodes();
      const connections = editorRef.current.getConnections();
      
      for (const connection of connections) {
        await editorRef.current.removeConnection(connection.id);
      }
      
      for (const node of nodes) {
        await editorRef.current.removeNode(node.id);
      }
    }
    
    setSelectedNode(null);
    setSelectedNodes(new Set());
    setWorkflowName('Untitled Workflow');
    setHasUnsavedChanges(false);
    commandManagerRef.current.clear();
    setValidationResult({ isValid: true, errors: [], warnings: [], all: [] });
    showNotification('New workflow created', 'info');
  }, [hasUnsavedChanges]);

  const handleSaveAs = useCallback(() => {
    const newName = window.prompt('Enter workflow name:', workflowName);
    if (newName && newName.trim()) {
      setWorkflowName(newName.trim());
      setTimeout(() => handleSave(), 100);
    }
  }, [workflowName]);

  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target.result);
            // TODO: Load workflow data
            showNotification(`Imported ${file.name}`, 'success');
          } catch (error) {
            showNotification(`Failed to import: ${error.message}`, 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }, []);

  const handleExport = useCallback(() => {
    if (!editorRef.current) return;
    
    const workflowData = serializeWorkflow(editorRef.current, workflowName);
    if (workflowData) {
      const blob = new Blob([JSON.stringify(workflowData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${workflowName.replace(/[^a-z0-9]/gi, '_')}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('Workflow exported', 'success');
    }
  }, [workflowName]);

  const handleUndo = useCallback(() => {
    if (commandManagerRef.current.undo()) {
      setHasUnsavedChanges(true);
      validateWorkflow();
      showNotification('Undid last action', 'info');
    }
  }, [validateWorkflow]);

  const handleRedo = useCallback(() => {
    if (commandManagerRef.current.redo()) {
      setHasUnsavedChanges(true);
      validateWorkflow();
      showNotification('Redid last action', 'info');
    }
  }, [validateWorkflow]);

  const handleCut = useCallback(() => {
    if (selectedNode) {
      setClipboard({ type: 'node', data: { ...selectedNode } });
      handleDeleteNode(selectedNode);
      showNotification('Node cut to clipboard', 'info');
    }
  }, [selectedNode]);

  const handleCopy = useCallback(() => {
    if (selectedNode) {
      setClipboard({ type: 'node', data: { ...selectedNode } });
      showNotification('Node copied to clipboard', 'info');
    }
  }, [selectedNode]);

  const handlePaste = useCallback(async () => {
    if (!clipboard || !editorRef.current) return;
    
    if (clipboard.type === 'node') {
      const nodeData = { ...clipboard.data };
      
      const factory = nodeFactories[nodeData.nodeType];
      if (factory) {
        const node = factory(nodeData);
        // Node already has a unique ID from its constructor, no need to override
        const command = createAddNodeCommand(editorRef.current, node, { x: 100, y: 100 });
        commandManagerRef.current.executeCommand(command);
        setHasUnsavedChanges(true);
        validateWorkflow();
        showNotification('Node pasted', 'success');
      }
    }
  }, [clipboard, validateWorkflow]);

  const handleSelectAll = useCallback(() => {
    if (!editorRef.current) return;
    
    const nodes = editorRef.current.getNodes();
    setSelectedNodes(new Set(nodes.map(n => n.id)));
    showNotification(`Selected ${nodes.length} nodes`, 'info');
  }, []);

  // View operations
  const handleZoomIn = useCallback(() => {
    if (areaRef.current) {
      const transform = areaRef.current.area.getTransform();
      const newZoom = Math.min(transform.k * 1.2, 3);
      areaRef.current.area.zoom(newZoom, transform.x, transform.y);
      setZoomLevel(newZoom);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (areaRef.current) {
      const transform = areaRef.current.area.getTransform();
      const newZoom = Math.max(transform.k / 1.2, 0.1);
      areaRef.current.area.zoom(newZoom, transform.x, transform.y);
      setZoomLevel(newZoom);
    }
  }, []);

  const handleFitToView = useCallback(() => {
    if (areaRef.current && editorRef.current) {
      const nodes = editorRef.current.getNodes();
      if (nodes.length === 0) {
        showNotification('No nodes to fit', 'info');
        return;
      }
      
      // Calculate bounding box of all nodes
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      
      nodes.forEach(node => {
        const view = areaRef.current.nodeViews.get(node.id);
        if (view) {
          const { x, y } = view.position;
          minX = Math.min(minX, x);
          minY = Math.min(minY, y);
          maxX = Math.max(maxX, x + 200); // Approximate node width
          maxY = Math.max(maxY, y + 100); // Approximate node height
        }
      });
      
      if (minX !== Infinity) {
        const container = areaRef.current.container;
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const padding = 100;
        
        // Calculate zoom to fit all nodes with padding
        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const scaleX = (containerWidth - padding * 2) / contentWidth;
        const scaleY = (containerHeight - padding * 2) / contentHeight;
        const newZoom = Math.min(scaleX, scaleY, 1.5); // Allow zoom up to 150%
        
        // Center the view on the content
        const x = containerWidth / 2 - centerX * newZoom;
        const y = containerHeight / 2 - centerY * newZoom;
        
        // Use the area's transform method
        areaRef.current.area.setTransform(x, y, newZoom);
        setZoomLevel(newZoom);
        showNotification('Fit to view completed', 'success');
      }
    }
  }, []);

  const handleResetZoom = useCallback(() => {
    if (areaRef.current) {
      areaRef.current.area.zoom(1, 0, 0);
      setZoomLevel(1);
    }
  }, []);

  const handleAutoArrange = useCallback(async () => {
    if (!editorRef.current || !areaRef.current) {
      console.log('No editor or area ref available');
      return;
    }
    
    const nodes = editorRef.current.getNodes();
    
    if (nodes.length === 0) {
      showNotification('No nodes to arrange', 'info');
      return;
    }
    
    // Simple grid arrangement with proper spacing
    for (let index = 0; index < nodes.length; index++) {
      const node = nodes[index];
      const x = (index % 3) * 500 + 100; // Increased horizontal spacing
      const y = Math.floor(index / 3) * 400 + 100; // Increased vertical spacing  
      await areaRef.current.translate(node.id, { x, y });
    }
    
    setHasUnsavedChanges(true);
    showNotification('Nodes auto-arranged', 'success');
  }, []);


  const handleValidate = useCallback(() => {
    const result = validateWorkflow();
    const summary = validatorRef.current.getValidationSummary(result);
    showNotification(summary.summary, result.isValid ? 'success' : 'error');
  }, [validateWorkflow]);

  const handleRun = useCallback(() => {
    showNotification('Workflow execution coming soon!', 'info');
  }, []);

  // Multi-selection handlers
  const handleSelectionChange = useCallback((nodeIds) => {
    setSelectedNodes(new Set(nodeIds));
    if (nodeIds.length === 1) {
      const node = editorRef.current?.getNode(nodeIds[0]);
      setSelectedNode(node || null);
    } else {
      setSelectedNode(null);
    }
    
    if (nodeIds.length > 0) {
      showNotification(`Selected ${nodeIds.length} node${nodeIds.length !== 1 ? 's' : ''}`, 'info');
    }
  }, []);

  const handleBulkDelete = useCallback(async () => {
    if (!editorRef.current || selectedNodes.size === 0) return;
    
    const confirmDelete = window.confirm(`Delete ${selectedNodes.size} selected nodes?`);
    if (!confirmDelete) return;

    const nodeIds = Array.from(selectedNodes);
    
    // Delete all selected nodes
    for (const nodeId of nodeIds) {
      const command = createRemoveNodeCommand(editorRef.current, nodeId);
      try {
        await commandManagerRef.current.executeCommand(command);
      } catch (error) {
        console.error(`Failed to delete node ${nodeId}:`, error);
      }
    }

    setSelectedNodes(new Set());
    setSelectedNode(null);
    setHasUnsavedChanges(true);
    validateWorkflow();
    showNotification(`Deleted ${nodeIds.length} nodes`, 'info');
  }, [selectedNodes, validateWorkflow]);

  // Workflow Library handlers
  const handleOpenWorkflowLibrary = useCallback(() => {
    setWorkflowLibraryOpen(true);
  }, []);

  const handleLoadWorkflowFromLibrary = useCallback(async (workflow) => {
    if (!editorRef.current) return;

    if (hasUnsavedChanges) {
      const confirmLoad = window.confirm('You have unsaved changes. Load this workflow anyway?');
      if (!confirmLoad) return;
    }

    try {
      // Reset UI state
      setSelectedNode(null);
      setSelectedNodes(new Set());
      commandManagerRef.current.clear();
      setValidationResult({ isValid: true, errors: [], warnings: [], all: [] });
      
      // Load workflow data
      setWorkflowName(workflow.name);
      
      if (workflow.isTemplate) {
        // Load template using the template system
        const result = await loadWorkflowTemplate(workflow.id, editorRef.current, areaRef.current, nodeFactories);
        if (result.success) {
          showNotification(`Loaded template "${workflow.name}"`, 'success');
        } else {
          showNotification(`Failed to load template: ${result.error}`, 'error');
          return;
        }
      } else {
        // Load regular workflow (deserialize from saved data)
        // Create nodes from workflow data
        const nodeMap = new Map();
        for (const nodeData of workflow.nodes || []) {
          const factory = nodeFactories[nodeData.nodeType];
          if (factory) {
            const node = factory(nodeData.data);
            node.id = nodeData.id;
            node.label = nodeData.label;
            
            await editorRef.current.addNode(node);
            
            // Position the node if area is available
            if (areaRef.current && nodeData.position) {
              await areaRef.current.translate(node.id, nodeData.position);
            }
            
            nodeMap.set(nodeData.id, node);
          }
        }

        // Create connections from workflow data
        for (const connectionData of workflow.connections || []) {
          const sourceNode = nodeMap.get(connectionData.source);
          const targetNode = nodeMap.get(connectionData.target);
          
          if (sourceNode && targetNode) {
            const sourceOutput = sourceNode.outputs[connectionData.sourceOutput];
            const targetInput = targetNode.inputs[connectionData.targetInput];
            
            if (sourceOutput && targetInput) {
              const Connection = editorRef.current.constructor.Connection || ClassicPreset.Connection;
              const connection = new Connection(
                sourceNode,
                connectionData.sourceOutput,
                targetNode,
                connectionData.targetInput
              );
              await editorRef.current.addConnection(connection);
            }
          }
        }
        
        showNotification(`Loaded workflow "${workflow.name}"`, 'success');
      }
      
      setWorkflowLibraryOpen(false);
      setHasUnsavedChanges(false);
      resetAutoSave();
    } catch (error) {
      showNotification(`Failed to load workflow: ${error.message}`, 'error');
      setWorkflowLibraryOpen(false);
    }
  }, [hasUnsavedChanges, resetAutoSave]);

  const handleExportWorkflow = useCallback((workflow) => {
    const blob = new Blob([JSON.stringify(workflow, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${workflow.name.replace(/[^a-z0-9]/gi, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification(`Exported "${workflow.name}"`, 'success');
  }, []);

  const handleDuplicateWorkflow = useCallback((workflow) => {
    showNotification(`Duplicated "${workflow.name}"`, 'success');
  }, []);

  // Minimap handlers
  const handleMinimapNodeClick = useCallback((nodeId) => {
    if (!editorRef.current || !areaRef.current) return;
    
    const node = editorRef.current.getNode(nodeId);
    if (node) {
      setSelectedNode(node);
      setSelectedNodes(new Set([nodeId]));
      
      // Focus on the node
      const view = areaRef.current.nodeViews.get(nodeId);
      if (view) {
        areaRef.current.area?.setTransform(
          -view.position.x + 200,
          -view.position.y + 200,
          zoomLevel
        );
      }
    }
  }, [zoomLevel]);

  const createNodeAtPosition = useCallback(async (nodeType, position) => {
    if (!editorRef.current) return;

    const factory = nodeFactories[nodeType];
    if (!factory) return;

    const node = factory();
    const command = createAddNodeCommand(editorRef.current, node, position);
    
    try {
      await commandManagerRef.current.executeCommand(command);
      setHasUnsavedChanges(true);
      validateWorkflow();
      showNotification(`Added ${nodeType} node`, 'success');
    } catch (error) {
      showNotification(`Failed to add node: ${error.message}`, 'error');
    }
  }, [validateWorkflow]);

  const handleUpdateNode = useCallback(async (updatedNode) => {
    if (!editorRef.current) return;

    const node = editorRef.current.getNode(updatedNode.id);
    if (node) {
      const oldData = { ...node };
      const command = createUpdateNodeCommand(editorRef.current, updatedNode.id, oldData, updatedNode);
      
      try {
        await commandManagerRef.current.executeCommand(command);
        setSelectedNode(updatedNode);
        setHasUnsavedChanges(true);
        validateWorkflow();
      } catch (error) {
        showNotification(`Failed to update node: ${error.message}`, 'error');
      }
    }
  }, [validateWorkflow]);

  const handleDeleteNode = useCallback(async (nodeToDelete) => {
    if (!editorRef.current) return;

    const command = createRemoveNodeCommand(editorRef.current, nodeToDelete.id);
    
    try {
      await commandManagerRef.current.executeCommand(command);
      setSelectedNode(null);
      setHasUnsavedChanges(true);
      validateWorkflow();
      showNotification('Node deleted', 'info');
    } catch (error) {
      showNotification(`Failed to delete node: ${error.message}`, 'error');
    }
  }, [validateWorkflow]);

  // Context menu handlers
  const handleContextMenu = useCallback((event) => {
    event.preventDefault();
    
    // Check if right-clicking on a node
    const nodeElement = event.target.closest('[data-testid="node"]');
    if (nodeElement) {
      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        type: 'node',
      });
    } else {
      // Right-clicking on canvas
      const canvasRect = containerRef.current?.getBoundingClientRect();
      if (canvasRect) {
        setContextMenu({
          x: event.clientX,
          y: event.clientY,
          type: 'canvas',
          canvasX: event.clientX - canvasRect.left,
          canvasY: event.clientY - canvasRect.top,
        });
      }
    }
  }, []);

  const handleCloseContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleContextCreateNode = useCallback(async (nodeType, contextMenuData) => {
    if (!editorRef.current || !areaRef.current) return;

    const factory = nodeFactories[nodeType];
    if (!factory) return;

    // Convert screen coordinates to canvas coordinates
    const area = areaRef.current.area;
    const transform = area.getTransform();
    const canvasX = (contextMenuData.canvasX - transform.x) / transform.k;
    const canvasY = (contextMenuData.canvasY - transform.y) / transform.k;

    const node = factory();
    const command = createAddNodeCommand(editorRef.current, node, { x: canvasX, y: canvasY });
    
    try {
      await commandManagerRef.current.executeCommand(command);
      setHasUnsavedChanges(true);
      validateWorkflow();
      showNotification(`Added ${nodeType} node`, 'success');
    } catch (error) {
      showNotification(`Failed to add node: ${error.message}`, 'error');
    }
  }, [validateWorkflow]);

  const handleSave = useCallback(() => {
    if (!editorRef.current) return;

    const workflowData = serializeWorkflow(editorRef.current, workflowName);
    if (workflowData) {
      const result = saveWorkflow(workflowData);
      if (result.success) {
        setHasUnsavedChanges(false);
        showNotification('Workflow saved successfully', 'success');
      } else {
        showNotification(`Save failed: ${result.error}`, 'error');
      }
    }
  }, [workflowName]);

  const handleLoad = useCallback(() => {
    // Open workflow library instead of loading the most recent
    setWorkflowLibraryOpen(true);
  }, []);

  const handleWorkflowNameChange = useCallback((newName) => {
    setWorkflowName(newName);
    setHasUnsavedChanges(true);
  }, []);

  const handleClear = useCallback(async () => {
    if (!editorRef.current) return;

    const confirmClear = window.confirm('Are you sure you want to clear the entire workflow?');
    if (!confirmClear) return;

    const nodes = editorRef.current.getNodes();
    const connections = editorRef.current.getConnections();
    
    for (const connection of connections) {
      await editorRef.current.removeConnection(connection.id);
    }
    
    for (const node of nodes) {
      await editorRef.current.removeNode(node.id);
    }
    
    setSelectedNode(null);
    setSelectedNodes(new Set());
    setHasUnsavedChanges(true);
    commandManagerRef.current.clear();
    setValidationResult({ isValid: true, errors: [], warnings: [], all: [] });
    showNotification('Workflow cleared', 'info');
  }, []);

  // Keyboard shortcuts integration
  useKeyboardShortcuts({
    onSave: handleSave,
    onUndo: handleUndo,
    onRedo: handleRedo,
    onCopy: handleCopy,
    onCut: handleCut,
    onPaste: handlePaste,
    onDelete: () => {
      if (selectedNodes.size > 1) {
        handleBulkDelete();
      } else if (selectedNode) {
        handleDeleteNode(selectedNode);
      }
    },
    onSelectAll: handleSelectAll,
    onZoomIn: handleZoomIn,
    onZoomOut: handleZoomOut,
    onNew: handleNew,
    enabled: true,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    async function createEditor() {
      if (!containerRef.current) return;

      // Create editor and plugins
      const editor = new NodeEditor();
      const area = new AreaPlugin(containerRef.current);
      const connection = new ConnectionPlugin();
      const reactRender = new ReactPlugin({ createRoot });

      editorRef.current = editor;
      areaRef.current = area;

      // Disable built-in selector to avoid conflicts
      // const selector = AreaExtensions.selector();
      // AreaExtensions.selectableNodes(area, selector, {
      //   accumulating: AreaExtensions.accumulateOnCtrl()
      // });

      // Setup react rendering with custom components
      reactRender.addPreset(ReactPresets.classic.setup({
        customize: {
          node(context) {
            // Use custom components for specific node types with node selection callback
            const NodeComponent = context.payload.nodeType === 'teams' ? TeamsNodeComponent :
                                 context.payload.nodeType === 'delegates' ? DelegatesNodeComponent :
                                 CustomNode;
            
            // Wrap the component to pass selection handler and enhanced data
            return (props) => {
              const handleNodeClick = () => {
                const node = editor.getNode(context.payload.id);
                if (node) {
                  setSelectedNode(node);
                  setSelectedNodes(new Set([context.payload.id]));
                }
              };
              
              // Get the actual node instance to access custom properties
              const node = editor.getNode(context.payload.id);
              const enhancedData = {
                ...props.data,
                goal: node?.goal || null,
                result: node?.result || null,
                agents: node?.agents || [],
                teamName: node?.teamName || props.data.label,
                testsPassed: node?.testsPassed || false,
                name: node?.name || '',
                functions: node?.functions || []
              };
              
              return <NodeComponent {...props} data={enhancedData} onNodeClick={handleNodeClick} />;
            };
          },
          socket(context) {
            // Use CustomSocket for all sockets
            return CustomSocket;
          },
          connection(context) {
            // Use CustomConnection for all connections
            return CustomConnection;
          }
        }
      }));

      // Setup connections
      connection.addPreset(ConnectionPresets.classic.setup());

      // Use plugins
      editor.use(area);
      area.use(connection);
      area.use(reactRender);

      // Simple nodes order and zoom/pan extensions
      AreaExtensions.simpleNodesOrder(area);
      AreaExtensions.zoomAt(area, editor.getNodes());
      
      // Set up zoom and pan controls
      area.area.setPointerCapture = area.area.setPointerCapture || (() => {});
      area.area.releasePointerCapture = area.area.releasePointerCapture || (() => {});

      // Remove built-in selector event handling since we're using custom selection
      // selector.add(area, 'selected');
      
      // area.addPipe(context => {
      //   if (context.type === 'selected') {
      //     // Update our state based on actual selection
      //     const selectedIds = context.data;
      //     setSelectedNodes(new Set(selectedIds));
      //     
      //     if (selectedIds.length === 1) {
      //       const node = editor.getNode(selectedIds[0]);
      //       setSelectedNode(node || null);
      //     } else {
      //       setSelectedNode(null);
      //     }
      //   }
      //   
      //   return context;
      // });

      // Keyboard shortcuts
      const handleKeyPress = (e) => {
        if (e.key === 'Delete' && selectedNode) {
          handleDeleteNode(selectedNode);
        }
        if (e.ctrlKey && e.key === 's') {
          e.preventDefault();
          handleSave();
        }
      };

      document.addEventListener('keydown', handleKeyPress);

      // Load default template if editor is empty (disabled for now)
      // setTimeout(async () => {
      //   await loadDefaultTemplateIfEmpty(editor, area, nodeFactories, showNotification);
      // }, 100);

      return () => {
        document.removeEventListener('keydown', handleKeyPress);
        area.destroy();
      };
    }

    const cleanup = createEditor().catch(console.error);

    return () => {
      cleanup.then(fn => fn && fn());
    };
  }, []); // Remove dependencies that cause editor recreation

  return (
    <DndProvider backend={HTML5Backend}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        flex: 1
      }}>
        <FlowToolbar
          workflowName={workflowName}
          hasUnsavedChanges={hasUnsavedChanges}
          canUndo={canUndo}
          canRedo={canRedo}
          hasSelection={Boolean(selectedNode)}
          canPaste={Boolean(clipboard)}
          zoomLevel={zoomLevel}
          validationErrors={validationResult.errors.length}
          
          // File operations
          onNew={handleNew}
          onSave={handleSave}
          onSaveAs={handleSaveAs}
          onLoad={handleLoad}
          onImport={handleImport}
          onExport={handleExport}
          
          // Edit operations
          onUndo={handleUndo}
          onRedo={handleRedo}
          onCut={handleCut}
          onCopy={handleCopy}
          onPaste={handlePaste}
          onDelete={() => selectedNode && handleDeleteNode(selectedNode)}
          
          // View operations
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onFitToView={handleFitToView}
          onResetZoom={handleResetZoom}
          
          // Layout operations
          onAutoArrange={handleAutoArrange}
          
          // Workflow operations
          onValidate={handleValidate}
          onRun={handleRun}
          onClear={handleClear}
          
          // Workflow name operations
          onWorkflowNameChange={handleWorkflowNameChange}
        />
        
        <Box sx={{ 
          display: 'flex', 
          flex: 1, 
          overflow: 'hidden',
          minHeight: 0, // Allows flex child to shrink
          width: '100%'
        }}>
          <NodePalette />
          
          <SelectionBox onSelectionChange={handleSelectionChange} sx={{ flex: 1, height: '100%' }}>
            <DropCanvas onDrop={createNodeAtPosition}>
              <Box
                ref={containerRef}
                onContextMenu={handleContextMenu}
                onClick={(e) => {
                  // Clear selection when clicking on canvas background
                  if (e.target === e.currentTarget || e.target.classList.contains('rete-area')) {
                    setSelectedNode(null);
                    setSelectedNodes(new Set());
                  }
                }}
                sx={{
                  flex: 1,
                  height: '100%',
                  width: '100%',
                  minHeight: '600px',
                  position: 'relative',
                  overflow: 'hidden',
                  '& .rete': {
                    width: '100%',
                    height: '100%',
                    fontFamily: theme.typography.fontFamily,
                  },
                  '& .rete-area': {
                    width: '100%',
                    height: '100%',
                    backgroundColor: theme.palette.mode === 'dark' ? '#1e1e1e' : '#f8f9fa',
                    transition: 'background-color 0.3s ease',
                  },
                }}
              />
            </DropCanvas>
          </SelectionBox>

          {/* Properties Panel - Only show when node is selected */}
          {selectedNode && (
            <PropertiesPanel
              selectedNode={selectedNode}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={handleDeleteNode}
            />
          )}

          {/* Minimap */}
          <Minimap
            editor={editorRef.current}
            area={areaRef.current}
            visible={minimapVisible}
            onVisibilityChange={setMinimapVisible}
            onNodeClick={handleMinimapNodeClick}
          />
        </Box>
      </Box>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={() => setNotification({ ...notification, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={notification.severity} onClose={() => setNotification({ ...notification, open: false })}>
          {notification.message}
        </Alert>
      </Snackbar>

      {/* Context Menu */}
      <ContextMenu
        contextMenu={contextMenu}
        onClose={handleCloseContextMenu}
        onCut={handleCut}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onDelete={() => selectedNode && handleDeleteNode(selectedNode)}
        onCreateNode={handleContextCreateNode}
        hasSelection={Boolean(selectedNode)}
        canPaste={Boolean(clipboard)}
      />

      {/* Workflow Library */}
      <WorkflowLibrary
        open={workflowLibraryOpen}
        onClose={() => setWorkflowLibraryOpen(false)}
        onLoadWorkflow={handleLoadWorkflowFromLibrary}
        onDeleteWorkflow={() => {}} // Handle in the library component
        onExportWorkflow={handleExportWorkflow}
        onDuplicateWorkflow={handleDuplicateWorkflow}
      />
    </DndProvider>
  );
};

export default FlowEditor;