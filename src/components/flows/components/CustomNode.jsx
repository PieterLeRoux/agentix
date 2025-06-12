import { useMemo } from 'react';
import { css } from '@emotion/css';
import { 
  SmartToy as AgentIcon,
  PlayArrow as StartIcon,
  Groups as SquadIcon,
  Flag as GoalIcon,
  Category as GroupIcon,
  Transform as TransformerIcon,
  AccountTree as FlowIcon,
  Stop as EndIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  CheckCircle as SuccessIcon,
  PlayCircle as RunningIcon,
} from '@mui/icons-material';
import { Box, Chip, useTheme } from '@mui/material';
import { Presets } from 'rete-react-plugin';

const getNodeIcon = (nodeType) => {
  switch (nodeType) {
    case 'agent': return AgentIcon;
    case 'squad': return SquadIcon;
    case 'goal': return GoalIcon;
    case 'group': return GroupIcon;
    case 'transformer': return TransformerIcon;
    case 'flow': return FlowIcon;
    default: return AgentIcon;
  }
};

const getNodeColor = (nodeType) => {
  switch (nodeType) {
    case 'agent': return '#2196F3';    // Blue
    case 'squad': return '#00BCD4';    // Cyan
    case 'goal': return '#FF9800';     // Orange
    case 'group': return '#9C27B0';    // Purple
    case 'transformer': return '#795548'; // Brown
    case 'flow': return '#607D8B';     // Blue Grey
    default: return '#2196F3';
  }
};

const getStateIcon = (state) => {
  switch (state) {
    case 'error': return ErrorIcon;
    case 'warning': return WarningIcon;
    case 'success': return SuccessIcon;
    case 'running': return RunningIcon;
    default: return null;
  }
};

const getStateColor = (state) => {
  switch (state) {
    case 'error': return '#f44336';
    case 'warning': return '#ff9800';
    case 'success': return '#4caf50';
    case 'running': return '#2196f3';
    default: return 'transparent';
  }
};

export function CustomNode(props) {
  const { data, emit, selected, ...rest } = props;
  const theme = useTheme();
  const nodeType = data.nodeType || 'agent';
  const IconComponent = getNodeIcon(nodeType);
  const nodeColor = getNodeColor(nodeType);
  
  // Enhanced node state management
  const nodeState = data.state || 'default'; // 'default', 'error', 'warning', 'success', 'running'
  const hasErrors = data.validationErrors && data.validationErrors.length > 0;
  const hasWarnings = data.validationWarnings && data.validationWarnings.length > 0;
  const StateIcon = getStateIcon(nodeState);
  
  const actualState = hasErrors ? 'error' : hasWarnings ? 'warning' : nodeState;
  const stateColor = getStateColor(actualState);

  const styles = useMemo(() => css`
    background: ${theme.palette.background.paper};
    border: 2px solid ${selected ? theme.palette.primary.main : nodeColor};
    border-radius: 12px;
    cursor: pointer;
    box-shadow: ${theme.shadows[4]};
    min-width: 180px;
    max-width: 250px;
    overflow: hidden;
    transition: all 0.2s ease-in-out;
    position: relative;
    
    &:hover {
      box-shadow: ${theme.shadows[8]};
      transform: translateY(-2px);
      border-color: ${theme.palette.primary.main};
    }
    
    &.selected {
      border-color: ${theme.palette.primary.main};
      box-shadow: 0 0 0 3px ${theme.palette.primary.main}33;
    }

    .node-header {
      background: linear-gradient(135deg, ${nodeColor} 0%, ${nodeColor}dd 100%);
      color: white;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      
      .header-content {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;
        
        .icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        
        .title {
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin: 0;
        }
      }
      
      .state-indicator {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: ${stateColor};
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        
        svg {
          width: 10px;
          height: 10px;
          color: white;
        }
      }
    }

    .node-body {
      padding: 8px 0;
    }

    .io-section {
      display: flex;
      align-items: center;
      padding: 4px 12px;
      min-height: 24px;
      
      &.input-section {
        justify-content: flex-start;
      }
      
      &.output-section {
        justify-content: flex-end;
      }
      
      .io-label {
        color: ${theme.palette.text.secondary};
        font-size: 12px;
        margin: 0 8px;
        white-space: nowrap;
      }
    }

    .socket {
      display: inline-block;
      cursor: pointer;
      border-radius: 50%;
      border: 3px solid ${theme.palette.background.paper};
      background: ${nodeColor};
      width: 16px;
      height: 16px;
      transition: all 0.2s ease;
      position: relative;
      flex-shrink: 0;
      
      &:hover {
        border-color: ${nodeColor};
        background: ${theme.palette.background.paper};
        transform: scale(1.2);
      }
      
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: currentColor;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
      
      &:hover::after {
        opacity: 1;
      }
    }

    .node-badges {
      position: absolute;
      top: -8px;
      right: -8px;
      display: flex;
      gap: 4px;
      pointer-events: none;
      
      .badge {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 10px;
        font-weight: bold;
        box-shadow: ${theme.shadows[2]};
      }
    }

    .description {
      padding: 8px 12px 4px;
      color: ${theme.palette.text.secondary};
      font-size: 11px;
      line-height: 1.3;
      border-top: 1px solid ${theme.palette.divider};
      background: ${theme.palette.grey[50]};
    }
  `, [theme, nodeColor, selected, stateColor, actualState]);

  return (
    <div 
      className={`${styles} ${selected ? 'selected' : ''}`} 
      data-node-type={nodeType}
      data-node-id={data.id}
    >
      {/* Status badges */}
      {(hasErrors || hasWarnings || StateIcon) && (
        <div className="node-badges">
          {hasErrors && (
            <div className="badge" style={{ background: '#f44336' }}>
              !
            </div>
          )}
          {hasWarnings && !hasErrors && (
            <div className="badge" style={{ background: '#ff9800' }}>
              ⚠
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="node-header">
        <div className="header-content">
          <IconComponent className="icon" />
          <div className="title">{data.label || `${nodeType.charAt(0).toUpperCase()}${nodeType.slice(1)}`}</div>
        </div>
        {StateIcon && actualState !== 'default' && (
          <div className="state-indicator">
            <StateIcon />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="node-body">
        {/* Inputs */}
        {data.inputs && Object.entries(data.inputs).map(([key, input]) => (
          <div key={key} className="io-section input-section">
            <div 
              className="socket" 
              data-socket={input.socket.name}
              onPointerDown={(e) => {
                e.stopPropagation();
                emit({ 
                  type: 'connectionstart', 
                  data: { 
                    socket: input.socket, 
                    side: 'input',
                    key
                  } 
                });
              }}
            />
            <div className="io-label">{input.label || 'Input'}</div>
          </div>
        ))}

        {/* Outputs */}
        {data.outputs && Object.entries(data.outputs).map(([key, output]) => (
          <div key={key} className="io-section output-section">
            <div className="io-label">{output.label || 'Output'}</div>
            <div 
              className="socket" 
              data-socket={output.socket.name}
              onPointerDown={(e) => {
                e.stopPropagation();
                emit({ 
                  type: 'connectionstart', 
                  data: { 
                    socket: output.socket, 
                    side: 'output',
                    key
                  } 
                });
              }}
            />
          </div>
        ))}
      </div>

      {/* Description */}
      {data.description && (
        <div className="description">
          {data.description}
        </div>
      )}
    </div>
  );
}