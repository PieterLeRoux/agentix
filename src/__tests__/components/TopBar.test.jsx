import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from '../../theme/theme';
import TopBar from '../../components/Layout/TopBar';

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={lightTheme}>
      {component}
    </ThemeProvider>
  );
};

describe('TopBar', () => {
  const mockProps = {
    onMenuToggle: vi.fn(),
    isDarkMode: false,
    onThemeToggle: vi.fn(),
  };

  it('renders Agentix title', () => {
    renderWithTheme(<TopBar {...mockProps} />);
    const titleElement = screen.getByText('Agentix');
    expect(titleElement).toBeInTheDocument();
  });

  it('calls onMenuToggle when menu button is clicked', () => {
    renderWithTheme(<TopBar {...mockProps} />);
    const menuButton = screen.getByLabelText('toggle navigation');
    fireEvent.click(menuButton);
    expect(mockProps.onMenuToggle).toHaveBeenCalledTimes(1);
  });

  it('calls onThemeToggle when theme button is clicked', () => {
    renderWithTheme(<TopBar {...mockProps} />);
    const themeButton = screen.getByLabelText('toggle theme');
    fireEvent.click(themeButton);
    expect(mockProps.onThemeToggle).toHaveBeenCalledTimes(1);
  });

  it('shows correct theme icon for light mode', () => {
    renderWithTheme(<TopBar {...mockProps} />);
    const darkModeIcon = screen.getByTestId('Brightness4Icon');
    expect(darkModeIcon).toBeInTheDocument();
  });

  it('shows correct theme icon for dark mode', () => {
    renderWithTheme(<TopBar {...mockProps} isDarkMode={true} />);
    const lightModeIcon = screen.getByTestId('Brightness7Icon');
    expect(lightModeIcon).toBeInTheDocument();
  });
});