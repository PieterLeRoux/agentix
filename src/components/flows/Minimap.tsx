import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import { 
  Visibility as ShowIcon,
  VisibilityOff as HideIcon,
  Fullscreen as FullscreenIcon 
} from '@mui/icons-material';

// Type definitions
interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface NodeView {
  position: Position;
}

interface Transform {
  x?: number;
  y?: number;
  k?: number;
}

interface AreaTransform {
  x: number;
  y: number;
  zoom: number;
}

interface AreaObject {
  transform: Transform;
  setTransform?: (x: number, y: number, zoom: number) => void;
  fit?: () => void;
}

interface EditorNode {
  id: string;
  label?: string;
  nodeType?: string;
}

interface EditorConnection {
  id: string;
  source: string;
  target: string;
}

interface NodeWithPosition {
  id: string;
  label: string;
  nodeType: string;
  position: Position;
  size: Size;
}

interface Editor {
  getNodes: () => EditorNode[];
  getConnections: () => EditorConnection[];
}

interface Area {
  nodeViews: Map<string, NodeView>;
  area?: AreaObject;
}

interface MinimapProps {
  editor?: Editor;
  area?: Area;
  visible?: boolean;
  onVisibilityChange?: (visible: boolean) => void;
  onNodeClick?: (nodeId: string) => void;
}

type NodeType = 'agent' | 'squad' | 'goal' | 'group' | 'transformer' | 'flow' | 'delay' | 'loop' | 'variable' | 'note';

export const Minimap: React.FC<MinimapProps> = ({ 
  editor, 
  area, 
  visible = true, 
  onVisibilityChange,
  onNodeClick 
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [nodes, setNodes] = useState<NodeWithPosition[]>([]);
  const [connections, setConnections] = useState<EditorConnection[]>([]);
  const [viewport, setViewport] = useState<AreaTransform>({ x: 0, y: 0, zoom: 1 });
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const MINIMAP_WIDTH = 200;
  const MINIMAP_HEIGHT = 150;
  const SCALE_FACTOR = 0.1;

  useEffect(() => {
    if (!editor || !area) return;

    const updateMinimap = (): void => {
      const editorNodes: EditorNode[] = editor.getNodes();
      const editorConnections: EditorConnection[] = editor.getConnections();
      
      // Get node positions from area
      const nodesWithPositions: NodeWithPosition[] = editorNodes.map((node: EditorNode) => {
        const view: NodeView | undefined = area.nodeViews.get(node.id);
        return {
          id: node.id,
          label: node.label || 'Unnamed Node',
          nodeType: node.nodeType || 'unknown',
          position: view?.position || { x: 0, y: 0 },
          size: { width: 180, height: 80 } // Approximate node size
        };
      });

      setNodes(nodesWithPositions);
      setConnections(editorConnections);
      
      // Update viewport info
      if (area.area) {
        const transform: Transform = area.area.transform;
        setViewport({
          x: transform.x || 0,
          y: transform.y || 0,
          zoom: transform.k || 1
        });
      }
    };

    updateMinimap();
    
    // Listen for changes
    const interval = setInterval(updateMinimap, 1000);
    
    return () => clearInterval(interval);
  }, [editor, area]);

  const handleToggleVisibility = (): void => {
    const newVisibility: boolean = !isVisible;
    setIsVisible(newVisibility);
    onVisibilityChange?.(newVisibility);
  };

  const handleMinimapClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!area || !canvasRef.current) return;
    
    const rect: DOMRect = canvasRef.current.getBoundingClientRect();
    const x: number = (e.clientX - rect.left) / SCALE_FACTOR;
    const y: number = (e.clientY - rect.top) / SCALE_FACTOR;
    
    // Pan to clicked position
    area.area?.setTransform?.(x, y, viewport.zoom);
  };

  const getNodeColor = (nodeType?: string): string => {
    const colors: Record<NodeType, string> = {
      agent: '#2196F3',
      squad: '#00BCD4',
      goal: '#FF9800',
      group: '#9C27B0',
      transformer: '#795548',
      flow: '#607D8B',
      delay: '#FF5722',
      loop: '#E91E63',
      variable: '#4CAF50',
      note: '#FFEB3B',
    };
    return nodeType && nodeType in colors ? colors[nodeType as NodeType] : '#2196F3';
  };

  if (!isVisible) {
    return (
      <Paper
        elevation={3}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          p: 1,
          zIndex: 1000,
        }}
      >
        <Tooltip title="Show Minimap">
          <IconButton size="small" onClick={handleToggleVisibility}>
            <ShowIcon />
          </IconButton>
        </Tooltip>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: MINIMAP_WIDTH + 40,
        height: MINIMAP_HEIGHT + 60,
        zIndex: 1000,
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 1,
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'grey.50'
      }}>
        <Box sx={{ fontSize: '0.75rem', fontWeight: 600 }}>
          Overview
        </Box>
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Fit to View">
            <IconButton size="small" onClick={() => area?.area?.fit?.()}>
              <FullscreenIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Hide Minimap">
            <IconButton size="small" onClick={handleToggleVisibility}>
              <HideIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Minimap Canvas */}
      <Box
        ref={canvasRef}
        onClick={handleMinimapClick}
        sx={{
          position: 'relative',
          width: MINIMAP_WIDTH,
          height: MINIMAP_HEIGHT,
          m: 2,
          bgcolor: 'grey.100',
          border: 1,
          borderColor: 'divider',
          cursor: 'pointer',
          overflow: 'hidden',
        }}
      >
        {/* Render nodes */}
        {nodes.map((node: NodeWithPosition) => (
          <Box
            key={node.id}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
              onNodeClick?.(node.id);
            }}
            sx={{
              position: 'absolute',
              left: node.position.x * SCALE_FACTOR,
              top: node.position.y * SCALE_FACTOR,
              width: node.size.width * SCALE_FACTOR,
              height: node.size.height * SCALE_FACTOR,
              bgcolor: getNodeColor(node.nodeType),
              border: 1,
              borderColor: 'white',
              borderRadius: 1,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.6rem',
              color: 'white',
              fontWeight: 600,
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              '&:hover': {
                opacity: 0.8,
                transform: 'scale(1.1)',
              },
              transition: 'all 0.2s ease',
            }}
          >
            {node.label?.slice(0, 3) || node.nodeType?.slice(0, 3)}
          </Box>
        ))}

        {/* Render connections */}
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          {connections.map((conn: EditorConnection) => {
            const sourceNode: NodeWithPosition | undefined = nodes.find((n: NodeWithPosition) => n.id === conn.source);
            const targetNode: NodeWithPosition | undefined = nodes.find((n: NodeWithPosition) => n.id === conn.target);
            
            if (!sourceNode || !targetNode) return null;
            
            const x1: number = (sourceNode.position.x + sourceNode.size.width/2) * SCALE_FACTOR;
            const y1: number = (sourceNode.position.y + sourceNode.size.height/2) * SCALE_FACTOR;
            const x2: number = (targetNode.position.x + targetNode.size.width/2) * SCALE_FACTOR;
            const y2: number = (targetNode.position.y + targetNode.size.height/2) * SCALE_FACTOR;
            
            return (
              <line
                key={conn.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#666"
                strokeWidth="1"
                opacity="0.6"
              />
            );
          })}
        </svg>

        {/* Viewport indicator */}
        <Box
          sx={{
            position: 'absolute',
            left: (-viewport.x * SCALE_FACTOR) || 0,
            top: (-viewport.y * SCALE_FACTOR) || 0,
            width: (MINIMAP_WIDTH / viewport.zoom) || MINIMAP_WIDTH,
            height: (MINIMAP_HEIGHT / viewport.zoom) || MINIMAP_HEIGHT,
            border: 2,
            borderColor: 'primary.main',
            backgroundColor: 'primary.light',
            opacity: 0.2,
            pointerEvents: 'none',
          }}
        />
      </Box>

      {/* Stats */}
      <Box sx={{ 
        p: 1, 
        borderTop: 1, 
        borderColor: 'divider',
        bgcolor: 'grey.50',
        fontSize: '0.7rem',
        color: 'text.secondary'
      }}>
        {nodes.length} nodes • {connections.length} connections
      </Box>
    </Paper>
  );
};