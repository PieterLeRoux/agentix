import React, { useState, useRef, useCallback, ReactNode } from 'react';
import { Box, SxProps, Theme } from '@mui/material';

// Types and interfaces
interface SelectionRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SelectionBoxProps {
  onSelectionChange?: (selectedNodeIds: string[]) => void;
  children: ReactNode;
  sx?: SxProps<Theme>;
}

export const SelectionBox: React.FC<SelectionBoxProps> = ({ onSelectionChange, children, sx = {} }) => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionRectangle>({ x: 0, y: 0, width: 0, height: 0 });
  const startPoint = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Only start selection on empty canvas (not on nodes or node elements)
    const target = e.target as HTMLElement;
    const isEmptyCanvas = target.classList.contains('rete-area') || 
                         target.classList.contains('selection-canvas');
    const isNodeElement = target.closest('[data-node-id]') || 
                         target.closest('.rete-node') ||
                         target.closest('.node');
    
    if (isEmptyCanvas && !isNodeElement) {
      e.preventDefault();
      
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      startPoint.current = { x, y };
      setSelectionBox({ x, y, width: 0, height: 0 });
      setIsSelecting(true);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting) return;
    
    e.preventDefault();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const x = Math.min(startPoint.current.x, currentX);
    const y = Math.min(startPoint.current.y, currentY);
    const width = Math.abs(currentX - startPoint.current.x);
    const height = Math.abs(currentY - startPoint.current.y);
    
    setSelectionBox({ x, y, width, height });
  }, [isSelecting]);

  const handleMouseUp = useCallback((_e: React.MouseEvent<HTMLDivElement>) => {
    if (!isSelecting) return;
    
    setIsSelecting(false);
    
    // Find nodes within selection box
    const nodeElements = containerRef.current?.querySelectorAll('[data-node-id]');
    if (!nodeElements) return;
    
    const selectedNodeIds: string[] = [];
    
    nodeElements.forEach((nodeEl) => {
      const nodeRect = nodeEl.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;
      
      const nodeX = nodeRect.left - containerRect.left;
      const nodeY = nodeRect.top - containerRect.top;
      const nodeWidth = nodeRect.width;
      const nodeHeight = nodeRect.height;
      
      // Check if node intersects with selection box
      const intersects = !(
        nodeX > selectionBox.x + selectionBox.width ||
        nodeX + nodeWidth < selectionBox.x ||
        nodeY > selectionBox.y + selectionBox.height ||
        nodeY + nodeHeight < selectionBox.y
      );
      
      if (intersects && selectionBox.width > 10 && selectionBox.height > 10) {
        // Extract node ID from the element
        const nodeId = nodeEl.getAttribute('data-node-id');
        if (nodeId) {
          selectedNodeIds.push(nodeId);
        }
      }
    });
    
    // Reset selection box
    setSelectionBox({ x: 0, y: 0, width: 0, height: 0 });
    
    // Notify parent of selection
    onSelectionChange?.(selectedNodeIds);
  }, [isSelecting, selectionBox, onSelectionChange]);

  return (
    <Box
      ref={containerRef}
      className="selection-canvas"
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: isSelecting ? 'crosshair' : 'default',
        ...sx,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // End selection if mouse leaves container
    >
      {children}
      
      {/* Selection Box Overlay */}
      {isSelecting && selectionBox.width > 0 && selectionBox.height > 0 && (
        <Box
          sx={{
            position: 'absolute',
            left: selectionBox.x,
            top: selectionBox.y,
            width: selectionBox.width,
            height: selectionBox.height,
            border: '2px dashed',
            borderColor: 'primary.main',
            backgroundColor: 'primary.light',
            opacity: 0.2,
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        />
      )}
    </Box>
  );
};