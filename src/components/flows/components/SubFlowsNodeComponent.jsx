import { useMemo, useState } from 'react';
import { css } from '@emotion/css';
import { 
  AccountTree as SubFlowIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Launch as LaunchIcon,
} from '@mui/icons-material';
import { useTheme, Box, Tooltip, IconButton, Typography } from '@mui/material';
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

// Mini workflow preview component
const WorkflowPreview = ({ workflow, theme }) => {
  const previewStyles = css`
    width: 100%;
    height: 80px;
    background: ${theme.palette.background.default};
    border: 1px solid ${theme.palette.divider};
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: ${theme.palette.primary.main};
      background: ${theme.palette.action.hover};
    }
  `;

  if (!workflow || !workflow.nodes || workflow.nodes.length === 0) {
    return (
      <div className={previewStyles}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 1,
          opacity: 0.6 
        }}>
          <AddIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Empty Workflow
          </Typography>
        </Box>
      </div>
    );
  }

  // Simple visualization of nodes as dots
  const nodeCount = workflow.nodes.length;
  const connectionCount = workflow.connections?.length || 0;

  return (
    <div className={previewStyles}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 0.5 
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 0.5, 
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: '100px'
        }}>
          {Array.from({ length: Math.min(nodeCount, 8) }).map((_, i) => (
            <Box
              key={i}
              sx={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                opacity: 0.8
              }}
            />
          ))}
          {nodeCount > 8 && (
            <Typography variant="caption" sx={{ fontSize: '8px' }}>
              +{nodeCount - 8}
            </Typography>
          )}
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px' }}>
          {nodeCount} nodes • {connectionCount} connections
        </Typography>
      </Box>
    </div>
  );
};

export function SubFlowsNodeComponent({ data, onNodeClick }) {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  // Sort inputs and outputs
  const inputs = useMemo(() => {
    const entries = Object.entries(data.inputs || {});
    sortByIndex(entries);
    return entries;
  }, [data.inputs]);

  const outputs = useMemo(() => {
    const entries = Object.entries(data.outputs || {});
    sortByIndex(entries);
    return entries;
  }, [data.outputs]);

  const controls = useMemo(() => {
    const entries = Object.entries(data.controls || {});
    sortByIndex(entries);
    return entries;
  }, [data.controls]);

  // Get workflow data
  const subFlowName = data.subFlowName || data.label || 'Sub Workflow';
  const nestedWorkflow = data.nestedWorkflow;
  const subFlowId = data.subFlowId;

  const nodeStyles = css`
    background: white;
    border: 2px solid ${theme.palette.success.main};
    border-radius: 12px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    font-family: ${theme.typography.fontFamily};
    width: 280px;
    min-height: 180px;
    
    &:hover {
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
      transform: translateY(-2px);
      border-color: ${theme.palette.success.dark};
    }
  `;

  const headerStyles = css`
    background: linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark});
    color: white;
    padding: 12px 16px;
    border-radius: 10px 10px 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 600;
    font-size: 14px;
    min-height: 20px;
  `;

  const contentStyles = css`
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  `;

  const handleNodeClick = () => {
    onNodeClick?.();
  };

  const handleEditWorkflow = (e) => {
    e.stopPropagation();
    // TODO: Open nested workflow editor
    console.log('Edit sub-workflow:', subFlowId);
  };

  const handleViewWorkflow = (e) => {
    e.stopPropagation();
    // TODO: Open read-only view of nested workflow
    console.log('View sub-workflow:', subFlowId);
  };

  const handleLaunchWorkflow = (e) => {
    e.stopPropagation();
    // TODO: Execute nested workflow
    console.log('Launch sub-workflow:', subFlowId);
  };

  return (
    <div 
      className={nodeStyles}
      onClick={handleNodeClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Inputs */}
      <div className={css`position: absolute; left: -1px; top: 50%; transform: translateY(-50%);`}>
        {inputs.map(([key, input]) => (
          <RefSocket
            key={key}
            name="input-socket"
            side="input"
            socketKey={key}
            nodeId={data.id}
            emit={data.emit}
            payload={input.socket}
          />
        ))}
      </div>

      {/* Outputs */}
      <div className={css`position: absolute; right: -1px; top: 50%; transform: translateY(-50%);`}>
        {outputs.map(([key, output]) => (
          <RefSocket
            key={key}
            name="output-socket"
            side="output"
            socketKey={key}
            nodeId={data.id}
            emit={data.emit}
            payload={output.socket}
          />
        ))}
      </div>

      {/* Header */}
      <div className={headerStyles}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SubFlowIcon sx={{ fontSize: 18 }} />
          <span>{subFlowName}</span>
        </Box>
        
        {isHovered && (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Edit Workflow">
              <IconButton 
                size="small" 
                onClick={handleEditWorkflow}
                sx={{ 
                  color: 'white', 
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } 
                }}
              >
                <EditIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="View Workflow">
              <IconButton 
                size="small" 
                onClick={handleViewWorkflow}
                sx={{ 
                  color: 'white', 
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } 
                }}
              >
                <ViewIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Launch Workflow">
              <IconButton 
                size="small" 
                onClick={handleLaunchWorkflow}
                sx={{ 
                  color: 'white', 
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } 
                }}
              >
                <LaunchIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </div>

      {/* Content */}
      <div className={contentStyles}>
        {/* Workflow Preview */}
        <WorkflowPreview workflow={nestedWorkflow} theme={theme} />
        
        {/* Workflow Info */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '12px',
          color: 'text.secondary'
        }}>
          <span>
            {subFlowId ? `ID: ${subFlowId}` : 'No workflow assigned'}
          </span>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: theme.palette.success.main,
            color: 'white',
            fontSize: '10px',
            fontWeight: 600
          }}>
            <SubFlowIcon sx={{ fontSize: 10 }} />
            SUB FLOW
          </Box>
        </Box>

        {/* Controls */}
        {controls.map(([key, control]) => (
          <RefControl
            key={key}
            name="control"
            payload={control}
            controlKey={key}
            nodeId={data.id}
            emit={data.emit}
          />
        ))}
      </div>
    </div>
  );
}