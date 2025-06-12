# Axis

A modern multi-agent orchestration platform built with React that provides visual workflow design for coordinating AI agents through an intuitive graph-based interface.

## 🎯 Project Vision

Axis aims to democratize multi-agent AI workflows by providing a user-friendly visual interface where users can:
- Design complex agent interactions through drag-and-drop flow builders
- Orchestrate teams of specialized AI agents working together
- Create reusable workflow templates for common multi-agent patterns
- Monitor and manage agent performance in real-time

## 🚀 Current Status

**Phase 1: Foundation & UI (In Progress)**
- ✅ Modern React application with Material-UI design system
- ✅ Responsive layout with dark/light theme support  
- ✅ Professional dashboard with metrics and charts (Recharts)
- ✅ Navigation structure for main application areas
- ✅ Inter font integration for enhanced typography
- 🔄 **Currently implementing**: Rete.js visual flow editor integration

**Phase 2: Multi-Agent Core (Planned)**
- 🔄 Agent node types (Research, Writing, Analysis, etc.)
- 🔄 Squad formation (grouped agents with shared objectives)
- 🔄 Flow execution engine with real-time monitoring
- 🔄 Template library for common multi-agent patterns

**Phase 3: Advanced Features (Future)**
- 📋 Integration with popular AI APIs (OpenAI, Anthropic, etc.)
- 📋 Workflow version control and sharing
- 📋 Performance analytics and optimization insights
- 📋 Multi-user collaboration features

## 🛠 Technology Stack

### Frontend Framework
- **React 18** with Vite for fast development and building
- **Material-UI (MUI)** for consistent, accessible component design
- **React Router DOM** for client-side routing
- **Inter Font** for modern typography

### Visual Flow Editor
- **Rete.js** for node-based visual programming interface
- **Styled Components** for enhanced styling capabilities
- **Custom node types** for different agent categories

### Data Visualization
- **Recharts** for dashboard metrics and performance charts
- **Responsive design** that works across all device sizes

### Code Quality & Development
- **ESLint** and **Prettier** for consistent code formatting
- **React Testing Library** with **Vitest** for comprehensive testing
- **Git workflow** with feature branches and pull requests

## 📁 Project Architecture

```
src/
├── components/
│   ├── FlowEditor/           # Rete.js visual flow editor
│   │   └── FlowEditor.jsx
│   ├── Layout/               # Application shell components
│   │   ├── TopBar.jsx
│   │   ├── LeftNavigation.jsx
│   │   └── MainLayout.jsx
│   └── common/               # Reusable UI components
├── pages/
│   ├── Dashboard/            # Metrics and overview
│   ├── Flows/                # Visual workflow designer
│   ├── Agents/               # Agent management (planned)
│   └── Settings/             # User preferences
├── theme/
│   └── theme.js              # Material-UI theme configuration
└── assets/                   # Static files and images
```

## ✨ Key Features

### Dashboard & Analytics
- **Real-time metrics** showing active flows, agents, and success rates
- **Interactive charts** for performance trends and task completion
- **System health monitoring** with uptime and response time tracking
- **Activity feed** showing recent workflow executions

### Visual Flow Designer
- **Node-based editor** powered by Rete.js for intuitive workflow creation
- **Agent nodes** representing individual AI agents with specific capabilities
- **Connection system** for defining data flow between agents
- **Context menu** for quick node creation and management

### Modern UI/UX
- **Professional design** with custom blue theme and consistent spacing
- **Dark/light mode** toggle available in settings
- **Responsive layout** that adapts to desktop and mobile screens
- **Typography optimization** using Inter font for enhanced readability

## 🚦 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** or **yarn** package manager

### Development Setup
```bash
# Clone the repository
git clone <repository-url>
cd axis

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Available Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Create optimized production build
- `npm run preview` - Preview the production build locally
- `npm run test` - Run test suite with Vitest
- `npm run lint` - Check code quality with ESLint
- `npm run format` - Auto-format code with Prettier

## 🎮 Usage Guide

### Exploring the Dashboard
1. Navigate to the **Dashboard** to view system metrics and performance charts
2. Monitor active flows, agent performance, and task completion rates
3. Check system health status and recent activity

### Creating Flows (In Development)
1. Go to the **Flows** section to access the visual editor
2. Right-click to add new agent nodes to the canvas
3. Connect agents by dragging between input and output sockets
4. Configure agent properties through node controls

### Customizing Settings
1. Visit **Settings** to configure your workspace preferences
2. Toggle between light and dark themes
3. Manage notification and auto-save preferences

## 🤝 Contributing

We welcome contributions to help build the future of multi-agent orchestration! Here's how you can help:

### Development Guidelines
1. **Code Style**: Follow ESLint and Prettier configurations
2. **Testing**: Write tests for new components and features
3. **Responsive Design**: Ensure all features work across device sizes
4. **Accessibility**: Maintain WCAG compliance for inclusive design

### Contribution Process
1. Fork the repository and create a feature branch
2. Make your changes following the established patterns
3. Test thoroughly and ensure the build passes
4. Submit a pull request with a clear description of changes

## 📈 Roadmap

**Immediate Goals**
- Complete Rete.js flow editor integration
- Implement basic agent node types (Research, Writing, Analysis)
- Add flow execution simulation with visual feedback

**Short-term Goals**
- Real agent integration with AI APIs
- Squad formation and management features  
- Workflow templates and sharing capabilities

**Long-term Vision**
- Enterprise-grade collaboration features
- Advanced analytics and optimization insights
- Plugin ecosystem for extending functionality
- Community marketplace for sharing workflows

---

**Built with ❤️ for the future of AI agent orchestration**