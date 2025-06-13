import React, { useRef, useEffect } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  ContentCut as CutIcon,
  ContentCopy as CopyIcon,
  ContentPaste as PasteIcon,
  Delete as DeleteIcon,
  Groups as TeamsIcon,
  CallSplit as DelegatesIcon,
  AccountTree as SubFlowsIcon,
} from '@mui/icons-material';

// Types and interfaces
type NodeType = 'teams' | 'delegates' | 'subflows';

interface ContextMenuPosition {
  x: number;
  y: number;
  type: 'canvas' | 'node';
}

interface ContextMenuProps {
  contextMenu: ContextMenuPosition | null;
  onClose: () => void;
  onCut: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onCreateNode: (nodeType: NodeType, position: ContextMenuPosition) => void;
  hasSelection: boolean;
  canPaste: boolean;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ 
  contextMenu, 
  onClose, 
  onCut, 
  onCopy, 
  onPaste, 
  onDelete, 
  onCreateNode,
  hasSelection: _hasSelection, 
  canPaste 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
    
    return () => {}; // Return empty cleanup function when contextMenu is null
  }, [contextMenu, onClose]);

  if (!contextMenu) return null;

  const handleMenuItemClick = (action: () => void): void => {
    action();
    onClose();
  };

  return (
    <Menu
      ref={menuRef}
      open={Boolean(contextMenu)}
      onClose={onClose}
      anchorReference="anchorPosition"
      anchorPosition={{
        top: contextMenu.y,
        left: contextMenu.x,
      }}
      slotProps={{
        paper: {
          sx: {
            minWidth: 200,
            boxShadow: 3,
          }
        }
      }}
    >
      {/* Node creation options when clicking on empty canvas */}
      {contextMenu.type === 'canvas' && (
        <>
          <MenuItem onClick={() => handleMenuItemClick(() => onCreateNode('teams', contextMenu))}>
            <ListItemIcon><TeamsIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Add Teams Node</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick(() => onCreateNode('delegates', contextMenu))}>
            <ListItemIcon><DelegatesIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Add Delegates Node</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick(() => onCreateNode('subflows', contextMenu))}>
            <ListItemIcon><SubFlowsIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Add Sub Flows Node</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={() => handleMenuItemClick(onPaste)} 
            disabled={!canPaste}
          >
            <ListItemIcon><PasteIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Paste</ListItemText>
          </MenuItem>
        </>
      )}

      {/* Node-specific options when right-clicking on a node */}
      {contextMenu.type === 'node' && (
        <>
          <MenuItem onClick={() => handleMenuItemClick(onCut)}>
            <ListItemIcon><CutIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Cut</ListItemText>
          </MenuItem>
          <MenuItem onClick={() => handleMenuItemClick(onCopy)}>
            <ListItemIcon><CopyIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Copy</ListItemText>
          </MenuItem>
          <MenuItem 
            onClick={() => handleMenuItemClick(onPaste)} 
            disabled={!canPaste}
          >
            <ListItemIcon><PasteIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Paste</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => handleMenuItemClick(onDelete)}>
            <ListItemIcon><DeleteIcon fontSize="small" /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </>
      )}
    </Menu>
  );
};