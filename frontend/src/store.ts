import { configureStore } from '@reduxjs/toolkit';
import boardsSlice from '@/slices/boards';
import userSlice from '@/slices/user';
import boardSlice from '@/slices/board';
import columnsSlice from '@/slices/columns';
import cardsSlice from '@/slices/cards';
import usersSlice from '@/slices/users';
import websocketSlice from '@/slices/websocket';

const createStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      boards: boardsSlice,
      board: boardSlice,
      user: userSlice,
      columns: columnsSlice,
      cards: cardsSlice,
      users: usersSlice,
      websocket: websocketSlice
    },
    preloadedState
  });
};

const store = configureStore({
  reducer: {
    boards: boardsSlice,
    user: userSlice,
    board: boardSlice,
    columns: columnsSlice,
    cards: cardsSlice,
    users: usersSlice,
    websocket: websocketSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default createStore;
