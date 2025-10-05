import WebSocketServer from './websocket-server.ts';

// This will be initialized when the server starts
let websocketServer: WebSocketServer | null = null;

// Function to initialize the WebSocket server
export const initializeWebSocketServer = (server: any) => {
  websocketServer = new WebSocketServer(server);
};

// Function to broadcast card move event
export const broadcastCardMove = async (boardId: string, cardData: any, oldColumnId: string, newColumnId: string, userId: string) => {
  if (websocketServer) {
    const message = {
      type: 'CARD_MOVED',
      boardId,
      payload: {
        card: cardData,
        oldColumnId,
        newColumnId,
        userId,
        timestamp: new Date().toISOString()
      }
    };
    
    websocketServer.broadcastToBoard(boardId, message);
  }
};

// Function to broadcast comment added event
export const broadcastCommentAdded = async (boardId: string, commentData: any, cardId: string, userId: string) => {
  if (websocketServer) {
    const message = {
      type: 'COMMENT_ADDED',
      boardId,
      payload: {
        comment: commentData,
        cardId,
        userId,
        timestamp: new Date().toISOString()
      }
    };
    
    websocketServer.broadcastToBoard(boardId, message);
  }
};

// Function to broadcast card update event
export const broadcastCardUpdate = async (boardId: string, cardData: any, userId: string) => {
  if (websocketServer) {
    const message = {
      type: 'CARD_UPDATED',
      boardId,
      payload: {
        card: cardData,
        userId,
        timestamp: new Date().toISOString()
      }
    };
    
    websocketServer.broadcastToBoard(boardId, message);
  }
};

// Function to broadcast card delete event
export const broadcastCardDelete = async (boardId: string, cardId: string, userId: string) => {
  if (websocketServer) {
    const message = {
      type: 'CARD_DELETED',
      boardId,
      payload: {
        cardId,
        userId,
        timestamp: new Date().toISOString()
      }
    };
    
    websocketServer.broadcastToBoard(boardId, message);
  }
};

// Export the WebSocket server instance for use in API routes
export { websocketServer };