import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Add as AddIcon,
  SmartToy as AgentIcon,
} from '@mui/icons-material';

const AgentsPage = () => {
  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Agents
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your AI agents, configure their capabilities, and monitor their performance.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          size="large"
        >
          Create Agent
        </Button>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        {[
          { name: 'Data Analyst', type: 'Analytics', status: 'active', tasks: 23 },
          { name: 'Content Writer', type: 'Content', status: 'active', tasks: 15 },
          { name: 'Code Reviewer', type: 'Development', status: 'idle', tasks: 8 },
          { name: 'Research Assistant', type: 'Research', status: 'active', tasks: 31 },
          { name: 'Quality Controller', type: 'QA', status: 'maintenance', tasks: 0 },
          { name: 'Task Coordinator', type: 'Management', status: 'active', tasks: 12 },
        ].map((agent, index) => (
          <Box key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                    <AgentIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {agent.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {agent.type}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Chip 
                    label={agent.status}
                    size="small"
                    color={agent.status === 'active' ? 'success' : agent.status === 'idle' ? 'default' : 'warning'}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {agent.tasks} tasks
                  </Typography>
                </Box>

                <Typography variant="body2" sx={{ mb: 2 }}>
                  Specialized AI agent for {agent.type.toLowerCase()} tasks with advanced capabilities.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AgentsPage;