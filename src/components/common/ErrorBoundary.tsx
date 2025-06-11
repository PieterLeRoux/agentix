import React, { ReactNode, ErrorInfo } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { ErrorOutline as ErrorIcon, Refresh as RefreshIcon } from '@mui/icons-material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(_error: Error): State {
    return { hasError: true, error: null, errorInfo: null };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
    
    // Log error to console in development
    if (import.meta.env?.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh',
            p: 3,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              p: 4,
              textAlign: 'center',
              maxWidth: 500,
              width: '100%',
            }}
          >
            <ErrorIcon
              color="error"
              sx={{ fontSize: 64, mb: 2 }}
            />
            <Typography variant="h5" gutterBottom color="error">
              Something went wrong
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.
            </Typography>
            
            {import.meta.env?.DEV && this.state.error && (
              <Box sx={{ mt: 2, mb: 2 }}>
                <Typography variant="body2" color="error" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            
            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={this.handleReset}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Paper>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;