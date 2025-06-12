import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import FlowEditor from '../../components/flows/FlowEditor';

const FlowsPage = () => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 1, pb: 0.5 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, mb: 0.5 }}>
          Workflow Designer
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create and manage multi-agent orchestration flows
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          mx: 1.5,
          mb: 1.5,
          backgroundColor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          minHeight: 0, // Allow flex item to shrink
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <FlowEditor />
      </Box>
    </Box>
  );
};

export default FlowsPage;