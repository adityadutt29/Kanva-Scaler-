import { Server as HttpServer } from 'http';
import { Server as SocketIoServer, Socket } from 'socket.io';
import { verifyTokenAndGetUserId } from './verify-jwt-token.ts';

// Define types for our WebSocket messages
interface WebSocketMessage {
  type: string;
  boardId: string;
  payload: any;
}

interface BoardClients {
  [boardId: string]: Socket[];
}

class WebSocketServer {
  private io: SocketIoServer;
  private boardClients: BoardClients = {};

  constructor(server: HttpServer) {
    // Initialize Socket.IO with CORS settings
    this.io = new SocketIoServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true
      }
    });

    this.setupConnectionHandler();
  }

  private setupConnectionHandler(): void {
    this.io.use(async (socket, next) => {
      try {
        // Extract token from handshake auth
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        
        if (!token) {
          console.log('Authentication error: No token provided');
          next(new Error('Authentication error: No token provided'));
          return;
        }

        // Verify the token
        const userId = await verifyTokenAndGetUserId(token as string);
        if (!userId) {
          console.log('Authentication error: Invalid token');
          next(new Error('Authentication error: Invalid token'));
          return;
        }

        // Store user ID in socket for later use
        socket.data.userId = userId;
        next();
      } catch (err) {
        console.log('Authentication error:', err);
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket: Socket) => {
      console.log('New client connected:', socket.id);

      // Join a board room
      socket.on('join_board', (boardId: string) => {
        // Add socket to the board's client list
        if (!this.boardClients[boardId]) {
          this.boardClients[boardId] = [];
        }
        
        // Check if socket is already in the board
        const existingIndex = this.boardClients[boardId].findIndex(s => s.id === socket.id);
        if (existingIndex === -1) {
          this.boardClients[boardId].push(socket);
        }
        
        socket.join(boardId);
        console.log(`Socket ${socket.id} joined board ${boardId}`);
      });

      // Leave a board room
      socket.on('leave_board', (boardId: string) => {
        socket.leave(boardId);
        
        if (this.boardClients[boardId]) {
          this.boardClients[boardId] = this.boardClients[boardId].filter(s => s.id !== socket.id);
          
          // Clean up empty board rooms
          if (this.boardClients[boardId].length === 0) {
            delete this.boardClients[boardId];
          }
        }
        
        console.log(`Socket ${socket.id} left board ${boardId}`);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        
        // Remove socket from all board client lists
        Object.keys(this.boardClients).forEach(boardId => {
          this.boardClients[boardId] = this.boardClients[boardId].filter(s => s.id !== socket.id);
          
          // Clean up empty board rooms
          if (this.boardClients[boardId].length === 0) {
            delete this.boardClients[boardId];
          }
        });
      });
    });
  }

  // Broadcast a message to all clients connected to a specific board
  public broadcastToBoard(boardId: string, message: WebSocketMessage): void {
    if (this.boardClients[boardId] && this.boardClients[boardId].length > 0) {
      console.log(`Broadcasting to board ${boardId}:`, message);
      this.io.to(boardId).emit('board_update', message);
    }
  }

  // Get the Socket.IO server instance
  public getServer(): SocketIoServer {
    return this.io;
  }
}

export default WebSocketServer;