import { useMemo } from 'react';
import { css } from '@emotion/css';
import { useTheme, Tooltip } from '@mui/material';
import { CallSplit as DelegatesIcon, Code as CodeIcon, CheckCircle as TestIcon } from '@mui/icons-material';
import { Presets } from 'rete-react-plugin';

const { RefSocket, RefControl } = Presets.classic;

// Sort helper function
function sortByIndex(entries) {
  entries.sort((a, b) => {
    const ai = a[1]?.index || 0;
    const bi = b[1]?.index || 0;
    return ai - bi;
  });
}

const FunctionCard = ({ functionName, theme }) => {
  const cardStyles = css`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    background: white;
    border: 1px solid ${theme.palette.divider};
    border-radius: 6px;
    font-size: 12px;
    color: ${theme.palette.text.primary};
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background: ${theme.palette.action.hover};
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
  `;

  return (
    <div className={cardStyles}>
      <CodeIcon sx={{ fontSize: 16, color: '#00bcd4' }} />
      <span>{functionName}</span>
    </div>
  );
};

export function DelegatesNodeComponent(props) {
  const { data, emit, selected, onNodeClick } = props;
  const theme = useTheme();

  const inputs = Object.entries(data.inputs);
  const outputs = Object.entries(data.outputs);
  const controls = Object.entries(data.controls);
  const { id, label, testsPassed = false, name = '', functions = [] } = data;

  sortByIndex(inputs);
  sortByIndex(outputs);
  sortByIndex(controls);

  const styles = useMemo(() => css`
    background: ${theme.palette.background.paper};
    border: 2px solid ${selected ? theme.palette.primary.main : '#00bcd4'};
    border-radius: 12px;
    box-shadow: ${selected 
      ? `${theme.shadows[6]}, 0 0 0 3px ${theme.palette.primary.main}33`
      : theme.shadows[3]};
    min-width: 220px;
    min-height: 140px;
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
      background: linear-gradient(135deg, #00bcd4 0%, #00acc1 100%);
      color: white;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 14px;
      font-family: sans-serif;
    }
    
    .content {
      padding: 12px;
      background: white;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .functions-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 8px;
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
  `, [theme, selected]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (onNodeClick) {
      onNodeClick();
    }
  };

  return (
    <div className={styles} data-testid="node" onClick={handleClick}>
      {/* Custom Title */}
      <div className="title" data-testid="title">
        <DelegatesIcon style={{ width: '18px', height: '18px', flexShrink: 0 }} />
        <div>{name || label || 'Data Transformer'}</div>
      </div>

      {/* Content Area */}
      <div className="content">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '4px' 
        }}>
          <div style={{ fontSize: '11px', color: theme.palette.text.secondary }}>
            Functions ({functions.length})
          </div>
          <Tooltip title={testsPassed ? "Tests passed" : "Tests failed"}>
            <span>
              <TestIcon sx={{ 
                fontSize: 16, 
                color: testsPassed ? '#00bcd4' : theme.palette.action.disabled,
                cursor: 'pointer'
              }} />
            </span>
          </Tooltip>
        </div>
        <div className="functions-grid">
          {functions.map((functionName, index) => (
            <FunctionCard 
              key={index}
              functionName={functionName} 
              theme={theme}
            />
          ))}
        </div>
      </div>

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

      {/* Bottom row with sockets */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px 12px' }}>
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
            </div>
          )
        )}
        
        {/* Outputs */}
        {outputs.map(([key, output]) =>
          output && (
            <div className="output" key={key} data-testid={`output-${key}`}>
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
      </div>
    </div>
  );
}