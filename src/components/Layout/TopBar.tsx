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

  const handleLogoClick = () => {
    navigate('/dashboard');
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
      <Toolbar sx={{ justifyContent: 'space-between', px: 3 }}>
        {/* Left Section: Logo and Agentix */}
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
            src="/agentix_logo.png" 
            alt="Agentix Logo" 
            style={{ height: 32, width: 32 }}
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
            Agentix
          </Typography>
        </Box>
        
        {/* Right Section: Tenant Dropdown + Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          {/* Tenant Selector */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value="workspace1"
              displayEmpty
              sx={{
                color: 'white',
                '.MuiOutlinedInput-notchedOutline': { border: 'none' },
                '.MuiSelect-icon': { color: 'white' },
                fontSize: '0.875rem',
                fontWeight: 600,
              }}
              IconComponent={ExpandMoreIcon}
            >
              <MenuItem value="workspace1">Workspace 1</MenuItem>
              <MenuItem value="workspace2">Workspace 2</MenuItem>
              <MenuItem value="workspace3">Workspace 3</MenuItem>
            </Select>
          </FormControl>

          {/* User Avatar and Name */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ textAlign: 'right' }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: (theme) => theme.palette.topbar?.text || '#ffffff',
                  fontWeight: 500,
                  lineHeight: 1.2,
                }}
              >
                John Doe
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '0.75rem',
                }}
              >
                Administrator
              </Typography>
            </Box>
            <Avatar 
              sx={{ 
                width: 36, 
                height: 36,
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