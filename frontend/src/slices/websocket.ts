import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface WebSocketState {
  isConnected: boolean;
  boardId: string | null;
  reconnectAttempts: number;
}

const initialState: WebSocketState = {
  isConnected: false,
  boardId: null,
  reconnectAttempts: 0,
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    connectWebSocket: (state, action: PayloadAction<string>) => {
      state.boardId = action.payload;
      state.isConnected = true;
      state.reconnectAttempts = 0;
    },
    disconnectWebSocket: (state) => {
      state.isConnected = false;
      state.boardId = null;
    },
    setReconnectAttempts: (state, action: PayloadAction<number>) => {
      state.reconnectAttempts = action.payload;
    },
    resetWebSocketState: (state) => {
      state.isConnected = false;
      state.boardId = null;
      state.reconnectAttempts = 0;
    }
  },
});

// Export actions
export const {
  connectWebSocket,
  disconnectWebSocket,
  setReconnectAttempts,
  resetWebSocketState
} = websocketSlice.actions;

// Export selectors
export const selectWebSocketConnected = (state: RootState) => state.websocket.isConnected;
export const selectCurrentBoardId = (state: RootState) => state.websocket.boardId;
export const selectReconnectAttempts = (state: RootState) => state.websocket.reconnectAttempts;

// Export reducer
export default websocketSlice.reducer;