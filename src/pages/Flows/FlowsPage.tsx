import {
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
} from '@mui/icons-material';
import FlowEditor from '../../components/FlowEditor/FlowEditor';

const FlowsPage = () => {
  return (
    <Box>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Flow Designer
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Create and manage multi-agent orchestration flows
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
        >
          Create New Flow
        </Button>
      </Box>

      <Paper
        elevation={2}
        sx={{
          height: 'calc(100vh - 200px)',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <FlowEditor />
      </Paper>
    </Box>
  );
};

export default FlowsPage;