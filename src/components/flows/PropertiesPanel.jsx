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
      case 'start': return node.startName || 'Start';
      case 'agent': return node.agentName || 'AI Agent';
      case 'human': return node.agentName || 'Human Agent';
      case 'decision': return node.condition || 'Decision';
      case 'end': return node.endName || 'End';
      default: return node.label || 'Node';
    }
  };

  const renderNodeSpecificFields = () => {
    switch (selectedNode.nodeType) {
      case 'start':
        return (
          <TextField
            fullWidth
            label="Name"
            value={selectedNode.startName || ''}
            onChange={(e) => handleFieldChange('startName', e.target.value)}
            sx={{ mb: 2 }}
          />
        );

      case 'agent':
        return (
          <>
            <TextField
              fullWidth
              label="Agent Name"
              value={selectedNode.agentName || ''}
              onChange={(e) => handleFieldChange('agentName', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="System Prompt"
              value={selectedNode.systemPrompt || ''}
              onChange={(e) => handleFieldChange('systemPrompt', e.target.value)}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Model</InputLabel>
              <Select
                value={selectedNode.model || 'gpt-4'}
                onChange={(e) => handleFieldChange('model', e.target.value)}
                label="Model"
              >
                <MenuItem value="gpt-4">GPT-4</MenuItem>
                <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                <MenuItem value="claude-3">Claude 3</MenuItem>
                <MenuItem value="gemini-pro">Gemini Pro</MenuItem>
              </Select>
            </FormControl>
          </>
        );

      case 'human':
        return (
          <>
            <TextField
              fullWidth
              label="Agent Name"
              value={selectedNode.agentName || ''}
              onChange={(e) => handleFieldChange('agentName', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Instructions"
              value={selectedNode.instructions || ''}
              onChange={(e) => handleFieldChange('instructions', e.target.value)}
              sx={{ mb: 2 }}
            />
          </>
        );

      case 'decision':
        return (
          <TextField
            fullWidth
            label="Condition"
            value={selectedNode.condition || ''}
            onChange={(e) => handleFieldChange('condition', e.target.value)}
            sx={{ mb: 2 }}
          />
        );

      case 'end':
        return (
          <TextField
            fullWidth
            label="Name"
            value={selectedNode.endName || ''}
            onChange={(e) => handleFieldChange('endName', e.target.value)}
            sx={{ mb: 2 }}
          />
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
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
        Properties
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