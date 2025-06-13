import React, { useMemo } from 'react';
import { css } from '@emotion/css';
import { 
  Groups as TeamsIcon,
  SmartToy as RobotIcon,
  Flag as GoalIcon,
  CheckCircle as ResultIcon,
} from '@mui/icons-material';
import { useTheme, Tooltip } from '@mui/material';
import { Presets } from 'rete-react-plugin';
import { NodeComponentProps, Agent, Goal, Result } from '../../../types/workflow';

const { RefSocket } = Presets.classic;

// Sort helper function
function sortByIndex(entries: [string, Record<string, any>][]) { // eslint-disable-line @typescript-eslint/no-explicit-any
  entries.sort((a, b) => {
    const ai = a[1]?.index || 0;
    const bi = b[1]?.index || 0;
    return ai - bi;
  });
}

// Agent Card Component
interface AgentCardProps {
  agent: Agent;
  isLeader: boolean;
  theme: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

const AgentCard = ({ agent, isLeader, theme }: AgentCardProps) => {
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
    position: relative;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    
    &:hover {
      background: ${theme.palette.action.hover};
      transform: translateY(-1px);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }
    
  `;
  
  return (
    <div className={cardStyles}>
      <RobotIcon sx={{ 
        fontSize: 16, 
        color: isLeader ? theme.palette.warning.main : theme.palette.primary.main 
      }} />
      <span style={{ fontWeight: isLeader ? 600 : 400 }}>{agent.name}</span>
    </div>
  );
};

export function TeamsNodeComponent(props: NodeComponentProps) {
  const { data, emit, selected, onNodeClick } = props;
  const theme = useTheme();
  
  const inputs = Object.entries(data.inputs || {});
  const outputs = Object.entries(data.outputs || {});
  const controls = Object.entries(data.controls || {});
  const { id, label, agents = [], goal = null, result = null } = data as {
    id: string;
    label: string;
    agents: Agent[];
    goal: Goal | null;
    result: Result | null;
    inputs?: Record<string, Record<string, any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
    outputs?: Record<string, Record<string, any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
    controls?: Record<string, Record<string, any>>; // eslint-disable-line @typescript-eslint/no-explicit-any
  };
  
  sortByIndex(inputs as [string, any][]);
  sortByIndex(outputs as [string, any][]);
  sortByIndex(controls as [string, any][]);

  const styles = useMemo(() => css`
    background: ${theme.palette.background.paper};
    border: 2px solid ${selected ? theme.palette.primary.main : theme.palette.info.main};
    border-radius: 12px;
    box-shadow: ${selected 
      ? `${theme.shadows[6]}, 0 0 0 3px ${theme.palette.primary.main}33`
      : theme.shadows[3]};
    min-width: 320px;
    min-height: 220px;
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
      background: linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%);
      color: white;
      padding: 12px 16px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 600;
      font-size: 16px;
      font-family: sans-serif;
    }
    
    .content {
      padding: 12px;
      background: white;
      min-height: 140px;
    }
    
    .agents-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
      margin-top: 8px;
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
  `, [theme, selected]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNodeClick) {
      onNodeClick();
    }
  };

  return (
    <div className={styles} data-testid="node" onClick={handleClick}>
      {/* Header */}
      <div className="title" data-testid="title">
        <TeamsIcon style={{ width: '20px', height: '20px', flexShrink: 0 }} />
        <div style={{ fontSize: '14px' }}>{label || 'Creative Team'}</div>
      </div>
      
      {/* Agent List Content */}
      <div className="content">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '4px' 
        }}>
          <div style={{ fontSize: '11px', color: theme.palette.text.secondary }}>
            Team Members ({agents.length})
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Tooltip title={goal ? `Goal: ${goal.title}` : "No goal set"}>
              <span>
                <GoalIcon sx={{ 
                  fontSize: 16, 
                  color: goal ? theme.palette.primary.main : theme.palette.action.disabled,
                  cursor: 'pointer'
                }} />
              </span>
            </Tooltip>
            <Tooltip title={result ? `Result: ${result.title || result.outcome}` : "No result set"}>
              <span>
                <ResultIcon sx={{ 
                  fontSize: 16, 
                  color: result ? theme.palette.primary.main : theme.palette.action.disabled,
                  cursor: 'pointer'
                }} />
              </span>
            </Tooltip>
          </div>
        </div>
        <div className="agents-grid">
          {agents.map((agent, index) => (
            <AgentCard 
              key={agent.id || index} 
              agent={agent} 
              isLeader={index === 0}
              theme={theme} 
            />
          ))}
        </div>
      </div>
      
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