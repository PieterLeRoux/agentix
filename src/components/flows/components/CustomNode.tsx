import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { 
  Groups as TeamsIcon,
  CallSplit as DelegatesIcon,
  AccountTree as SubFlowsIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { Presets } from 'rete-react-plugin';
import { NodeType, NodeComponentProps } from '../../../types/workflow';

const { RefSocket, RefControl } = Presets.classic;

const getNodeIcon = (nodeType: NodeType) => {
  switch (nodeType) {
    case 'teams': return TeamsIcon;
    case 'delegates': return DelegatesIcon;
    case 'subflows': return SubFlowsIcon;
    default: return TeamsIcon;
  }
};

const getNodeColor = (nodeType: NodeType) => {
  switch (nodeType) {
    case 'teams': return '#0288D1';     // Light Blue
    case 'delegates': return '#7B1FA2'; // Purple
    case 'subflows': return '#00796B';  // Teal
    default: return '#0288D1';
  }
};


// Sort helper function
function sortByIndex(entries: [string, any][]) {
  entries.sort((a, b) => {
    const ai = a[1]?.index || 0;
    const bi = b[1]?.index || 0;
    return ai - bi;
  });
}

export function CustomNode(props: NodeComponentProps) {
  const { data, emit, selected, onNodeClick } = props;
  const theme = useTheme();
  const nodeType = data.nodeType || 'agent';
  const IconComponent = getNodeIcon(nodeType);
  const nodeColor = getNodeColor(nodeType);
  
  const inputs = Object.entries(data.inputs || {});
  const outputs = Object.entries(data.outputs || {});
  const controls = Object.entries(data.controls || {});
  const { id, label } = data;
  
  sortByIndex(inputs);
  sortByIndex(outputs);
  sortByIndex(controls);

  const styles = useMemo(() => css`
    background: ${theme.palette.background.paper};
    border: 2px solid ${selected ? theme.palette.primary.main : nodeColor};
    border-radius: 12px;
    box-shadow: ${selected 
      ? `${theme.shadows[6]}, 0 0 0 3px ${theme.palette.primary.main}33`
      : theme.shadows[3]};
    min-width: 180px;
    overflow: hidden;
    transition: all 0.2s ease;
    cursor: pointer;
    position: relative;
    user-select: none;
    box-sizing: border-box;
    
    &:hover {
      box-shadow: ${theme.shadows[6]};
      transform: translateY(-1px);
    }
    
    .title {
      background: linear-gradient(135deg, ${nodeColor} 0%, ${nodeColor}dd 100%);
      color: white;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 14px;
      font-family: sans-serif;
    }
    
    .output {
      background: ${theme.palette.background.paper};
    }
    
    .input {
      background: ${theme.palette.background.paper};
    }
    
    .output-socket {
      display: inline-block;
    }
    
    .input-socket {
      display: inline-block;
    }
    
    .control {
      display: block;
      padding: 6px 12px;
    }
  `, [theme, nodeColor, selected]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNodeClick) {
      onNodeClick();
    }
  };

  return (
    <div className={styles} data-testid="node" onClick={handleClick}>
      {/* Custom Title */}
      <div className="title" data-testid="title">
        <IconComponent style={{ width: '18px', height: '18px', flexShrink: 0 }} />
        <div>{label || `${nodeType.charAt(0).toUpperCase()}${nodeType.slice(1)}`}</div>
      </div>
      
      {/* Controls */}
      {controls.map(([key, control]) => 
        control ? (
          <RefControl
            key={key}
            name="control"
            emit={emit || (() => {})}
            payload={{ ...(control as any), id: (control as any)?.id || key }}
          />
        ) : null
      ) as React.ReactNode}

      {/* Bottom row with sockets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 12px' }}>
        {/* Inputs */}
        {inputs.map(([key, input]) =>
          input && (
            <div className="input" key={key} data-testid={`input-${key}`}>
              <RefSocket
                name="input-socket"
                emit={emit || (() => {})}
                side="input"
                socketKey={key}
                nodeId={id}
                payload={(input as any)?.socket || input}
              />
            </div>
          )
        ) as React.ReactNode}
        
        {/* Outputs */}
        {outputs.map(([key, output]) =>
          output && (
            <div className="output" key={key} data-testid={`output-${key}`}>
              <RefSocket
                name="output-socket"
                side="output"
                emit={emit || (() => {})}
                socketKey={key}
                nodeId={id}
                payload={(output as any)?.socket || output}
              />
            </div>
          )
        ) as React.ReactNode}
      </div>
    </div>
  );
}