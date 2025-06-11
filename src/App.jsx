import { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from './theme/theme';
import MainLayout from './components/Layout/MainLayout';
import FlowsPage from './pages/Flows/FlowsPage';
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
              <Route path="/" element={<Navigate to="/flows" replace />} />
              <Route path="/flows" element={<FlowsPage />} />
              {/* Future routes */}
              <Route path="/agents" element={<div>Agents page (coming soon)</div>} />
              <Route path="/squads" element={<div>Squads page (coming soon)</div>} />
              <Route path="/groups" element={<div>Groups page (coming soon)</div>} />
              <Route path="/transformers" element={<div>Transformers page (coming soon)</div>} />
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/flows" replace />} />
            </Routes>
          </MainLayout>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;