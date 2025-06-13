import { memo } from 'react';

const socketStyles = {
  display: 'inline-block' as const,
  cursor: 'pointer' as const,
  border: '2px solid #1976d2',
  width: '12px',
  height: '12px',
  borderRadius: '50%',
  verticalAlign: 'middle' as const,
  background: '#fff',
  zIndex: 2,
  boxSizing: 'border-box' as const,
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const hoverStyles = `
  .custom-socket:hover {
    background: #1976d2 !important;
    border-color: #1565c0 !important;
    transform: scale(1.3);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;

// Inject hover styles once
if (typeof document !== 'undefined' && !document.getElementById('socket-hover-styles')) {
  const style = document.createElement('style');
  style.id = 'socket-hover-styles';
  style.textContent = hoverStyles;
  document.head.appendChild(style);
}

interface CustomSocketProps {
  data?: {
    name?: string;
    [key: string]: any;
  };
  [key: string]: any;
}

export const CustomSocket = memo(function CustomSocket(props: CustomSocketProps) {
  const { data } = props;
  
  return (
    <div 
      className="custom-socket"
      style={socketStyles} 
      title={data?.name} 
    />
  );
});