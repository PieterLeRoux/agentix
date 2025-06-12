import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from '@mui/material';
import {
  PlayArrow as StartIcon,
  SmartToy as AgentIcon,
  Groups as SquadIcon,
  Flag as GoalIcon,
  Category as GroupIcon,
  Transform as TransformerIcon,
  AccountTree as FlowIcon,
  Stop as EndIcon,
} from '@mui/icons-material';
import { useDrag } from 'react-dnd';

const nodeTypes = [
  {
    type: 'agent',
    label: 'AI Agent',
    icon: AgentIcon,
    color: 'primary',
    description: 'Individual AI agent',
  },
  {
    type: 'squad',
    label: 'Squad',
    icon: SquadIcon,
    color: 'info',
    description: 'Collection of agents',
  },
  {
    type: 'goal',
    label: 'Goal',
    icon: GoalIcon,
    color: 'warning',
    description: 'Specific objective',
  },
  {
    type: 'group',
    label: 'Group',
    icon: GroupIcon,
    color: 'secondary',
    description: 'Collection of squads',
  },
  {
    type: 'transformer',
    label: 'Transformer',
    icon: TransformerIcon,
    color: 'primary',
    description: 'Data transformation',
  },
  {
    type: 'flow',
    label: 'Flow',
    icon: FlowIcon,
    color: 'info',
    description: 'Sub-workflow reference',
  },
];

function DraggableNodeItem({ nodeType }) {
  const [{ isDragging }, drag] = useDrag({
    type: 'NODE',
    item: { nodeType: nodeType.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const IconComponent = nodeType.icon;

  return (
    <ListItem
      ref={drag}
      sx={{
        cursor: 'grab',
        opacity: isDragging ? 0.5 : 1,
        mb: 0.5,
        borderRadius: 1,
        border: 1,
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        py: 1,
        '&:hover': {
          backgroundColor: 'action.hover',
          borderColor: `${nodeType.color}.main`,
        },
        '&:active': {
          cursor: 'grabbing',
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 32 }}>
        <IconComponent color={nodeType.color} />
      </ListItemIcon>
      <ListItemText
        primary={nodeType.label}
        secondary={nodeType.description}
        primaryTypographyProps={{
          variant: 'body2',
          fontWeight: 500,
        }}
        secondaryTypographyProps={{
          variant: 'caption',
        }}
      />
    </ListItem>
  );
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
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Node Palette
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