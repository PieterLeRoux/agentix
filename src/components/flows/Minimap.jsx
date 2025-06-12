import { useState, useEffect, useRef } from 'react';
import { Box, Paper, IconButton, Tooltip } from '@mui/material';
import { 
  Visibility as ShowIcon,
  VisibilityOff as HideIcon,
  Fullscreen as FullscreenIcon 
} from '@mui/icons-material';

export const Minimap = ({ 
  editor, 
  area, 
  visible = true, 
  onVisibilityChange,
  onNodeClick 
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 });
  const canvasRef = useRef(null);
  
  const MINIMAP_WIDTH = 200;
  const MINIMAP_HEIGHT = 150;
  const SCALE_FACTOR = 0.1;

  useEffect(() => {
    if (!editor || !area) return;

    const updateMinimap = () => {
      const editorNodes = editor.getNodes();
      const editorConnections = editor.getConnections();
      
      // Get node positions from area
      const nodesWithPositions = editorNodes.map(node => {
        const view = area.nodeViews.get(node.id);
        return {
          id: node.id,
          label: node.label,
          nodeType: node.nodeType,
          position: view?.position || { x: 0, y: 0 },
          size: { width: 180, height: 80 } // Approximate node size
        };
      });

      setNodes(nodesWithPositions);
      setConnections(editorConnections);
      
      // Update viewport info
      if (area.area) {
        const transform = area.area.transform;
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

  const handleToggleVisibility = () => {
    const newVisibility = !isVisible;
    setIsVisible(newVisibility);
    onVisibilityChange?.(newVisibility);
  };

  const handleMinimapClick = (e) => {
    if (!area || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / SCALE_FACTOR;
    const y = (e.clientY - rect.top) / SCALE_FACTOR;
    
    // Pan to clicked position
    area.area?.setTransform(x, y, viewport.zoom);
  };

  const getNodeColor = (nodeType) => {
    const colors = {
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
    return colors[nodeType] || '#2196F3';
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
            <IconButton size="small" onClick={() => area?.area?.fit()}>
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
        {nodes.map(node => (
          <Box
            key={node.id}
            onClick={(e) => {
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
          {connections.map(conn => {
            const sourceNode = nodes.find(n => n.id === conn.source);
            const targetNode = nodes.find(n => n.id === conn.target);
            
            if (!sourceNode || !targetNode) return null;
            
            const x1 = (sourceNode.position.x + sourceNode.size.width/2) * SCALE_FACTOR;
            const y1 = (sourceNode.position.y + sourceNode.size.height/2) * SCALE_FACTOR;
            const x2 = (targetNode.position.x + targetNode.size.width/2) * SCALE_FACTOR;
            const y2 = (targetNode.position.y + targetNode.size.height/2) * SCALE_FACTOR;
            
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