import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Groups as TeamsIcon,
  CallSplit as DelegatesIcon,
  AccountTree as SubFlowsIcon,
} from '@mui/icons-material';
import { useDrag } from 'react-dnd';

const nodeTypes = [
  {
    type: 'teams',
    label: 'Teams',
    icon: TeamsIcon,
    color: 'info',
    description: 'Agent team with goal and result',
  },
  {
    type: 'delegates',
    label: 'Delegates',
    icon: DelegatesIcon,
    color: 'cyan',
    description: 'Code transformer functions',
  },
  {
    type: 'subflows',
    label: 'Sub Flows',
    icon: SubFlowsIcon,
    color: 'success',
    description: 'Nested workflow execution',
    disabled: false,
  },
];

function DraggableNodeItem({ nodeType }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'NODE',
    item: { nodeType: nodeType.type },
    canDrag: !nodeType.disabled,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const IconComponent = nodeType.icon;
  const iconColor = nodeType.color === 'cyan' ? '#00bcd4' : nodeType.color;
  const isDisabled = nodeType.disabled;

  const listItem = (
    <ListItem
      ref={!isDisabled ? drag : null}
      sx={{
        cursor: isDisabled ? 'not-allowed' : 'grab',
        opacity: isDisabled ? 0.4 : (isDragging ? 0.5 : 1),
        mb: 0.5,
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        backgroundColor: isDisabled ? 'action.disabledBackground' : 'background.paper',
        py: 1,
        '&:hover': !isDisabled ? {
          backgroundColor: 'action.hover',
          borderColor: nodeType.color === 'cyan' ? '#00bcd4' : `${nodeType.color}.main`,
        } : {},
        '&:active': !isDisabled ? {
          cursor: 'grabbing',
        } : {},
      }}
    >
      <ListItemIcon sx={{ minWidth: 32 }}>
        <IconComponent 
          sx={{ 
            color: isDisabled ? 'action.disabled' : (nodeType.color === 'cyan' ? '#00bcd4' : undefined)
          }}
          color={!isDisabled && nodeType.color !== 'cyan' ? nodeType.color : undefined} 
        />
      </ListItemIcon>
      <ListItemText
        primary={nodeType.label}
        secondary={isDisabled ? 'Coming Soon' : nodeType.description}
        primaryTypographyProps={{
          variant: 'body2',
          fontWeight: 500,
          sx: { color: isDisabled ? 'text.disabled' : 'text.primary' }
        }}
        secondaryTypographyProps={{
          variant: 'caption',
          sx: { 
            fontSize: '10px',
            color: isDisabled ? 'text.disabled' : 'text.secondary'
          },
        }}
      />
    </ListItem>
  );

  if (isDisabled) {
    return (
      <Tooltip title="Sub Flows are coming soon!" placement="right">
        {listItem}
      </Tooltip>
    );
  }

  if (nodeType.type === 'subflows') {
    return (
      <Tooltip title="Create nested workflows within your main workflow" placement="right">
        {listItem}
      </Tooltip>
    );
  }

  return listItem;
}

const NodePalette = () => {
  return (
    <Paper
      elevation={1}
      sx={{
        width: 250,
        height: '100%',
        p: 1.5,
        backgroundColor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
        Node Palette
      </Typography>
      
      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: 'block', fontSize: '10px' }}>
        Drag nodes to canvas to build workflow
      </Typography>

      <List sx={{ p: 0 }}>
        {nodeTypes.map((nodeType) => (
          <DraggableNodeItem key={nodeType.type} nodeType={nodeType} />
        ))}
      </List>
    </Paper>
  );
};

export default NodePalette;