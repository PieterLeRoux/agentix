import { useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme, Card } from '@mui/material';
import TopBar from './TopBar';
import LeftNavigation from './LeftNavigation';

const drawerWidth = 240;

const MainLayout = ({ children, isDarkMode, onThemeToggle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar 
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
      />
      
      <LeftNavigation
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerClose}
        variant={isMobile ? 'temporary' : 'permanent'}
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { 
            sm: `calc(100% - ${isMobile ? 0 : drawerWidth}px)` 
          },
          ml: { 
            sm: isMobile ? 0 : `${drawerWidth}px` 
          },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ p: 3, flexGrow: 1 }}>
          <Card
            sx={{
              p: 4,
              borderRadius: 3,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              backgroundColor: 'background.paper',
              minHeight: 'calc(100vh - 140px)',
              width: '100%',
            }}
          >
            {children}
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;