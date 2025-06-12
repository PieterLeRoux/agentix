import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Divider,
} from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';

const PropertiesPanel = ({ selectedNode, onUpdateNode, onDeleteNode }) => {
  if (!selectedNode) {
    return (
      <Paper
        elevation={1}
        sx={{
          width: 300,
          height: '100%',
          p: 2,
          backgroundColor: 'background.paper',
          borderLeft: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Select a node to view its properties
        </Typography>
      </Paper>
    );
  }

  const handleFieldChange = (field, value) => {
    const updatedNode = { ...selectedNode, [field]: value };
    updatedNode.label = getNodeDisplayName(updatedNode);
    onUpdateNode(updatedNode);
  };

  const getNodeDisplayName = (node) => {
    switch (node.nodeType) {
      case 'teams': return node.teamName || 'Team';
      case 'delegates': return node.delegateName || 'Delegate';
      case 'subflows': return node.subFlowName || 'Sub Workflow';
      default: return node.label || 'Node';
    }
  };

  const renderNodeSpecificFields = () => {
    switch (selectedNode.nodeType) {
      case 'teams':
        return (
          <>
            <TextField
              fullWidth
              label="Team Name"
              value={selectedNode.teamName || ''}
              onChange={(e) => handleFieldChange('teamName', e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Team Members
            </Typography>
            <Box sx={{ mb: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
              {selectedNode.agents && selectedNode.agents.map((agent, index) => (
                <Typography key={agent.id} variant="body2" sx={{ py: 0.5 }}>
                  🤖 {agent.name}
                </Typography>
              ))}
            </Box>
            <Typography variant="caption" color="text.secondary">
              Note: Agent management will be available in future updates
            </Typography>
          </>
        );

      case 'delegates':
        return (
          <>
            <TextField
              fullWidth
              label="Delegate Name"
              value={selectedNode.delegateName || ''}
              onChange={(e) => handleFieldChange('delegateName', e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Delegation Strategy</InputLabel>
              <Select
                value={selectedNode.delegationRules?.strategy || 'round-robin'}
                onChange={(e) => handleFieldChange('delegationRules', { 
                  ...selectedNode.delegationRules, 
                  strategy: e.target.value 
                })}
                label="Delegation Strategy"
              >
                <MenuItem value="round-robin">Round Robin</MenuItem>
                <MenuItem value="load-balance">Load Balance</MenuItem>
                <MenuItem value="priority-based">Priority Based</MenuItem>
              </Select>
            </FormControl>
          </>
        );

      case 'subflows':
        return (
          <>
            <TextField
              fullWidth
              label="Sub Flow Name"
              value={selectedNode.subFlowName || ''}
              onChange={(e) => handleFieldChange('subFlowName', e.target.value)}
              sx={{ mb: 2 }}
            />
            <Typography variant="caption" color="text.secondary">
              Sub-flow configuration will be available in Phase 4
            </Typography>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={1}
      sx={{
        width: 300,
        height: '100%',
        p: 2,
        backgroundColor: 'background.paper',
        borderLeft: 1,
        borderColor: 'divider',
        overflow: 'auto',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1 }}>
        {selectedNode.nodeType === 'teams' && selectedNode.teamName 
          ? `Team: ${selectedNode.teamName}`
          : selectedNode.nodeType === 'delegates' && selectedNode.delegateName
          ? `Delegate: ${selectedNode.delegateName}`
          : selectedNode.nodeType === 'subflows' && selectedNode.subFlowName
          ? `Sub Flow: ${selectedNode.subFlowName}`
          : 'Properties'
        }
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {selectedNode.nodeType?.toUpperCase()} NODE
      </Typography>

      {renderNodeSpecificFields()}

      <Divider sx={{ my: 2 }} />

      <Button
        variant="outlined"
        color="error"
        startIcon={<DeleteIcon />}
        fullWidth
        onClick={() => onDeleteNode(selectedNode)}
      >
        Delete Node
      </Button>
    </Paper>
  );
};

export default PropertiesPanel;