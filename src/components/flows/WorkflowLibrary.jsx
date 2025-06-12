import { useState, useEffect } from 'react';
import { getWorkflowTemplates } from '../../utils/workflowTemplates';
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
      // Load saved workflows from localStorage
      const saved = localStorage.getItem('axis_workflows');
      const savedWorkflowList = saved ? JSON.parse(saved) : [];
      
      // Ensure savedWorkflowList is an array
      const savedWorkflows = Array.isArray(savedWorkflowList) ? savedWorkflowList : [];
      
      // Load predefined templates from workflow files
      const templates = getWorkflowTemplates();
      
      // Combine saved workflows and templates
      const allWorkflows = [
        // Add templates first (marked as templates)
        ...templates.map(template => ({
          ...template,
          createdAt: template.metadata?.created || new Date().toISOString(),
          modifiedAt: template.metadata?.modified || new Date().toISOString(),
          nodeCount: template.nodes?.length || 0,
          connectionCount: template.connections?.length || 0,
          isFavorite: false,
          tags: template.metadata?.tags || ['template'],
          isTemplate: true, // Mark as template
        })),
        // Add saved workflows
        ...savedWorkflows.map(workflow => ({
          ...workflow,
          id: workflow.id || `workflow_${Date.now()}_${Math.random()}`,
          createdAt: workflow.createdAt || new Date().toISOString(),
          modifiedAt: workflow.modifiedAt || new Date().toISOString(),
          nodeCount: workflow.nodes?.length || 0,
          connectionCount: workflow.connections?.length || 0,
          isFavorite: workflow.isFavorite || false,
          tags: workflow.tags || [],
          isTemplate: false, // Mark as user workflow
        }))
      ];

      setWorkflows(allWorkflows);
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

  // Sort workflows: templates first, then favorites, then by modification date
  const sortedWorkflows = [...filteredWorkflows].sort((a, b) => {
    // Templates first
    if (a.isTemplate && !b.isTemplate) return -1;
    if (!a.isTemplate && b.isTemplate) return 1;
    
    // Within each group, favorites first
    if (a.isFavorite && !b.isFavorite) return -1;
    if (!a.isFavorite && b.isFavorite) return 1;
    
    // Then by modification date
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
                    
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {workflow.name}
                        </Typography>
                        {workflow.isTemplate && (
                          <Chip 
                            label="Template" 
                            size="small" 
                            sx={{ 
                              fontSize: '0.7rem', 
                              height: 20,
                              backgroundColor: 'primary.main',
                              color: 'white',
                              fontWeight: 600
                            }}
                          />
                        )}
                        {workflow.tags?.filter(tag => tag !== 'template').map((tag, i) => (
                          <Chip 
                            key={i}
                            label={tag} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                        ))}
                      </Box>
                      
                      {workflow.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {workflow.description}
                        </Typography>
                      )}
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <RecentIcon sx={{ fontSize: 12 }} />
                          {formatDate(workflow.modifiedAt)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {getWorkflowStats(workflow)}
                        </Typography>
                      </Box>
                    </Box>

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