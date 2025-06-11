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
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { SettingsProps } from '../../types';
import {
  Notifications as NotificationsIcon,
  DarkMode as DarkModeIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';

const SettingsPage = ({ isDarkMode, onThemeToggle }: SettingsProps): JSX.Element => {
  const handleThemeChange = (event: SelectChangeEvent<string>): void => {
    const value = event.target.value;
    if (value === 'light' && isDarkMode) {
      onThemeToggle();
    } else if (value === 'dark' && !isDarkMode) {
      onThemeToggle();
    }
    // Note: 'auto' would require system preference detection
  };
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Configure your workspace preferences
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, mb: 2, fontSize: '1.1rem' }}>
            Preferences
          </Typography>

          <List dense>
            <ListItem sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <DarkModeIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Theme</Typography>}
                secondary={<Typography variant="caption">Choose your preferred theme</Typography>}
                sx={{ mr: 2 }}
              />
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select 
                  value={isDarkMode ? 'dark' : 'light'} 
                  onChange={handleThemeChange}
                  sx={{ fontSize: '0.875rem' }}
                >
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <NotificationsIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Notifications</Typography>}
                secondary={<Typography variant="caption">Email updates for flow completions</Typography>}
              />
              <Switch defaultChecked size="small" />
            </ListItem>

            <Divider variant="inset" component="li" />

            <ListItem sx={{ py: 1 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <StorageIcon color="primary" fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={<Typography variant="body2" sx={{ fontWeight: 500 }}>Auto-Save</Typography>}
                secondary={<Typography variant="caption">Save workflows automatically</Typography>}
              />
              <Switch defaultChecked size="small" />
            </ListItem>
          </List>

          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Agentix v2.1.0 • Last updated Dec 11, 2024
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsPage;