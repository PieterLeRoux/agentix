import {
  Box,
  Button,
  Typography,
  Toolbar,
  AppBar,
  IconButton,
  Tooltip,
  Divider,
  ButtonGroup,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  // File operations
  CreateNewFolder as NewIcon,
  Save as SaveIcon,
  SaveAs as SaveAsIcon,
  FolderOpen as LoadIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  
  // Edit operations
  Undo as UndoIcon,
  Redo as RedoIcon,
  ContentCut as CutIcon,
  ContentCopy as CopyIcon,
  ContentPaste as PasteIcon,
  Delete as DeleteIcon,
  
  // View operations
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  FitScreen as FitToViewIcon,
  CenterFocusStrong as ResetZoomIcon,
  
  // Layout operations
  AutoFixHigh as AutoArrangeIcon,
  GridOn as GridIcon,
  
  // Workflow operations
  CheckCircle as ValidateIcon,
  PlayArrow as RunIcon,
  Clear as ClearIcon,
  
  // Menu indicators
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useState } from 'react';

const FlowToolbar = ({ 
  workflowName,
  hasUnsavedChanges,
  canUndo,
  canRedo,
  hasSelection,
  canPaste,
  zoomLevel,
  gridSnap,
  validationErrors,
  
  // File operations
  onNew,
  onSave,
  onSaveAs,
  onLoad,
  onImport,
  onExport,
  
  // Edit operations
  onUndo,
  onRedo,
  onCut,
  onCopy,
  onPaste,
  onDelete,
  
  // View operations
  onZoomIn,
  onZoomOut,
  onFitToView,
  onResetZoom,
  
  // Layout operations
  onAutoArrange,
  onToggleGrid,
  
  // Workflow operations
  onValidate,
  onRun,
  onClear,
}) => {
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [editMenuAnchor, setEditMenuAnchor] = useState(null);
  const [viewMenuAnchor, setViewMenuAnchor] = useState(null);

  const handleFileMenuOpen = (event) => setFileMenuAnchor(event.currentTarget);
  const handleEditMenuOpen = (event) => setEditMenuAnchor(event.currentTarget);
  const handleViewMenuOpen = (event) => setViewMenuAnchor(event.currentTarget);
  
  const handleMenuClose = () => {
    setFileMenuAnchor(null);
    setEditMenuAnchor(null);
    setViewMenuAnchor(null);
  };

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        backgroundColor: 'background.paper',
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      <Toolbar variant="dense" sx={{ gap: 1, minHeight: 56, py: 0.5 }}>
        {/* Workflow Name */}
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            flexGrow: 1, 
            color: 'text.primary',
            fontWeight: 600,
          }}
        >
          {workflowName || 'Untitled Workflow'}
          {hasUnsavedChanges && (
            <Typography 
              component="span" 
              sx={{ color: 'warning.main', ml: 1 }}
            >
              •
            </Typography>
          )}
          {validationErrors > 0 && (
            <Typography 
              component="span" 
              sx={{ color: 'error.main', ml: 1, fontSize: '0.875rem' }}
            >
              ({validationErrors} errors)
            </Typography>
          )}
        </Typography>

        {/* File Menu */}
        <Button
          size="small"
          onClick={handleFileMenuOpen}
          endIcon={<ExpandMoreIcon />}
          sx={{ color: 'text.primary' }}
        >
          File
        </Button>
        <Menu
          anchorEl={fileMenuAnchor}
          open={Boolean(fileMenuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { onNew?.(); handleMenuClose(); }}>
            <ListItemIcon><NewIcon fontSize="small" /></ListItemIcon>
            <ListItemText>New Workflow</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onLoad?.(); handleMenuClose(); }}>
            <ListItemIcon><LoadIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Open...</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { onSave?.(); handleMenuClose(); }}>
            <ListItemIcon><SaveIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Save</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onSaveAs?.(); handleMenuClose(); }}>
            <ListItemIcon><SaveAsIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Save As...</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { onImport?.(); handleMenuClose(); }}>
            <ListItemIcon><ImportIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Import...</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onExport?.(); handleMenuClose(); }}>
            <ListItemIcon><ExportIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Export...</ListItemText>
          </MenuItem>
        </Menu>

        {/* Edit Menu */}
        <Button
          size="small"
          onClick={handleEditMenuOpen}
          endIcon={<ExpandMoreIcon />}
          sx={{ color: 'text.primary' }}
        >
          Edit
        </Button>
        <Menu
          anchorEl={editMenuAnchor}
          open={Boolean(editMenuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { onUndo?.(); handleMenuClose(); }} disabled={!canUndo}>
            <ListItemIcon><UndoIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Undo</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onRedo?.(); handleMenuClose(); }} disabled={!canRedo}>
            <ListItemIcon><RedoIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Redo</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { onCut?.(); handleMenuClose(); }} disabled={!hasSelection}>
            <ListItemIcon><CutIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Cut</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onCopy?.(); handleMenuClose(); }} disabled={!hasSelection}>
            <ListItemIcon><CopyIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Copy</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onPaste?.(); handleMenuClose(); }} disabled={!canPaste}>
            <ListItemIcon><PasteIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Paste</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onDelete?.(); handleMenuClose(); }} disabled={!hasSelection}>
            <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>

        {/* View Menu */}
        <Button
          size="small"
          onClick={handleViewMenuOpen}
          endIcon={<ExpandMoreIcon />}
          sx={{ color: 'text.primary' }}
        >
          View
        </Button>
        <Menu
          anchorEl={viewMenuAnchor}
          open={Boolean(viewMenuAnchor)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => { onZoomIn?.(); handleMenuClose(); }}>
            <ListItemIcon><ZoomInIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Zoom In</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onZoomOut?.(); handleMenuClose(); }}>
            <ListItemIcon><ZoomOutIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Zoom Out</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onFitToView?.(); handleMenuClose(); }}>
            <ListItemIcon><FitToViewIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Fit to View</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => { onResetZoom?.(); handleMenuClose(); }}>
            <ListItemIcon><ResetZoomIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Reset Zoom</ListItemText>
          </MenuItem>
        </Menu>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Quick Actions */}
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Undo (Ctrl+Z)">
            <IconButton 
              size="small" 
              onClick={onUndo}
              disabled={!canUndo}
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Redo (Ctrl+Y)">
            <IconButton 
              size="small" 
              onClick={onRedo}
              disabled={!canRedo}
            >
              <RedoIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Auto Arrange">
            <IconButton size="small" onClick={onAutoArrange}>
              <AutoArrangeIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={`Grid Snap ${gridSnap ? 'On' : 'Off'}`}>
            <IconButton 
              size="small" 
              onClick={onToggleGrid}
              color={gridSnap ? 'primary' : 'default'}
            >
              <GridIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Workflow Actions */}
        <ButtonGroup size="small">
          <Tooltip title="Validate Workflow">
            <Button
              variant="outlined"
              onClick={onValidate}
              startIcon={<ValidateIcon />}
              color={validationErrors > 0 ? 'error' : 'success'}
            >
              Validate
            </Button>
          </Tooltip>
          <Tooltip title="Run Workflow (Coming Soon)">
            <Button
              variant="outlined"
              onClick={onRun}
              startIcon={<RunIcon />}
              disabled
            >
              Run
            </Button>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Save Actions */}
        <Button
          variant="contained"
          size="small"
          startIcon={<SaveIcon />}
          onClick={onSave}
          sx={{ 
            backgroundColor: hasUnsavedChanges ? 'warning.main' : 'primary.main',
            '&:hover': {
              backgroundColor: hasUnsavedChanges ? 'warning.dark' : 'primary.dark',
            }
          }}
        >
          Save
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default FlowToolbar;