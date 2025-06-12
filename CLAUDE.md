# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Axis is a multi-agent orchestration UI tool built with React and Vite. It provides a visual graph editor for creating and managing AI agent workflows through drag-and-drop interfaces.

## Architecture

### Frontend Stack
- **React 18** with **Vite** for fast development and building
- **Material-UI (MUI)** for UI components with custom blue theme
- **React Router DOM** for client-side routing
- **Rete.js** for visual graph editing capabilities

### Project Structure
```
src/
├── components/
│   ├── Layout/          # Main layout components (TopBar, LeftNavigation, MainLayout)
│   │   ├── TopBar.jsx
│   │   ├── LeftNavigation.jsx
│   │   └── MainLayout.jsx
│   └── common/          # Reusable UI components
├── pages/
│   └── Flows/           # Flow designer page
│       └── FlowsPage.jsx
├── theme/
│   └── theme.js         # MUI theme configuration (blue color scheme)
├── utils/               # Utility functions
└── __tests__/           # Test files
```

### Key Concepts
- **Flows**: Complete workflows connecting agents, squads, and transformers
- **Squads**: Collections of agents working together
- **Groups**: Collections of squads with defined goals
- **Transformers**: Code snippets for data transformation
- **Agents**: Individual AI agents with specific roles

## Development Commands

### Setup and Development
```bash
npm install              # Install dependencies
npm run dev             # Start development server (http://localhost:5173)
npm run build           # Build for production
npm run preview         # Preview production build
```

### Code Quality
```bash
npm run lint            # Run ESLint
npm run format          # Format code with Prettier
npm run test            # Run tests with Vitest
```

### Dependencies
- **Core**: react, react-dom, vite
- **UI**: @mui/material, @mui/icons-material, @emotion/react, @emotion/styled
- **Routing**: react-router-dom
- **Graph Editor**: rete, rete-react-plugin, rete-area-plugin, rete-connection-plugin, rete-render-utils
- **Dev Tools**: eslint, prettier, vitest, @testing-library/react

## Theme Configuration

The app uses a custom MUI theme with:
- **Primary Color**: Blue (#1976d2)
- **Secondary Color**: Complementary blue/teal
- **Dark/Light Mode**: Toggle capability built-in
- **Typography**: Modern, professional styling

## Layout Structure

1. **TopBar**: App branding, theme toggle, user actions
2. **LeftNavigation**: Collapsible sidebar with main navigation (Flows, Agents, Squads, etc.)
3. **MainLayout**: Container that orchestrates TopBar + LeftNav + page content
4. **Responsive Design**: Mobile-first approach with MUI breakpoints

## Testing Strategy

- **Unit Tests**: Component-level testing with React Testing Library
- **Integration Tests**: Page-level functionality testing
- **E2E Tests**: Critical user flows (future consideration)

## Common Patterns

- Use MUI's `sx` prop for styling
- Implement proper prop-types or TypeScript interfaces
- Follow React best practices (hooks, functional components)
- Maintain consistent file naming (PascalCase for components)
- Use absolute imports where beneficial

## Future Expansion Areas

- Agent management interfaces
- Squad configuration tools
- Transformer code editor
- Flow execution engine
- Real-time collaboration features

## Architecture

The repository is currently minimal with only basic project initialization.

## Development Commands

No specific build, test, or development commands have been configured yet. Standard commands will likely be added as the project evolves.
