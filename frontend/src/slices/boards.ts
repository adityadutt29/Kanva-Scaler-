import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import checkEnvironment from '@/util/check-environment';
import { SingleUser } from '@/types/user';
import { BoardSlice } from '@/src/types/boards';

const initialState = {
  boards: [],
  status: 'idle',
  doneFetching: true,
  isRequesting: false,
  error: {}
};

const host = checkEnvironment();

export const fetchBoards = createAsyncThunk('boards/fetchBoards', async (_obj, { getState }) => {
  const { user } = getState() as { user: SingleUser };
  const id = user.id;

  // Get token from localStorage for authentication
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${host}/api/boards?userid=${id}`, {
    method: 'GET',
    credentials: 'include',
    headers
  }).then((response) => response.json());

  return response;
});

export const createBoard = createAsyncThunk('board/create', async (_obj, { getState }) => {
  const { board } = getState() as { board: BoardSlice };
  const { user } = getState() as { user: SingleUser };

  const data = {
    _id: board.board._id,
    name: board.board.name,
    dateCreated: board.board.dateCreated,
    createdBy: user.id,
    backgroundImage: '/boards/board-background.jpg'
  };

  const url = `${host}/api/boards`;

  // Get token from localStorage for authentication
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers,
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });

  const inJSON = await response.json();
  return inJSON;
});

export const boardSlice = createSlice({
  name: 'boards',
  initialState: initialState,
  reducers: {
    resetBoards: () => initialState
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        const payload: any = action.payload;
        state.boards = payload;
        state.status = 'success';
      })
      .addCase(fetchBoards.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(createBoard.pending, (state) => {
        state.isRequesting = true;
        state.status = 'pending';
      })
      .addCase(createBoard.fulfilled, (state) => {
        state.isRequesting = false;
        state.status = 'success';
      })
      .addCase(createBoard.rejected, (state) => {
        state.isRequesting = false;
        state.status = 'failed';
      });
  }
});

export const { resetBoards } = boardSlice.actions;

export default boardSlice.reducer;
