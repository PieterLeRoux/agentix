import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  IconButton,
  Typography,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountTree as FlowsIcon,
  SmartToy as AgentsIcon,
  Settings as SettingsIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const navigationItems = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
    active: true,
  },
  {
    text: 'Flows',
    icon: <FlowsIcon />,
    path: '/flows',
    active: true,
  },
  {
    text: 'Agents',
    icon: <AgentsIcon />,
    path: '/agents',
    active: true,
  },
  {
    text: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
    active: true,
  },
];

const LeftNavigation = ({ open, onClose, variant = 'permanent', isDarkMode, onThemeToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path, active) => {
    if (active) {
      navigate(path);
      if (variant === 'temporary') {
        onClose();
      }
    }
  };

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar />
      
      {/* Navigation Items */}
      <Box sx={{ flexGrow: 1 }}>
        <List sx={{ pt: 2, px: 2 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => handleNavigate(item.path, item.active)}
                selected={location.pathname === item.path}
                disabled={!item.active}
                sx={{
                  borderRadius: 1.5,
                  py: 1.5,
                  px: 2,
                  '&.Mui-selected': {
                    backgroundColor: (theme) => theme.palette.sidebar?.selected || theme.palette.primary.main,
                    color: '#ffffff',
                    '&:hover': {
                      backgroundColor: (theme) => theme.palette.sidebar?.selected || theme.palette.primary.main,
                    },
                    '& .MuiListItemIcon-root': {
                      color: '#ffffff',
                    },
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                  '&.Mui-disabled': {
                    opacity: 0.5,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path 
                      ? '#ffffff' 
                      : (theme) => theme.palette.sidebar?.text || '#ffffff',
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    fontSize: '0.9rem',
                    color: location.pathname === item.path 
                      ? '#ffffff' 
                      : (theme) => theme.palette.sidebar?.text || '#ffffff',
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom Section: Theme Toggle */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: (theme) => theme.palette.sidebar?.text || '#ffffff',
              fontSize: '0.85rem',
            }}
          >
            Theme
          </Typography>
          <IconButton
            onClick={onThemeToggle}
            size="small"
            sx={{
              color: (theme) => theme.palette.sidebar?.text || '#ffffff',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            {isDarkMode ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="navigation menu"
    >
      <Drawer
        variant={variant}
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: (theme) => theme.palette.sidebar?.main || theme.palette.primary.main,
            borderRight: 'none',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '0 8px 8px 0',
            height: '100vh',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default LeftNavigation;