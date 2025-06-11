import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Divider,
} from '@mui/material';
import {
  AccountTree as FlowsIcon,
  SmartToy as AgentsIcon,
  Groups as SquadsIcon,
  Category as GroupsIcon,
  Code as TransformersIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const navigationItems = [
  {
    text: 'Flows',
    icon: <FlowsIcon />,
    path: '/flows',
    active: true, // Currently implemented
  },
  {
    text: 'Agents',
    icon: <AgentsIcon />,
    path: '/agents',
    active: false, // Future implementation
  },
  {
    text: 'Squads',
    icon: <SquadsIcon />,
    path: '/squads',
    active: false, // Future implementation
  },
  {
    text: 'Groups',
    icon: <GroupsIcon />,
    path: '/groups',
    active: false, // Future implementation
  },
  {
    text: 'Transformers',
    icon: <TransformersIcon />,
    path: '/transformers',
    active: false, // Future implementation
  },
];

const LeftNavigation = ({ open, onClose, variant = 'temporary' }) => {
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
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => handleNavigate(item.path, item.active)}
              selected={location.pathname === item.path}
              disabled={!item.active}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
                '&.Mui-disabled': {
                  opacity: 0.5,
                },
                borderRadius: (theme) => theme.spacing(1),
                margin: (theme) => theme.spacing(0.5, 1),
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? 'inherit' : 'text.secondary',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
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
          keepMounted: true, // Better open performance on mobile
        }}
        sx={{
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: 'background.paper',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  );
};

export default LeftNavigation;