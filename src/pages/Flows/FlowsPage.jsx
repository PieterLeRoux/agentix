import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  AccountTree as FlowIcon,
  SmartToy as AgentIcon,
  Groups as SquadIcon,
  Code as TransformerIcon,
} from '@mui/icons-material';

const FlowsPage = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Flow Designer
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Create and manage multi-agent orchestration flows. Build Squads (collections of agents), 
          Groups (collections of squads with goals), Transformers (code snippets), and connect them 
          into complete Flows using our visual graph editor.
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
          sx={{ mb: 3 }}
        >
          Create New Flow
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
          Component Types
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AgentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Agents</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Individual AI agents with specific roles and capabilities
              </Typography>
              <Chip label="Core Component" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SquadIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Squads</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Collections of agents working together on related tasks
              </Typography>
              <Chip label="Group Component" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TransformerIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Transformers</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Code snippets for data transformation and processing
              </Typography>
              <Chip label="Utility Component" size="small" sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
          Visual Graph Editor
        </Typography>
        <Paper
          elevation={2}
          sx={{
            height: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.paper',
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <FlowIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Rete.js Graph Editor Integration
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This area will contain the visual graph editor for building flows.
              Drag and drop components, connect them with lines, and create complex workflows.
            </Typography>
            <Button variant="outlined" startIcon={<AddIcon />}>
              Initialize Graph Editor
            </Button>
          </Box>
        </Paper>
      </Box>

      <Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 500 }}>
          Getting Started
        </Typography>
        <Card>
          <CardContent>
            <Typography variant="body1" paragraph>
              <strong>Step 1:</strong> Create individual agents with specific roles (e.g., Data Analyst, Content Writer, Researcher)
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Step 2:</strong> Group related agents into squads for collaborative tasks
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Step 3:</strong> Add transformers for data processing between components
            </Typography>
            <Typography variant="body1" paragraph>
              <strong>Step 4:</strong> Connect everything in the visual flow designer to create complete workflows
            </Typography>
            <Typography variant="body1">
              <strong>Step 5:</strong> Execute your flows and monitor the multi-agent orchestration in real-time
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default FlowsPage;