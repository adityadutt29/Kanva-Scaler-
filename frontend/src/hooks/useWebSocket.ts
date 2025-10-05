import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import {
 connectWebSocket,
   disconnectWebSocket,
   selectCurrentBoardId
} from '../slices/websocket';
import {
  handleCardMoved,
  handleCardUpdated,
  handleCardDeleted
} from '../slices/cards';
import { handleCommentAdded } from '../slices/board';
import { RootState } from '../store';

const useWebSocket = (token: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  const dispatch = useDispatch();
  const boardId = useSelector((state: RootState) => selectCurrentBoardId(state));

  useEffect(() => {
    if (!token || !boardId) return;

    // Connect to WebSocket server
    const socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000', {
      auth: {
        token
      }
    });

    socketRef.current = socket;

    // Join the board room
    socket.emit('join_board', boardId);

    // Dispatch WebSocket connected action
    dispatch(connectWebSocket(boardId));

    // Listen for board updates
    socket.on('board_update', (data) => {
      console.log('Received WebSocket message:', data);
      
      switch (data.type) {
        case 'CARD_MOVED':
          dispatch(handleCardMoved(data.payload));
          break;
        case 'CARD_UPDATED':
          dispatch(handleCardUpdated(data.payload));
          break;
        case 'CARD_DELETED':
          dispatch(handleCardDeleted(data.payload));
          break;
        case 'COMMENT_ADDED':
          dispatch(handleCommentAdded(data.payload));
          break;
        default:
          console.warn('Unknown WebSocket message type:', data.type);
      }
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      dispatch(disconnectWebSocket());
    });

    // Clean up function
    return () => {
      if (socketRef.current) {
        // Leave the board room before disconnecting
        socketRef.current.emit('leave_board', boardId);
        socketRef.current.disconnect();
        dispatch(disconnectWebSocket());
      }
    };
  }, [token, boardId, dispatch]);

  return socketRef.current;
};

export default useWebSocket;