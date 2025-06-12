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

  const handleFileMenuOpen = (event) => setFileMenuAnchor(event.currentTarget);
  
  const handleMenuClose = () => {
    setFileMenuAnchor(null);
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

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* Edit Actions */}
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
          <Tooltip title="Cut (Ctrl+X)">
            <IconButton 
              size="small" 
              onClick={onCut}
              disabled={!hasSelection}
            >
              <CutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy (Ctrl+C)">
            <IconButton 
              size="small" 
              onClick={onCopy}
              disabled={!hasSelection}
            >
              <CopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Paste (Ctrl+V)">
            <IconButton 
              size="small" 
              onClick={onPaste}
              disabled={!canPaste}
            >
              <PasteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete (Del)">
            <IconButton 
              size="small" 
              onClick={onDelete}
              disabled={!hasSelection}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        {/* View Controls */}
        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Zoom In (Ctrl++)">
            <IconButton size="small" onClick={onZoomIn}>
              <ZoomInIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Zoom Out (Ctrl+-)">
            <IconButton size="small" onClick={onZoomOut}>
              <ZoomOutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Fit to View">
            <IconButton size="small" onClick={onFitToView}>
              <FitToViewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Reset Zoom">
            <IconButton size="small" onClick={onResetZoom}>
              <ResetZoomIcon fontSize="small" />
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