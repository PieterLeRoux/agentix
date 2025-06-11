import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  AccountTree as FlowsIcon,
  SmartToy as AgentsIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';

const DashboardPage = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome to Agentix. Monitor your multi-agent orchestration workflows and system performance.
        </Typography>
      </Box>

      {/* Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    12
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Active Flows
                  </Typography>
                </Box>
                <FlowsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    48
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Agents
                  </Typography>
                </Box>
                <AgentsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    89%
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Success Rate
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                    2.4s
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Avg Response
                  </Typography>
                </Box>
                <SpeedIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Content Grid */}
      <Grid container spacing={3}>
        {/* Recent Flows */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Recent Flow Activity
              </Typography>
              
              {[
                { name: 'Customer Service Bot Flow', status: 'active', progress: 85, type: 'success' },
                { name: 'Data Analysis Pipeline', status: 'completed', progress: 100, type: 'success' },
                { name: 'Content Generation Workflow', status: 'running', progress: 62, type: 'primary' },
                { name: 'Quality Assurance Flow', status: 'error', progress: 45, type: 'error' },
                { name: 'Research & Summarization', status: 'queued', progress: 0, type: 'secondary' },
              ].map((flow, index) => (
                <Box key={index} sx={{ mb: 3, last: { mb: 0 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {flow.name}
                    </Typography>
                    <Chip 
                      label={flow.status}
                      size="small"
                      color={flow.type}
                      variant="outlined"
                    />
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={flow.progress} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      backgroundColor: 'grey.200',
                    }}
                  />
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {flow.progress}% complete
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* System Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                System Status
              </Typography>

              {[
                { service: 'Agent Orchestrator', status: 'operational', icon: CheckCircleIcon },
                { service: 'Flow Engine', status: 'operational', icon: CheckCircleIcon },
                { service: 'Data Pipeline', status: 'operational', icon: CheckCircleIcon },
                { service: 'Analytics API', status: 'degraded', icon: ErrorIcon },
                { service: 'Notification Service', status: 'operational', icon: CheckCircleIcon },
              ].map((item, index) => (
                <Box 
                  key={index} 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    py: 1.5,
                    borderBottom: index < 4 ? '1px solid' : 'none',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {item.service}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <item.icon 
                      sx={{ 
                        fontSize: 18,
                        color: item.status === 'operational' ? 'success.main' : 'error.main'
                      }} 
                    />
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: item.status === 'operational' ? 'success.main' : 'error.main',
                        fontWeight: 500,
                      }}
                    >
                      {item.status}
                    </Typography>
                  </Box>
                </Box>
              ))}

              <Box sx={{ mt: 3, p: 2, backgroundColor: 'primary.light', borderRadius: 2 }}>
                <Typography variant="body2" sx={{ color: 'primary.contrastText', textAlign: 'center' }}>
                  <strong>99.9%</strong> uptime this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;