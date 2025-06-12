import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemButton,
  IconButton,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Divider,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  AccountTree as WorkflowIcon,
  Search as SearchIcon,
  MoreVert as MoreIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Download as ExportIcon,
  FileCopy as DuplicateIcon,
  Schedule as RecentIcon,
  Star as FavoriteIcon,
  StarBorder as FavoriteBorderIcon,
} from '@mui/icons-material';

export const WorkflowLibrary = ({ 
  open, 
  onClose, 
  onLoadWorkflow, 
  onDeleteWorkflow,
  onExportWorkflow,
  onDuplicateWorkflow 
}) => {
  const [workflows, setWorkflows] = useState([]);
  const [filteredWorkflows, setFilteredWorkflows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedWorkflow, setSelectedWorkflow] = useState(null);

  useEffect(() => {
    loadWorkflows();
  }, [open]);

  useEffect(() => {
    filterWorkflows();
  }, [workflows, searchTerm]);

  const loadWorkflows = () => {
    try {
      const saved = localStorage.getItem('axis_workflows');
      const workflowList = saved ? JSON.parse(saved) : [];
      
      // Ensure workflowList is an array before mapping
      if (!Array.isArray(workflowList)) {
        console.warn('Workflow list is not an array, resetting to empty array');
        setWorkflows([]);
        return;
      }
      
      // Add metadata if missing
      const enrichedWorkflows = workflowList.map(workflow => ({
        ...workflow,
        id: workflow.id || `workflow_${Date.now()}_${Math.random()}`,
        createdAt: workflow.createdAt || new Date().toISOString(),
        modifiedAt: workflow.modifiedAt || new Date().toISOString(),
        nodeCount: workflow.nodes?.length || 0,
        connectionCount: workflow.connections?.length || 0,
        isFavorite: workflow.isFavorite || false,
        tags: workflow.tags || [],
      }));

      setWorkflows(enrichedWorkflows);
    } catch (error) {
      console.error('Failed to load workflows:', error);
      setWorkflows([]);
    }
  };

  const filterWorkflows = () => {
    if (!searchTerm) {
      setFilteredWorkflows(workflows);
      return;
    }

    const filtered = workflows.filter(workflow =>
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    setFilteredWorkflows(filtered);
  };

  const handleMenuOpen = (event, workflow) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
    setSelectedWorkflow(workflow);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedWorkflow(null);
  };

  const handleToggleFavorite = (workflow) => {
    const updatedWorkflows = workflows.map(w =>
      w.id === workflow.id ? { ...w, isFavorite: !w.isFavorite } : w
    );
    setWorkflows(updatedWorkflows);
    
    // Update localStorage
    localStorage.setItem('axis_workflows', JSON.stringify(updatedWorkflows));
    handleMenuClose();
  };

  const handleDelete = (workflow) => {
    if (window.confirm(`Are you sure you want to delete "${workflow.name}"?`)) {
      const updatedWorkflows = workflows.filter(w => w.id !== workflow.id);
      setWorkflows(updatedWorkflows);
      localStorage.setItem('axis_workflows', JSON.stringify(updatedWorkflows));
      onDeleteWorkflow?.(workflow);
    }
    handleMenuClose();
  };

  const handleDuplicate = (workflow) => {
    const duplicated = {
      ...workflow,
      id: `workflow_${Date.now()}_${Math.random()}`,
      name: `${workflow.name} (Copy)`,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    };

    const updatedWorkflows = [...workflows, duplicated];
    setWorkflows(updatedWorkflows);
    localStorage.setItem('axis_workflows', JSON.stringify(updatedWorkflows));
    onDuplicateWorkflow?.(duplicated);
    handleMenuClose();
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Unknown';
    }
  };

  const getWorkflowStats = (workflow) => {
    return `${workflow.nodeCount} nodes • ${workflow.connectionCount} connections`;
  };

  // Sort workflows: favorites first, then by modification date
  const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    return new Date(b.modifiedAt) - new Date(a.modifiedAt);
  });

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { height: '80vh' }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkflowIcon />
              Workflow Library
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {workflows.length} workflow{workflows.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {/* Search */}
          <TextField
            fullWidth
            placeholder="Search workflows..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 2 }}
          />

          {/* Workflow List */}
          {sortedWorkflows.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 4,
              color: 'text.secondary' 
            }}>
              <WorkflowIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" gutterBottom>
                {searchTerm ? 'No workflows found' : 'No workflows saved'}
              </Typography>
              <Typography variant="body2">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Create and save your first workflow to see it here'
                }
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {sortedWorkflows.map((workflow, index) => (
                <Box key={workflow.id}>
                  <ListItemButton
                    onClick={() => onLoadWorkflow(workflow)}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      border: 1,
                      borderColor: 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Box sx={{ position: 'relative' }}>
                        <WorkflowIcon color="primary" />
                        {workflow.isFavorite && (
                          <FavoriteIcon 
                            sx={{ 
                              position: 'absolute',
                              top: -4,
                              right: -4,
                              fontSize: 12,
                              color: 'warning.main'
                            }} 
                          />
                        )}
                      </Box>
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {workflow.name}
                          </Typography>
                          {workflow.tags?.map((tag, i) => (
                            <Chip 
                              key={i}
                              label={tag} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          ))}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          {workflow.description && (
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                              {workflow.description}
                            </Typography>
                          )}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              <RecentIcon sx={{ fontSize: 12, mr: 0.5, verticalAlign: 'middle' }} />
                              {formatDate(workflow.modifiedAt)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {getWorkflowStats(workflow)}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />

                    <IconButton
                      onClick={(e) => handleMenuOpen(e, workflow)}
                      size="small"
                    >
                      <MoreIcon />
                    </IconButton>
                  </ListItemButton>
                  
                  {index < sortedWorkflows.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))}
            </List>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Context Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleToggleFavorite(selectedWorkflow)}>
          <ListItemIcon>
            {selectedWorkflow?.isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </ListItemIcon>
          <ListItemText>
            {selectedWorkflow?.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => handleDuplicate(selectedWorkflow)}>
          <ListItemIcon>
            <DuplicateIcon />
          </ListItemIcon>
          <ListItemText>Duplicate</ListItemText>
        </MenuItem>
        
        <MenuItem onClick={() => { onExportWorkflow?.(selectedWorkflow); handleMenuClose(); }}>
          <ListItemIcon>
            <ExportIcon />
          </ListItemIcon>
          <ListItemText>Export</ListItemText>
        </MenuItem>
        
        <Divider />
        
        <MenuItem 
          onClick={() => handleDelete(selectedWorkflow)}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};