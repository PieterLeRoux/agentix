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
  TextField,
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
  
  // Workflow operations
  CheckCircle as ValidateIcon,
  PlayArrow as RunIcon,
  
  // Menu indicators
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import React, { useState } from 'react';

// Define the props interface
interface FlowToolbarProps {
  workflowName: string;
  hasUnsavedChanges: boolean;
  canUndo: boolean;
  canRedo: boolean;
  hasSelection: boolean;
  canPaste: boolean;
  validationErrors: number;
  
  // File operations
  onNew?: () => void;
  onSave?: () => void;
  onSaveAs?: () => void;
  onLoad?: () => void;
  onImport?: () => void;
  onExport?: () => void;
  
  // Edit operations
  onUndo?: () => void;
  onRedo?: () => void;
  onCut?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  
  // View operations
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFitToView?: () => void;
  onResetZoom?: () => void;
  
  // Layout operations
  onAutoArrange?: () => void;
  
  // Workflow operations
  onValidate?: () => void;
  onRun?: () => void;
  
  // Workflow name operations
  onWorkflowNameChange?: (name: string) => void;
}

const FlowToolbar: React.FC<FlowToolbarProps> = (props) => {
  const { 
    workflowName,
    hasUnsavedChanges,
    canUndo,
    canRedo,
    hasSelection,
    canPaste,
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
    
    // Workflow operations
    onValidate,
    onRun,
    
    // Workflow name operations
    onWorkflowNameChange,
  } = props;
  const [fileMenuAnchor, setFileMenuAnchor] = useState<HTMLElement | null>(null);
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [tempName, setTempName] = useState<string>(workflowName);

  const handleFileMenuOpen = (event: React.MouseEvent<HTMLElement>): void => {
    setFileMenuAnchor(event.currentTarget);
  };
  
  const handleMenuClose = (): void => {
    setFileMenuAnchor(null);
  };

  const handleNameClick = (): void => {
    setTempName(workflowName);
    setIsEditingName(true);
  };

  const handleNameSubmit = (): void => {
    if (tempName.trim() && tempName !== workflowName) {
      onWorkflowNameChange?.(tempName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleNameSubmit();
    } else if (e.key === 'Escape') {
      setTempName(workflowName);
      setIsEditingName(false);
    }
  };

  // Update tempName when workflowName changes externally
  React.useEffect(() => {
    if (!isEditingName) {
      setTempName(workflowName);
    }
  }, [workflowName, isEditingName]);

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
        {/* Workflow Name - Editable */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, gap: 1 }}>
          {isEditingName ? (
            <TextField
              value={tempName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTempName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={handleNameKeyPress}
              autoFocus
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'text.primary',
                  '& fieldset': {
                    borderColor: 'primary.main',
                  },
                },
                minWidth: '200px',
              }}
            />
          ) : (
            <Typography 
              variant="h6" 
              component="div" 
              onClick={handleNameClick}
              sx={{ 
                color: 'text.primary',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {workflowName || 'Untitled Workflow'}
            </Typography>
          )}
          
          {hasUnsavedChanges && (
            <Typography 
              component="span" 
              sx={{ color: 'warning.main' }}
            >
              •
            </Typography>
          )}
          {validationErrors > 0 && (
            <Typography 
              component="span" 
              sx={{ color: 'error.main', fontSize: '0.875rem' }}
            >
              ({validationErrors} errors)
            </Typography>
          )}
        </Box>

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
            <span>
              <IconButton 
                size="small" 
                onClick={onUndo}
                disabled={!canUndo}
              >
                <UndoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Redo (Ctrl+Y)">
            <span>
              <IconButton 
                size="small" 
                onClick={onRedo}
                disabled={!canRedo}
              >
                <RedoIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </ButtonGroup>

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <ButtonGroup size="small" variant="outlined">
          <Tooltip title="Cut (Ctrl+X)">
            <span>
              <IconButton 
                size="small" 
                onClick={onCut}
                disabled={!hasSelection}
              >
                <CutIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Copy (Ctrl+C)">
            <span>
              <IconButton 
                size="small" 
                onClick={onCopy}
                disabled={!hasSelection}
              >
                <CopyIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Paste (Ctrl+V)">
            <span>
              <IconButton 
                size="small" 
                onClick={onPaste}
                disabled={!canPaste}
              >
                <PasteIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete (Del)">
            <span>
              <IconButton 
                size="small" 
                onClick={onDelete}
                disabled={!hasSelection}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </span>
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
            <span>
              <Button
                variant="outlined"
                onClick={onRun}
                startIcon={<RunIcon />}
                disabled
              >
                Run
              </Button>
            </span>
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