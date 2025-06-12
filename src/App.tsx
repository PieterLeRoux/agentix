import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme/theme';
import MainLayout from './components/Layout/MainLayout';
import DashboardPage from './pages/Dashboard/DashboardPage';
import FlowsPage from './pages/Flows/FlowsPage';
import SettingsPage from './pages/Settings/SettingsPage';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Router>
          <MainLayout isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/flows" element={<FlowsPage />} />
              <Route path="/settings" element={<SettingsPage isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} />} />
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </MainLayout>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;