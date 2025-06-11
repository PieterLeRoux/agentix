import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Button,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Api as ApiIcon,
  Backup as BackupIcon,
  Update as UpdateIcon,
} from '@mui/icons-material';

const SettingsPage = () => {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Configure your Agentix workspace preferences and system settings.
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
            General Settings
          </Typography>

          <List>
            <ListItem>
              <ListItemIcon>
                <NotificationsIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Email Notifications"
                secondary="Receive email updates for flow completions and system alerts"
              />
              <Switch defaultChecked />
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem>
              <ListItemIcon>
                <SecurityIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Two-Factor Authentication"
                secondary="Add an extra layer of security to your account"
              />
              <Switch />
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem>
              <ListItemIcon>
                <StorageIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Auto-Save Workflows"
                secondary="Automatically save workflow changes every 30 seconds"
              />
              <Switch defaultChecked />
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem>
              <ListItemIcon>
                <ApiIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="API Access"
                secondary="Enable external API access for integrations"
              />
              <Switch defaultChecked />
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem>
              <ListItemIcon>
                <BackupIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Automatic Backups"
                secondary="Daily backups of all workflows and configurations"
              />
              <Switch defaultChecked />
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem>
              <ListItemIcon>
                <UpdateIcon color="primary" />
              </ListItemIcon>
              <ListItemText
                primary="Automatic Updates"
                secondary="Install system updates automatically when available"
              />
              <Switch />
            </ListItem>
          </List>

          <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              System Information
            </Typography>
            
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 2, mb: 3 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Version</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Agentix v2.1.0</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>December 11, 2024</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">License</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Enterprise</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Support</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>Premium</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button variant="outlined">
                Export Settings
              </Button>
              <Button variant="outlined">
                Import Settings
              </Button>
              <Button variant="contained" color="error">
                Reset to Defaults
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsPage;