import { useEffect, useRef, useState } from 'react';
import { NodeEditor, ClassicPreset } from 'rete';
import { AreaPlugin, AreaExtensions } from 'rete-area-plugin';
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin';
import { ReactPlugin, Presets } from 'rete-react-plugin';
import { ContextMenuPlugin, Presets as ContextMenuPresets } from 'rete-context-menu-plugin';
import { createRoot } from 'react-dom/client';
import { Box, Typography, CircularProgress, Button } from '@mui/material';

// Socket definition
const socket = new ClassicPreset.Socket('socket');

// Custom Agent Node class
class AgentNode extends ClassicPreset.Node {
  constructor(name = 'Agent') {
    super(name);
    this.addInput('input', new ClassicPreset.Input(socket, 'Input'));
    this.addOutput('output', new ClassicPreset.Output(socket, 'Output'));
    this.addControl('name', new ClassicPreset.InputControl('text', { initial: name }));
  }
}

const FlowEditor = () => {
  const containerRef = useRef(null);
  const editorRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [initAttempts, setInitAttempts] = useState(0);

  const createEditor = async () => {
    try {
      if (!containerRef.current) {
        console.error('Container ref not available');
        throw new Error('Container not ready');
      }

      console.log('Starting Rete.js initialization...');
      
      // Clear any existing content
      containerRef.current.innerHTML = '';

      // Create editor instance
      const editor = new NodeEditor();
      const area = new AreaPlugin(containerRef.current);
      const connection = new ConnectionPlugin();
      const render = new ReactPlugin({ createRoot });

      console.log('Basic plugins created');

      // Setup render preset first
      render.addPreset(Presets.classic.setup());
      
      // Use plugins in order
      editor.use(area);
      area.use(connection);
      area.use(render);

      // Setup connection preset
      connection.addPreset(ConnectionPresets.classic.setup());

      console.log('Plugins configured');

      // Create a simple node to test
      const node1 = new AgentNode('Agent 1');
      const node2 = new AgentNode('Agent 2');

      await editor.addNode(node1);
      await editor.addNode(node2);

      // Position nodes
      await area.translate(node1.id, { x: 100, y: 100 });
      await area.translate(node2.id, { x: 300, y: 100 });

      // Connect them
      const conn = new ClassicPreset.Connection(node1, 'output', node2, 'input');
      await editor.addConnection(conn);

      console.log('Nodes created and connected');

      // Store editor reference
      editorRef.current = { editor, area };

      // Mark as loaded
      setIsLoading(false);
      setError(null);
      
      console.log('Rete.js editor initialized successfully!');

    } catch (err) {
      console.error('Failed to initialize Rete.js:', err);
      setError(err.message || 'Unknown initialization error');
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    setInitAttempts(prev => prev + 1);
    setTimeout(createEditor, 100);
  };

  useEffect(() => {
    if (containerRef.current) {
      console.log('Container ready, starting initialization...');
      setTimeout(createEditor, 100);
    }

    return () => {
      if (editorRef.current?.editor) {
        try {
          editorRef.current.editor.destroy();
        } catch (e) {
          console.warn('Error destroying editor:', e);
        }
      }
    };
  }, [initAttempts]);

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h6" color="error" gutterBottom>
          Failed to Initialize Flow Editor
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxWidth: 400 }}>
          {error}
        </Typography>
        <Button variant="contained" onClick={handleRetry}>
          Retry Initialization
        </Button>
      </Box>
    );
  }

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100%',
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="body2" color="text.secondary">
          Initializing Flow Editor... (Attempt {initAttempts + 1})
        </Typography>
        <Button variant="outlined" onClick={handleRetry}>
          Force Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%',
        background: '#f8fafc',
        position: 'relative'
      }}
    >
      <div 
        ref={containerRef} 
        style={{ 
          width: '100%', 
          height: '100%',
          background: '#f8fafc'
        }} 
      />
    </Box>
  );
};

export default FlowEditor;