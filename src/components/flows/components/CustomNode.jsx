import { useMemo } from 'react';
import { css } from '@emotion/css';
import { 
  SmartToy as AgentIcon,
  Groups as SquadIcon,
  Flag as GoalIcon,
  Category as GroupIcon,
  Transform as TransformerIcon,
  AccountTree as FlowIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material';
import { Presets } from 'rete-react-plugin';

const { RefSocket, RefControl } = Presets.classic;

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


// Sort helper function
function sortByIndex(entries) {
  entries.sort((a, b) => {
    const ai = a[1]?.index || 0;
    const bi = b[1]?.index || 0;
    return ai - bi;
  });
}

export function CustomNode(props) {
  const { data, emit, selected } = props;
  const theme = useTheme();
  const nodeType = data.nodeType || 'agent';
  const IconComponent = getNodeIcon(nodeType);
  const nodeColor = getNodeColor(nodeType);
  
  const inputs = Object.entries(data.inputs);
  const outputs = Object.entries(data.outputs);
  const controls = Object.entries(data.controls);
  const { id, label, width, height } = data;
  
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
      text-align: right;
      padding: 4px 12px;
    }
    
    .input {
      text-align: left;
      padding: 4px 12px;
    }
    
    .output-socket {
      text-align: right;
      margin-right: -1px;
      display: inline-block;
    }
    
    .input-socket {
      text-align: left;
      margin-left: -1px;
      display: inline-block;
    }
    
    .input-title,
    .output-title {
      display: none;
    }
    
    .control {
      display: block;
      padding: 6px 12px;
    }
  `, [theme, nodeColor, selected]);

  return (
    <div className={styles} data-testid="node">
      {/* Custom Title */}
      <div className="title" data-testid="title">
        <IconComponent style={{ width: '18px', height: '18px', flexShrink: 0 }} />
        <div>{label || `${nodeType.charAt(0).toUpperCase()}${nodeType.slice(1)}`}</div>
      </div>
      
      {/* Outputs */}
      {outputs.map(([key, output]) =>
        output && (
          <div className="output" key={key} data-testid={`output-${key}`}>
            <div className="output-title" data-testid="output-title">
              {output?.label}
            </div>
            <RefSocket
              name="output-socket"
              side="output"
              emit={emit}
              socketKey={key}
              nodeId={id}
              payload={output.socket}
            />
          </div>
        )
      )}
      
      {/* Controls */}
      {controls.map(([key, control]) => {
        return control ? (
          <RefControl
            key={key}
            name="control"
            emit={emit}
            payload={control}
          />
        ) : null;
      })}
      
      {/* Inputs */}
      {inputs.map(([key, input]) =>
        input && (
          <div className="input" key={key} data-testid={`input-${key}`}>
            <RefSocket
              name="input-socket"
              emit={emit}
              side="input"
              socketKey={key}
              nodeId={id}
              payload={input.socket}
            />
            {input && (!input.control || !input.showControl) && (
              <div className="input-title" data-testid="input-title">
                {input?.label}
              </div>
            )}
            {input?.control && input?.showControl && (
              <span className="input-control">
                <RefControl
                  key={key}
                  name="input-control"
                  emit={emit}
                  payload={input.control}
                />
              </span>
            )}
          </div>
        )
      )}
    </div>
  );
}