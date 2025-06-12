import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import { SettingsProps } from '../../types';
import {
  DarkMode as DarkModeIcon,
} from '@mui/icons-material';

const SettingsPage = ({ isDarkMode, onThemeToggle }: SettingsProps): JSX.Element => {
  const handleThemeChange = (event: SelectChangeEvent<string>): void => {
    const value = event.target.value;
    if (value === 'light' && isDarkMode) {
      onThemeToggle();
    } else if (value === 'dark' && !isDarkMode) {
      onThemeToggle();
    }
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
            Theme Settings
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
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default SettingsPage;