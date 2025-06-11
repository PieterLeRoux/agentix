import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders Agentix title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Agentix/i);
    expect(titleElement).toBeInTheDocument();
  });

  it('renders Flow Designer heading', () => {
    render(<App />);
    const headingElement = screen.getByText(/Flow Designer/i);
    expect(headingElement).toBeInTheDocument();
  });

  it('renders navigation menu', () => {
    render(<App />);
    const flowsNavItem = screen.getByText('Flows');
    expect(flowsNavItem).toBeInTheDocument();
  });
});