import { useState } from 'react';
import { Box, Toolbar, useMediaQuery, useTheme, Card } from '@mui/material';
import TopBar from './TopBar';
import LeftNavigation from './LeftNavigation';
import { LayoutProps } from '../../types';


const MainLayout = ({ children, isDarkMode, onThemeToggle }: LayoutProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  const handleToggleCollapse = () => {
    console.log('Toggling sidebar:', !sidebarCollapsed);
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
      <TopBar 
        isDarkMode={isDarkMode}
        onThemeToggle={onThemeToggle}
      />
      
      <LeftNavigation
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerClose}
        variant={isMobile ? 'temporary' : 'permanent'}
        collapsed={!isMobile && sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        <Toolbar />
        <Box sx={{ 
          p: 1, 
          flexGrow: 1,
          overflow: 'auto',
          width: '100%',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}>
          <Card
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderRadius: 2,
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
              backgroundColor: 'background.paper',
              minHeight: 'calc(100vh - 100px)',
              width: '100%',
              maxWidth: '100%',
              overflow: 'hidden',
              boxSizing: 'border-box',
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