# Agentix

A multi-agent orchestration UI tool that allows users to create and manage AI agent workflows through visual graph interfaces.

## Overview

Agentix provides a visual graph editor for building complex multi-agent workflows. Users can create:
- **Agents**: Individual AI agents with specific roles and capabilities
- **Squads**: Collections of agents working together
- **Groups**: Collections of squads with defined goals
- **Transformers**: Code snippets for data transformation
- **Flows**: Complete workflows connecting all components

## Technology Stack

- **Frontend**: React with Vite
- **UI Framework**: Material-UI (MUI) with custom blue theme
- **Routing**: React Router DOM
- **Graph Editor**: Rete.js for visual workflow design
- **Code Quality**: ESLint and Prettier
- **Testing**: Jest/Vitest + React Testing Library

## Project Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── TopBar.jsx
│   │   ├── LeftNavigation.jsx
│   │   └── MainLayout.jsx
│   └── common/
├── pages/
│   └── Flows/
│       └── FlowsPage.jsx
├── theme/
│   └── theme.js
├── utils/
└── __tests__/
```

## Features

- **Visual Flow Designer**: Build workflows using drag-and-drop graph interface
- **Multi-Agent Orchestration**: Coordinate multiple AI agents
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Theme**: Toggle between themes
- **Modern UI**: Clean, professional interface with Material-UI

## Development

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup
```bash
npm install
npm run dev
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Getting Started

1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Navigate to "Flows" to begin creating agent workflows
4. Use the visual graph editor to connect agents, squads, and transformers

## Contributing

1. Follow the established code style (ESLint + Prettier)
2. Write tests for new components
3. Ensure responsive design principles
4. Maintain accessibility standards