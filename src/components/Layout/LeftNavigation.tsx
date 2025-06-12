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
  Tooltip,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  AccountTree as FlowsIcon,
  Settings as SettingsIcon,
  ChevronLeft as CollapseIcon,
  ChevronRight as ExpandIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { NavigationProps } from '../../types';

interface NavigationItem {
  text: string;
  icon: JSX.Element;
  path: string;
  active: boolean;
}

const drawerWidth = 240;
const collapsedDrawerWidth = 64;

const navigationItems: NavigationItem[] = [
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
    text: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
    active: true,
  },
];

const LeftNavigation = ({ open, onClose, variant = 'permanent', collapsed = false, onToggleCollapse }: NavigationProps): JSX.Element => {
  // console.log('LeftNavigation render - props:', { open, variant, collapsed, onToggleCollapse: !!onToggleCollapse });
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path: string, active: boolean): void => {
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
        <List sx={{ pt: 1, px: collapsed ? 1 : 2 }}>
          {navigationItems.map((item) => (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              {collapsed ? (
                <Tooltip title={item.text} placement="right">
                  <span>
                    <ListItemButton
                      onClick={() => handleNavigate(item.path, item.active)}
                      selected={location.pathname === item.path}
                      disabled={!item.active}
                      sx={{
                        borderRadius: 1.5,
                        py: 1.5,
                        px: 1,
                        justifyContent: 'center',
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
                            : 'rgba(255, 255, 255, 0.8)',
                          minWidth: 'auto',
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                    </ListItemButton>
                  </span>
                </Tooltip>
              ) : (
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
                        : 'rgba(255, 255, 255, 0.8)',
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
                        : 'rgba(255, 255, 255, 0.8)',
                    }}
                  />
                </ListItemButton>
              )}
            </ListItem>
          ))}
        </List>
      </Box>

      {/* COLLAPSE BUTTON - At the bottom */}
      <Box sx={{ p: collapsed ? 1 : 2, mt: 'auto' }}>
        {collapsed ? (
          <Tooltip title="Expand Sidebar" placement="right">
            <span>
              <ListItemButton
                onClick={onToggleCollapse}
                sx={{
                  borderRadius: 1.5,
                  py: 1.5,
                  px: 1,
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#ffffff', minWidth: 'auto' }}>
                  <ExpandIcon />
                </ListItemIcon>
              </ListItemButton>
            </span>
          </Tooltip>
        ) : (
          <ListItemButton
            onClick={onToggleCollapse}
            sx={{
              borderRadius: 1.5,
              py: 1.5,
              px: 2,
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              },
            }}
          >
            <ListItemIcon sx={{ color: '#ffffff', minWidth: 'auto' }}>
              <CollapseIcon />
            </ListItemIcon>
          </ListItemButton>
        )}
      </Box>

    </Box>
  );

  const currentWidth = collapsed ? collapsedDrawerWidth : drawerWidth;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: currentWidth }, flexShrink: { sm: 0 } }}
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
            width: currentWidth,
            backgroundColor: (theme) => theme.palette.sidebar?.main || theme.palette.primary.main,
            borderRight: 'none',
            boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
            borderRadius: '0 8px 8px 0',
            height: '100vh',
            transition: 'width 0.3s ease-in-out',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default LeftNavigation;