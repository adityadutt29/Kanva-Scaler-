import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import checkEnvironment from '@/util/check-environment';
import { SingleUser } from '@/types/user';
import { ColumnsSlice } from '@/src/types/columns';
import findIndex from 'lodash.findindex';

import { BoardSlice } from '@/src/types/boards';

const initialState = {
  columns: [],
  status: 'idle',
  isRequesting: false,
  doneFetching: true,
  error: {}
};

const host = checkEnvironment();

export const fetchColumns = createAsyncThunk('columns/fetchColumns', async (_obj, { getState, rejectWithValue }) => {
  const { board } = getState() as { board: BoardSlice };

  // Get token from localStorage for Authorization header
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${host}/api/boards/${board.board._id}/columns`, {
    method: 'GET',
    credentials: 'include',
    headers
  });

  const payload = await res.json().catch(() => null);

  if (!res.ok) {
    // return a rejected action with the error payload so rejected reducer runs
    return rejectWithValue(payload || { message: 'Failed to fetch columns', status: res.status });
  }

  return payload;
});

export const deleteColumn = createAsyncThunk(
  'column/deleteColumn',
  async (columnId: string, { getState }) => {
    const { board } = getState() as { board: BoardSlice };

    const url = `${host}/api/boards/${board.board._id}/columns/${columnId}`;

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

    const inJSON = await response.json();

    return inJSON;
  }
);

export const addColumnToBoard = createAsyncThunk(
  'column/add',
  async (columnId: string, { getState }) => {
    const { board } = getState() as { board: BoardSlice };
    const { user } = getState() as { user: SingleUser };
    const { columns } = getState() as { columns: ColumnsSlice };

    const columsArray = columns.columns;
    let sequence = 1;

    if (columns.columns.length > 0) {
      sequence = columsArray[columsArray.length - 1].sequence + 1;
    }

    const data = {
      id: columnId,
      boardId: board.board._id,
      columnName: 'Add title',
      dateCreated: new Date().toLocaleString(),
      userId: user.id,
      sequence
    };

    const url = `${host}/api/boards/${data.boardId}/columns`;

    // Get token from localStorage for Authorization header
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
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
  }
);

export const updateColumn = createAsyncThunk(
  'column/updateColumn',
  async (obj: { columnName: string; columnId: string }, { getState }) => {
    const { board } = getState() as { board: BoardSlice };

    const data = {
      _id: obj.columnId,
      boardName: board.board.name,
      columnName: obj.columnName
    };

    const url = `${host}/api/boards/${board.board._id}/columns/${obj.columnId}`;

    const response = await fetch(url, {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });

    const inJSON = await response.json();

    return inJSON;
  }
);

export const updateColumnSequence = createAsyncThunk(
  'card/updateCardSequence',
  async (obj: { _id: string; sequence: number }, { getState }) => {
    const { board } = getState() as { board: BoardSlice };
    const { _id, sequence } = obj;

    const data = {
      _id,
      sequence
    };

    const url = `${host}/api/boards/${board.board._id}/columns/${_id}`;

    const response = await fetch(url, {
      method: 'PATCH',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data)
    });

    const inJSON = await response.json();

    return inJSON;
  }
);

export const columnsSlice = createSlice({
  name: 'columns',
  initialState: initialState,
  reducers: {
    resetColumns: () => initialState,
    updateColumnSequenceToLocalState: (state, { payload }) => {
      const columnIndex = findIndex(state.columns, { _id: payload._id });
      state.columns[columnIndex].sequence = payload.sequence;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addColumnToBoard.pending, (state) => {
        state.status = 'pending';
        state.isRequesting = true;
      })
      .addCase(addColumnToBoard.fulfilled, (state) => {
        state.status = 'success';
        state.isRequesting = false;
      })
      .addCase(addColumnToBoard.rejected, (state) => {
        state.status = 'failed';
        state.isRequesting = false;
      })
      .addCase(fetchColumns.pending, (state) => {
        state.status = 'pending';
        state.isRequesting = true;
      })
      .addCase(fetchColumns.fulfilled, (state, action) => {
        const payload: any = action.payload;

        if (!Array.isArray(payload)) {
          // Unexpected payload (probably an error object). Keep state stable and record error.
          // eslint-disable-next-line no-console
          console.warn('fetchColumns fulfilled with non-array payload:', payload);
          state.columns = [];
          state.status = 'failed';
          state.isRequesting = false;
          state.error = payload || { message: 'Invalid columns response' };
          return;
        }

        const sortedColumns = payload.sort((a, b) => a.sequence - b.sequence);

        state.columns = sortedColumns;
        state.status = 'success';
        state.isRequesting = false;
      })
      .addCase(fetchColumns.rejected, (state) => {
        state.status = 'failed';
        state.isRequesting = false;
      })
      .addCase(deleteColumn.pending, (state) => {
        state.status = 'pending';
        state.isRequesting = true;
      })
      .addCase(deleteColumn.fulfilled, (state) => {
        state.status = 'success';
        state.isRequesting = false;
      })
      .addCase(deleteColumn.rejected, (state) => {
        state.status = 'failed';
        state.isRequesting = false;
      })
      .addCase(updateColumn.pending, (state) => {
        state.status = 'pending';
        state.isRequesting = true;
      })
      .addCase(updateColumn.fulfilled, (state) => {
        state.status = 'success';
        state.isRequesting = false;
      })
      .addCase(updateColumn.rejected, (state) => {
        state.status = 'failed';
        state.isRequesting = false;
      });
  }
});

export const { resetColumns, updateColumnSequenceToLocalState } = columnsSlice.actions;

export default columnsSlice.reducer;
