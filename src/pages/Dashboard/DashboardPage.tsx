import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Stack,
} from '@mui/material';
import {
  AccountTree as FlowsIcon,
  SmartToy as AgentsIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Schedule as ScheduleIcon,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const DashboardPage = () => {
  // Sample data for charts
  const performanceData = [
    { name: 'Mon', flows: 24, agents: 32, success: 95 },
    { name: 'Tue', flows: 35, agents: 45, success: 92 },
    { name: 'Wed', flows: 28, agents: 38, success: 98 },
    { name: 'Thu', flows: 42, agents: 52, success: 89 },
    { name: 'Fri', flows: 38, agents: 48, success: 96 },
    { name: 'Sat', flows: 22, agents: 28, success: 94 },
    { name: 'Sun', flows: 18, agents: 25, success: 97 },
  ];

  const agentDistribution = [
    { name: 'Active', value: 48, color: '#4CAF50' },
    { name: 'Idle', value: 12, color: '#FF9800' },
    { name: 'Maintenance', value: 3, color: '#F44336' },
    { name: 'Training', value: 8, color: '#2196F3' },
  ];

  const taskCompletionData = [
    { name: 'Mon', completed: 245, failed: 12, pending: 8 },
    { name: 'Tue', completed: 312, failed: 18, pending: 15 },
    { name: 'Wed', completed: 298, failed: 9, pending: 6 },
    { name: 'Thu', completed: 387, failed: 22, pending: 11 },
    { name: 'Fri', completed: 356, failed: 14, pending: 9 },
    { name: 'Sat', completed: 203, failed: 8, pending: 4 },
    { name: 'Sun', completed: 178, failed: 5, pending: 3 },
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'Flow Completed',
      name: 'Customer Service Bot Flow',
      user: 'Sarah Chen',
      time: '2 min ago',
      status: 'success',
      duration: '1.2s',
    },
    {
      id: 2,
      type: 'Agent Deployed',
      name: 'Data Analysis Agent v2.1',
      user: 'Mike Johnson',
      time: '5 min ago',
      status: 'success',
      duration: '0.8s',
    },
    {
      id: 3,
      type: 'Flow Error',
      name: 'Content Generation Pipeline',
      user: 'Alex Rivera',
      time: '12 min ago',
      status: 'error',
      duration: '3.4s',
    },
    {
      id: 4,
      type: 'Squad Created',
      name: 'Marketing Automation Squad',
      user: 'Emma Davis',
      time: '18 min ago',
      status: 'success',
      duration: '0.6s',
    },
    {
      id: 5,
      type: 'Agent Updated',
      name: 'Research Assistant Pro',
      user: 'David Kim',
      time: '25 min ago',
      status: 'success',
      duration: '1.1s',
    },
  ];

  const getStatusColor = (status: string): 'success' | 'error' | 'warning' | 'default' => {
    switch (status) {
      case 'success': return 'success';
      case 'error': return 'error';
      case 'warning': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'success': return <CheckCircleIcon sx={{ fontSize: 16 }} />;
      case 'error': return <ErrorIcon sx={{ fontSize: 16 }} />;
      default: return <ScheduleIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your multi-agent orchestration platform performance and insights.
        </Typography>
      </Box>

      {/* Enhanced Metrics Grid - Responsive Grid Layout */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(6, 1fr)'
        },
        gap: 1.5,
        mb: 3
      }}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white', 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  48
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Active Flows
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  +12% from yesterday
                </Typography>
              </Box>
              <FlowsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          color: 'white', 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  71
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Total Agents
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  +5 new this week
                </Typography>
              </Box>
              <AgentsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
          color: 'white', 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  94.2%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Success Rate
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'flex', alignItems: 'center', mt: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  +2.1% improvement
                </Typography>
              </Box>
              <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
          color: 'white', 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  1.8s
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Avg Response
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, display: 'flex', alignItems: 'center', mt: 1 }}>
                  <SpeedIcon sx={{ fontSize: 14, mr: 0.5 }} />
                  -0.4s faster
                </Typography>
              </Box>
              <SpeedIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #a8e6cf 0%, #88d8a3 100%)', 
          color: 'white', 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  156K
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Tasks Processed
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Today
                </Typography>
              </Box>
              <TimelineIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
          </CardContent>
        </Card>

        <Card sx={{ 
          background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', 
          color: 'white', 
          position: 'relative', 
          overflow: 'hidden' 
        }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                  99.9%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  Uptime
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  This month
                </Typography>
              </Box>
              <CheckCircleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
            <Box sx={{ position: 'absolute', top: -10, right: -10, width: 80, height: 80, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)' }} />
          </CardContent>
        </Card>
      </Box>

      {/* Charts Section - CSS Grid Layout */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 2, 
        mb: 3 
      }}>
        {/* Performance Trends */}
        <Card sx={{ height: 400 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
              Performance Trends
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorFlows" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorAgents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f093fb" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f093fb" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="flows" 
                  stroke="#667eea" 
                  fillOpacity={1} 
                  fill="url(#colorFlows)" 
                  name="Flows"
                />
                <Area 
                  type="monotone" 
                  dataKey="agents" 
                  stroke="#f093fb" 
                  fillOpacity={1} 
                  fill="url(#colorAgents)" 
                  name="Agents"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Task Completion Trends */}
        <Card sx={{ height: 400 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
              Task Completion Trends
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={taskCompletionData} barCategoryGap="20%">
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Legend />
                <Bar 
                  dataKey="completed" 
                  stackId="a" 
                  fill="#4CAF50" 
                  name="Completed"
                  radius={[0, 0, 4, 4]}
                />
                <Bar 
                  dataKey="pending" 
                  stackId="a" 
                  fill="#FF9800" 
                  name="Pending"
                  radius={[0, 0, 0, 0]}
                />
                <Bar 
                  dataKey="failed" 
                  stackId="a" 
                  fill="#F44336" 
                  name="Failed"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent Distribution */}
        <Card sx={{ height: 400 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
              Agent Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={agentDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {agentDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value, entry) => (
                    <span style={{ color: entry.color, fontWeight: 500 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Metrics */}
        <Card sx={{ height: 400 }}>
          <CardContent sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
              Response Time Metrics
            </Typography>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={performanceData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="success" 
                  stroke="#4CAF50" 
                  strokeWidth={3}
                  dot={{ fill: '#4CAF50', strokeWidth: 2, r: 6 }}
                  name="Success Rate (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      {/* Activity Table and System Status */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        gap: 3,
        alignItems: 'start'
      }}>
        {/* Enhanced Activity Table */}
        <Card sx={{ height: 'fit-content' }}>
          <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
                Recent Activity
              </Typography>
              <TableContainer sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: { xs: 500, sm: 650 } }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Activity</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Time</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Duration</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentActivity.map((activity) => (
                      <TableRow key={activity.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                        <TableCell>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {activity.type}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {activity.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>
                              {activity.user.split(' ').map(n => n[0]).join('')}
                            </Avatar>
                            <Typography variant="body2">{activity.user}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {activity.duration}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={getStatusIcon(activity.status)}
                            label={activity.status}
                            color={getStatusColor(activity.status)}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

        {/* Enhanced System Status */}
        <Card sx={{ height: 'fit-content' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 1.5 }}>
                System Health
              </Typography>

              <Stack spacing={3}>
                {[
                  { service: 'Agent Orchestrator', status: 'operational', uptime: '99.9%', responseTime: '120ms' },
                  { service: 'Flow Engine', status: 'operational', uptime: '99.8%', responseTime: '95ms' },
                  { service: 'Data Pipeline', status: 'operational', uptime: '100%', responseTime: '200ms' },
                  { service: 'Analytics API', status: 'degraded', uptime: '97.2%', responseTime: '450ms' },
                  { service: 'Notification Service', status: 'operational', uptime: '99.5%', responseTime: '80ms' },
                ].map((item, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 2,
                      backgroundColor: item.status === 'operational' ? 'success.light' : 'warning.light',
                      color: item.status === 'operational' ? 'success.dark' : 'warning.dark',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {item.service}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {item.status === 'operational' ? (
                          <CheckCircleIcon sx={{ fontSize: 16 }} />
                        ) : (
                          <ErrorIcon sx={{ fontSize: 16 }} />
                        )}
                        <Typography variant="caption" sx={{ fontWeight: 500, textTransform: 'capitalize' }}>
                          {item.status}
                        </Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="caption">
                        Uptime: {item.uptime}
                      </Typography>
                      <Typography variant="caption">
                        {item.responseTime}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>

              <Box sx={{ mt: 3, p: 2, backgroundColor: 'primary.light', borderRadius: 2, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ color: 'primary.contrastText', fontWeight: 700 }}>
                  99.9%
                </Typography>
                <Typography variant="body2" sx={{ color: 'primary.contrastText', opacity: 0.9 }}>
                  Overall System Uptime
                </Typography>
              </Box>
            </CardContent>
          </Card>
      </Box>
    </Box>
  );
};

export default DashboardPage;