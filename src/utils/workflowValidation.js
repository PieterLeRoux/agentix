// Comprehensive workflow validation system

export class ValidationError {
  constructor(type, message, nodeId = null, severity = 'error') {
    this.type = type;
    this.message = message;
    this.nodeId = nodeId;
    this.severity = severity; // 'error', 'warning', 'info'
    this.id = `${type}-${nodeId || 'global'}-${Date.now()}`;
  }
}

export class WorkflowValidator {
  constructor() {
    this.rules = [
      this.validateNodeConfiguration,
      this.validateConnections,
      this.validateNodeTypes,
      this.validateWorkflowStructure,
      this.validateCircularDependencies,
    ];
  }

  validate(editor) {
    const errors = [];
    const nodes = editor.getNodes();
    const connections = editor.getConnections();

    // Run all validation rules
    for (const rule of this.rules) {
      try {
        const ruleErrors = rule.call(this, nodes, connections);
        errors.push(...ruleErrors);
      } catch (error) {
        console.error('Validation rule failed:', error);
        errors.push(new ValidationError(
          'validation_error',
          `Validation rule failed: ${error.message}`,
          null,
          'error'
        ));
      }
    }

    return {
      isValid: errors.filter(e => e.severity === 'error').length === 0,
      errors: errors.filter(e => e.severity === 'error'),
      warnings: errors.filter(e => e.severity === 'warning'),
      info: errors.filter(e => e.severity === 'info'),
      all: errors,
    };
  }

  validateNodeConfiguration(nodes, connections) {
    const errors = [];

    for (const node of nodes) {
      // Check required fields based on node type
      switch (node.nodeType) {
        case 'agent':
          if (!node.agentName || node.agentName.trim() === '') {
            errors.push(new ValidationError(
              'missing_agent_name',
              'Agent name is required',
              node.id,
              'error'
            ));
          }
          if (!node.systemPrompt || node.systemPrompt.trim() === '') {
            errors.push(new ValidationError(
              'missing_system_prompt',
              'System prompt is required for agents',
              node.id,
              'warning'
            ));
          }
          break;

        case 'squad':
          if (!node.squadName || node.squadName.trim() === '') {
            errors.push(new ValidationError(
              'missing_squad_name',
              'Squad name is required',
              node.id,
              'error'
            ));
          }
          if (!node.agents || node.agents.length === 0) {
            errors.push(new ValidationError(
              'empty_squad',
              'Squad must contain at least one agent',
              node.id,
              'warning'
            ));
          }
          break;

        case 'goal':
          if (!node.goalName || node.goalName.trim() === '') {
            errors.push(new ValidationError(
              'missing_goal_name',
              'Goal name is required',
              node.id,
              'error'
            ));
          }
          if (!node.success_criteria || node.success_criteria.trim() === '') {
            errors.push(new ValidationError(
              'missing_success_criteria',
              'Success criteria should be defined for goals',
              node.id,
              'warning'
            ));
          }
          break;

        case 'group':
          if (!node.groupName || node.groupName.trim() === '') {
            errors.push(new ValidationError(
              'missing_group_name',
              'Group name is required',
              node.id,
              'error'
            ));
          }
          break;

        case 'transformer':
          if (!node.transformerName || node.transformerName.trim() === '') {
            errors.push(new ValidationError(
              'missing_transformer_name',
              'Transformer name is required',
              node.id,
              'error'
            ));
          }
          if (!node.code || node.code.trim() === '' || node.code === '// Transform data here\nreturn data;') {
            errors.push(new ValidationError(
              'missing_transformer_code',
              'Transformer code is required',
              node.id,
              'error'
            ));
          }
          break;

        case 'flow':
          if (!node.flowName || node.flowName.trim() === '') {
            errors.push(new ValidationError(
              'missing_flow_name',
              'Flow name is required',
              node.id,
              'error'
            ));
          }
          if (!node.subFlowId || node.subFlowId.trim() === '') {
            errors.push(new ValidationError(
              'missing_subflow_reference',
              'Sub-flow reference is required',
              node.id,
              'error'
            ));
          }
          break;
      }
    }

    return errors;
  }

  validateConnections(nodes, connections) {
    const errors = [];
    const nodeIds = new Set(nodes.map(n => n.id));

    for (const connection of connections) {
      // Check if source and target nodes exist
      if (!nodeIds.has(connection.source)) {
        errors.push(new ValidationError(
          'invalid_connection_source',
          'Connection source node does not exist',
          connection.source,
          'error'
        ));
      }

      if (!nodeIds.has(connection.target)) {
        errors.push(new ValidationError(
          'invalid_connection_target',
          'Connection target node does not exist',
          connection.target,
          'error'
        ));
      }

      // Check for self-connections
      if (connection.source === connection.target) {
        errors.push(new ValidationError(
          'self_connection',
          'Node cannot connect to itself',
          connection.source,
          'error'
        ));
      }
    }

    return errors;
  }

  validateNodeTypes(nodes, connections) {
    const errors = [];
    const nodeMap = new Map(nodes.map(n => [n.id, n]));

    // Check for invalid node type combinations
    for (const connection of connections) {
      const sourceNode = nodeMap.get(connection.source);
      const targetNode = nodeMap.get(connection.target);

      if (sourceNode && targetNode) {
        // Example: Goals should not directly connect to transformers
        if (sourceNode.nodeType === 'goal' && targetNode.nodeType === 'transformer') {
          errors.push(new ValidationError(
            'invalid_connection_type',
            'Goals should not directly connect to transformers',
            sourceNode.id,
            'warning'
          ));
        }
      }
    }

    return errors;
  }

  validateWorkflowStructure(nodes, connections) {
    const errors = [];

    // Check for orphaned nodes (no connections)
    const connectedNodes = new Set();
    connections.forEach(conn => {
      connectedNodes.add(conn.source);
      connectedNodes.add(conn.target);
    });

    for (const node of nodes) {
      if (!connectedNodes.has(node.id) && nodes.length > 1) {
        errors.push(new ValidationError(
          'orphaned_node',
          'Node is not connected to the workflow',
          node.id,
          'warning'
        ));
      }
    }

    // Check for nodes with no outputs (dead ends)
    const nodesWithOutputs = new Set();
    connections.forEach(conn => {
      nodesWithOutputs.add(conn.source);
    });

    for (const node of nodes) {
      if (!nodesWithOutputs.has(node.id) && connectedNodes.has(node.id)) {
        errors.push(new ValidationError(
          'dead_end_node',
          'Node has no outgoing connections (potential dead end)',
          node.id,
          'info'
        ));
      }
    }

    return errors;
  }

  validateCircularDependencies(nodes, connections) {
    const errors = [];
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const visited = new Set();
    const recursionStack = new Set();

    const detectCycle = (nodeId, path = []) => {
      if (recursionStack.has(nodeId)) {
        // Found a cycle
        const cycleStart = path.indexOf(nodeId);
        const cycle = path.slice(cycleStart);
        
        errors.push(new ValidationError(
          'circular_dependency',
          `Circular dependency detected: ${cycle.map(id => nodeMap.get(id)?.label || id).join(' → ')} → ${nodeMap.get(nodeId)?.label || nodeId}`,
          nodeId,
          'error'
        ));
        return true;
      }

      if (visited.has(nodeId)) {
        return false;
      }

      visited.add(nodeId);
      recursionStack.add(nodeId);
      path.push(nodeId);

      // Check all outgoing connections
      const outgoingConnections = connections.filter(conn => conn.source === nodeId);
      for (const connection of outgoingConnections) {
        if (detectCycle(connection.target, [...path])) {
          return true;
        }
      }

      recursionStack.delete(nodeId);
      return false;
    };

    // Check each node for cycles
    for (const node of nodes) {
      if (!visited.has(node.id)) {
        detectCycle(node.id);
      }
    }

    return errors;
  }

  // Get validation summary for UI display
  getValidationSummary(validationResult) {
    const { errors, warnings, info } = validationResult;
    
    return {
      errorCount: errors.length,
      warningCount: warnings.length,
      infoCount: info.length,
      totalIssues: errors.length + warnings.length + info.length,
      isValid: validationResult.isValid,
      summary: this.generateSummaryText(errors, warnings, info),
    };
  }

  generateSummaryText(errors, warnings, info) {
    const parts = [];
    
    if (errors.length > 0) {
      parts.push(`${errors.length} error${errors.length !== 1 ? 's' : ''}`);
    }
    
    if (warnings.length > 0) {
      parts.push(`${warnings.length} warning${warnings.length !== 1 ? 's' : ''}`);
    }
    
    if (info.length > 0) {
      parts.push(`${info.length} suggestion${info.length !== 1 ? 's' : ''}`);
    }

    if (parts.length === 0) {
      return 'Workflow is valid';
    }

    return parts.join(', ');
  }
}