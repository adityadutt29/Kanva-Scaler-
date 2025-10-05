import React, { useState, useEffect } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Box,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import {
  Event as ActivityIcon,
  Close as CloseIcon,
  Person as UserIcon,
  Description as CardIcon,
  ViewColumn as ColumnIcon,
 Comment as CommentIcon,
  MenuBook as ActivityToggleIcon
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { fetchActivityLog } from '@/slices/board';
import { ActivityLogEntry } from '@/types/boards';

// Define ActivityLogEntry interface locally if not importing from types
// interface ActivityLogEntry {
//   _id: string;
//   boardId: string;
//   actorId: string;
//   actorName?: string; // Will be populated from user data
//   action: string;
//   targetId?: string;
//   targetType?: string;
//   timestamp: string | Date;
//   details?: any;
// }

interface ActivitySidebarProps {
  open: boolean;
  onClose: () => void;
}

const ActivitySidebar: React.FC<ActivitySidebarProps> = ({ open, onClose }) => {
  const dispatch = useAppDispatch();
  const board = useAppSelector((state) => state.board.board);
  const activityLog = useAppSelector((state) => state.board.activityLog);
  const [loading, setLoading] = useState(true);

  // Fetch activity log when component mounts or board changes
  useEffect(() => {
    if (open && board._id) {
      const fetchData = async () => {
        try {
          await dispatch(fetchActivityLog({ boardId: board._id, limit: 20 }));
        } finally {
          setLoading(false);
        }
      };
      
      fetchData();
    }
  }, [dispatch, board._id, open]);

  // Format action text based on activity type
  const formatActivityText = (activity: ActivityLogEntry) => {
    const { action, actorName, targetType, details } = activity;
    
    // Get target name from details if available
    const targetName = details?.targetName || details?.name || details?.columnName || details?.title || activity.targetId || 'item';
    
    // Normalize action to uppercase for comparison
    const normalizedAction = action?.toUpperCase() || '';
    
    switch (normalizedAction) {
      case 'CARD_CREATED':
        return `${actorName} created card "${targetName}"`;
      case 'CARD_UPDATED':
        return `${actorName} updated card "${targetName}"`;
      case 'CARD_DELETED':
        return `${actorName} deleted card "${targetName}"`;
      case 'COLUMN_CREATED':
        return `${actorName} created column "${targetName}"`;
      case 'COLUMN_UPDATED':
        return `${actorName} updated column "${targetName}"`;
      case 'COLUMN_DELETED':
        return `${actorName} deleted column "${targetName}"`;
      case 'COMMENT_ADDED':
        return `${actorName} added a comment to "${targetName}"`;
      case 'COMMENT_UPDATED':
        return `${actorName} updated a comment in "${targetName}"`;
      case 'COMMENT_DELETED':
        return `${actorName} deleted a comment from "${targetName}"`;
      default:
        return `${actorName} ${action?.toLowerCase().replace(/_/g, ' ') || 'performed action on'} ${targetType?.toLowerCase() || 'item'} "${targetName}"`;
    }
  };

  // Get icon based on target type
  const getTargetIcon = (targetType: string | undefined) => {
    switch (targetType) {
      case 'card':
        return <CardIcon fontSize="small" />;
      case 'column':
        return <ColumnIcon fontSize="small" />;
      case 'comment':
        return <CommentIcon fontSize="small" />;
      default:
        return <ActivityIcon fontSize="small" />;
    }
  };

  // Format timestamp to readable format
  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        width: 350,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 350,
          boxSizing: 'border-box',
          backgroundColor: '#f5f5f5',
        },
      }}
    >
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" component="h2">
          Activity
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 1 }}>
        {loading ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography>Loading activities...</Typography>
          </Box>
        ) : activityLog.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography>No activities yet.</Typography>
          </Box>
        ) : (
          <List dense>
            {activityLog.map((activity: ActivityLogEntry) => (
              <ListItem key={activity._id} sx={{ mb: 1, backgroundColor: 'white', borderRadius: 1, p: 1 }}>
                <ListItemIcon>
                  {getTargetIcon(activity.targetType)}
                </ListItemIcon>
                <ListItemText
                  primary={formatActivityText(activity)}
                  secondary={formatTimestamp(activity.timestamp)}
                  primaryTypographyProps={{ 
                    variant: 'body2',
                    sx: { wordBreak: 'break-word' }
                  }}
                  secondaryTypographyProps={{ 
                    variant: 'caption',
                    color: 'textSecondary'
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Drawer>
  );
};

export default ActivitySidebar;