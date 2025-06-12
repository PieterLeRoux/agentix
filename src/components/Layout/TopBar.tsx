import { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Box,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  isDarkMode: boolean;
  onThemeToggle: () => void;
}

const TopBar = ({ isDarkMode: _isDarkMode, onThemeToggle: _onThemeToggle }: TopBarProps): JSX.Element => {
  const navigate = useNavigate();
  const [selectedNamespace, setSelectedNamespace] = useState('nexus-labs');

  const handleLogoClick = () => {
    navigate('/dashboard');
  };

  const handleNamespaceChange = (event: any) => {
    setSelectedNamespace(event.target.value);
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: (theme) => theme.palette.topbar?.main || theme.palette.primary.main,
        boxShadow: 'none',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '0 0 8px 8px',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: 3, minHeight: '48px !important' }}>
        {/* Left Section: Logo and Axis */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 2,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8,
            },
            transition: 'opacity 0.2s ease-in-out',
          }}
          onClick={handleLogoClick}
        >
          <img 
            src="/axis_logo.png" 
            alt="Axis Logo" 
            style={{ height: 28, width: 28 }}
          />
          <Typography
            variant="h4"
            component="div"
            sx={{
              fontWeight: 800,
              letterSpacing: '0.5px',
              color: (theme) => theme.palette.topbar?.text || '#ffffff',
              fontSize: '1.75rem',
            }}
          >
            Axis
          </Typography>
        </Box>
        
        {/* Right Section: Tenant Dropdown + Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Tenant Selector */}
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <FormControl size="small" sx={{ minWidth: 140 }}>
              <Select
                value={selectedNamespace}
                onChange={handleNamespaceChange}
                displayEmpty
                sx={{
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                  '.MuiSelect-icon': { color: 'white' },
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  height: '32px',
                }}
                IconComponent={ExpandMoreIcon}
              >
                <MenuItem value="nexus-labs">nexus-labs</MenuItem>
                <MenuItem value="quantum-ai">quantum-ai</MenuItem>
                <MenuItem value="stellar-ops">stellar-ops</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* User Avatar and Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ 
              textAlign: 'right',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 0.25
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: (theme) => theme.palette.topbar?.text || '#ffffff',
                  fontWeight: 500,
                  lineHeight: 1,
                }}
              >
                John Doe
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.65rem',
                  lineHeight: 1,
                }}
              >
                Administrator
              </Typography>
            </Box>
            <Avatar 
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              sx={{ 
                width: 32, 
                height: 32,
                bgcolor: 'rgba(255, 255, 255, 0.2)',
                color: (theme) => theme.palette.topbar?.text || '#ffffff',
                fontWeight: 600,
              }}
            >
              JD
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;