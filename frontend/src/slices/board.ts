import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import checkEnvironment from '@/util/check-environment';
import { BoardSlice, ActivityLogEntry } from '@/types/boards';

interface WebSocketCommentAddedPayload {
  comment: any;
  cardId: string;
  userId: string;
  timestamp: string;
}

// interface ActivityLogEntry {
//   _id: string;
//   boardId: string;
//   actorId: string;
//  actorName?: string;
//   action: string;
//   targetId?: string;
//   targetType?: string;
//   timestamp: string | Date;
//   details?: any;
// }

const initialState = {
  board: {
    _id: '',
    name: '',
    columns: [],
    createdBy: '',
    dateCreated: '',
    backgroundImage: '',
    users: []
  },
  activityLog: [],
  status: 'idle',
  isLoading: false,
  error: ''
};

const host = checkEnvironment();

export const saveBoard = createAsyncThunk('board/save', async (obj, { getState }) => {
  const { board } = getState() as { board: BoardSlice };

  const data = {
    _id: board.board._id,
    name: board.board.name,
    dateCreated: board.board.dateCreated,
    createdBy: board.board.createdBy,
    backgroundImage: board.board.backgroundImage
  };

  const url = `${host}/api/boards/${data._id}`;

  // Get token from localStorage for Authorization header
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'PATCH',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers,
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: JSON.stringify(data)
  });

  const json = await response.json();

  return json;
});

export const fetchBoard = createAsyncThunk('board/get', async (slug: string) => {
  const url = `${host}/api/boards/${slug}`;
  
  // Get token from localStorage for Authorization header
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers
  });
  const json = await response.json();

  return json;
});

export const deleteBoard = createAsyncThunk('board/delete', async (obj, { getState }) => {
  const { board } = getState() as { board: BoardSlice };

  const _id = board.board._id;

  const url = `${host}/api/boards/${_id}`;

  // Get token from localStorage for Authorization header
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: 'DELETE',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include',
    headers,
    redirect: 'follow',
    referrerPolicy: 'no-referrer'
  });

  const json = await response.json();

  return json;
});

export const fetchActivityLog = createAsyncThunk(
  'board/fetchActivityLog',
  async ({ boardId, limit }: { boardId: string; limit: number }) => {
    const host = checkEnvironment();
    const url = `${host}/api/boards/${boardId}/activity?limit=${limit}`;

    // Get token from localStorage for Authorization header
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers
    });
    const json = await response.json();

    return json;
 }
);

export const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    updateBoardDetail: (state, { payload }) => {
      state.board[payload.type] = payload.value;
    },
    resetBoard: () => initialState,
    // WebSocket event handlers
    handleCommentAdded: (state, action: PayloadAction<WebSocketCommentAddedPayload>) => {
      // This would update card comments in the state if we had card data in the board slice
      // For now, we'll handle this in the cards slice or in a separate comments slice
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoard.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(fetchBoard.fulfilled, (state, action) => {
        const payload: any = action.payload;
        state.board = payload;
        state.status = 'success';
      })
      .addCase(fetchBoard.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(saveBoard.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(saveBoard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'success';
      })
      .addCase(saveBoard.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })
      .addCase(deleteBoard.pending, (state) => {
        state.status = 'pending';
        state.isLoading = true;
      })
      .addCase(deleteBoard.fulfilled, (state) => {
        state.isLoading = false;
        state.status = 'success';
      })
      .addCase(deleteBoard.rejected, (state) => {
        state.status = 'failed';
        state.isLoading = false;
      })
      .addCase(fetchActivityLog.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchActivityLog.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activityLog = action.payload;
      })
      .addCase(fetchActivityLog.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Failed to fetch activity log';
      });
  }
});

export const { updateBoardDetail, resetBoard, handleCommentAdded } = boardSlice.actions;

export default boardSlice.reducer;
