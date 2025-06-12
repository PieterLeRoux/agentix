import React, { memo } from 'react';
import { Presets } from 'rete-react-plugin';

const { useConnection } = Presets.classic;

const svgStyles = {
  overflow: 'visible',
  position: 'absolute',
  pointerEvents: 'none',
  width: '9999px',
  height: '9999px',
};

const pathStyles = {
  fill: 'none',
  strokeWidth: '3px',
  stroke: '#1976d2',
  pointerEvents: 'auto',
  opacity: 0.8,
};

const hoverStyles = `
  .custom-connection path:hover {
    stroke: #1565c0 !important;
    stroke-width: 4px !important;
    opacity: 1 !important;
  }
  
  .custom-connection.selected path {
    stroke: #9c27b0 !important;
    stroke-width: 4px !important;
    opacity: 1 !important;
  }
`;

// Inject hover styles once
if (typeof document !== 'undefined' && !document.getElementById('connection-hover-styles')) {
  const style = document.createElement('style');
  style.id = 'connection-hover-styles';
  style.textContent = hoverStyles;
  document.head.appendChild(style);
}

export const CustomConnection = memo(function CustomConnection(props) {
  const { data, styles: customStyles } = props;
  const { path } = useConnection();

  if (!path) return null;

  return (
    <svg className="custom-connection" style={svgStyles} data-testid="connection">
      <path 
        style={{
          ...pathStyles,
          ...(customStyles ? customStyles(props) : {})
        }}
        d={path}
      />
    </svg>
  );
});