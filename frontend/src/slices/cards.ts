import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import checkEnvironment from '@/util/check-environment';
import { SingleUser } from '@/types/user';
import { CardSlice } from '@/src/types/cards';
import { BoardSlice } from '@/src/types/boards';
import shortId from 'shortid';
import findIndex from 'lodash.findindex';

type CardPatch = {
  _id: string;
 title?: string;
 description?: string;
 columnId?: string;
  assignedTo?: string;
  sequence?: number;
};

type SearchFilterState = {
  searchText: string;
  labels: string[];
 assignees: string[];
  dueDate: string;
};

interface WebSocketCardMovePayload {
  card: any;
  oldColumnId: string;
  newColumnId: string;
  userId: string;
  timestamp: string;
}

interface WebSocketCardUpdatePayload {
  card: any;
  userId: string;
  timestamp: string;
}

interface WebSocketCardDeletePayload {
  cardId: string;
  userId: string;
  timestamp: string;
}

const initialState = {
  cards: [],
  filteredCards: [],
  status: 'idle',
  isRequesting: false,
  isDeleting: false,
  doneFetching: true,
  error: {},
  searchFilters: {
    searchText: '',
    labels: [],
    assignees: [],
    dueDate: ''
  }
};

const host = checkEnvironment();

export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async (_obj, { getState, rejectWithValue }) => {
    const { board } = getState() as { board: BoardSlice };
    const url = `${host}/api/boards/${board.board._id}/cards`;

    try {
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
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'include',
        headers,
        redirect: 'follow',
        referrerPolicy: 'no-referrer'
      });

      if (!response.ok) {
        const inJSON = await response.json().catch(() => ({}));
        return rejectWithValue(inJSON);
      }

      const inJSON = await response.json().catch(() => []);

      return inJSON;
    } catch (err: any) {
      return rejectWithValue({ message: 'Network error', details: err?.message || err });
    }
  }
);

export const deleteCard = createAsyncThunk(
  'card/deleteCard',
  async (cardId: string, { getState }) => {
    const { board } = getState() as { board: BoardSlice };

    const url = `${host}/api/boards/${board.board._id}/cards/${cardId}`;

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

export const addCard = createAsyncThunk('card/addCard', async (columnId: string, { getState }) => {
  const { board } = getState() as { board: BoardSlice };
  const { user } = getState() as { user: SingleUser };
  const { cards } = getState() as { cards: CardSlice };

  const filteredCards = cards.cards.filter((card) => card.columnId === columnId);

  let sequence = 1;

  if (filteredCards.length > 0) {
    sequence = filteredCards[filteredCards.length - 1].sequence + 1;
  }

  const cardId = shortId.generate();

  const data = {
    id: cardId,
    columnId: columnId,
    boardId: board.board._id,
    title: 'Add title',
    type: '',
    description: '',
    dateCreated: new Date().toLocaleString(),
    userId: user.id,
    assignedTo: '',
    sequence
  };

  const url = `${host}/api/boards/${data.boardId}/columns/${columnId}/cards`;

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
});

export const updateCard = createAsyncThunk(
 'card/updateCard',
  async (obj: CardPatch, { getState }) => {
    const { board } = getState() as { board: BoardSlice };

    const url = `${host}/api/boards/${board.board._id}/cards/${obj._id}`;

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
      body: JSON.stringify(obj)
    });

    const inJSON = await response.json();

    return inJSON;
  }
);

// Action to update search filters
export const updateSearchFilters = createAsyncThunk(
  'cards/updateSearchFilters',
  async (filters: SearchFilterState, { getState }) => {
    // Return the filters to be applied
    return filters;
 }
);

// Action to apply search and filters to cards
export const applySearchFilters = createAsyncThunk(
  'cards/applySearchFilters',
  async (_, { getState }) => {
    const state = getState() as any;
    const { cards, searchFilters } = state.cards;
    const { users } = state.users;
    
    // Filter cards based on search text, labels, assignees, and due date
    let filteredCards = [...cards];
    
    // Apply search text filter (search in title and label)
    if (searchFilters.searchText) {
      const searchTextLower = searchFilters.searchText.toLowerCase();
      filteredCards = filteredCards.filter(card =>
        card.title.toLowerCase().includes(searchTextLower) ||
        (card.label && card.label.type.toLowerCase().includes(searchTextLower))
      );
    }
    
    // Apply label filter
    if (searchFilters.labels.length > 0) {
      filteredCards = filteredCards.filter(card =>
        card.label && searchFilters.labels.includes(card.label.type)
      );
    }
    
    // Apply assignee filter
    if (searchFilters.assignees.length > 0) {
      filteredCards = filteredCards.filter(card =>
        card.assignedTo && searchFilters.assignees.includes(card.assignedTo)
      );
    }
    
    // Apply due date filter (placeholder - would need actual due date in card)
    if (searchFilters.dueDate) {
      // For now, just return the filtered cards
      // In a real implementation, we would filter by due date here
    }
    
    return filteredCards;
  }
);


export const updateCardSequence = createAsyncThunk(
  'card/updateCardSequence',
  async (obj: CardPatch, { getState }) => {
    const { board } = getState() as { board: BoardSlice };
    const { _id, title, description, columnId, sequence } = obj;

    const data = {
      title,
      description,
      columnId,
      sequence
    };

    const url = `${host}/api/boards/${board.board._id}/cards/${_id}`;

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

    const inJSON = await response.json();

    return inJSON;
  }
);

export const cardsSlice = createSlice({
  name: 'cards',
 initialState: initialState,
  reducers: {
    resetCards: () => initialState,
    updateCardSequenceToLocalState: (state, { payload }) => {
      const cardIndex = findIndex(state.cards, { _id: payload._id });

      state.cards[cardIndex].sequence = payload.sequence;
      state.cards[cardIndex].columnId = payload.columnId;
    },
    // WebSocket event handlers
    handleCardMoved: (state, action: PayloadAction<WebSocketCardMovePayload>) => {
      const { card, oldColumnId, newColumnId } = action.payload;
      
      // Find the card index in the old column
      const cardIndex = state.cards.findIndex(c => c._id === card._id);
      
      if (cardIndex !== -1) {
        // Update the card's columnId and sequence
        state.cards[cardIndex].columnId = newColumnId;
        state.cards[cardIndex].sequence = card.sequence;
      }
    },
    handleCardUpdated: (state, action: PayloadAction<WebSocketCardUpdatePayload>) => {
      const { card } = action.payload;
      
      const cardIndex = state.cards.findIndex(c => c._id === card._id);
      
      if (cardIndex !== -1) {
        // Update the card with new data
        state.cards[cardIndex] = { ...state.cards[cardIndex], ...card };
      }
    },
    handleCardDeleted: (state, action: PayloadAction<WebSocketCardDeletePayload>) => {
      const { cardId } = action.payload;
      
      // Remove the card from the state
      state.cards = state.cards.filter(card => card._id !== cardId);
    }
 },
  extraReducers: (builder) => {
    builder
      .addCase(addCard.pending, (state) => {
        state.isRequesting = true;
        state.status = 'pending';
      })
      .addCase(addCard.fulfilled, (state) => {
        state.status = 'success';
        state.isRequesting = false;
      })
      .addCase(addCard.rejected, (state) => {
        state.status = 'failed';
        state.isRequesting = false;
      })
      .addCase(fetchCards.pending, (state) => {
        state.status = 'pending';
        state.isRequesting = true;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        const payload: any = action.payload;

        if (!Array.isArray(payload)) {
          // Backend returned an error object or unexpected shape; keep cards as empty array
          state.cards = [];
          state.status = 'failed';
          state.error = payload || { message: 'Invalid payload for fetchCards' };
          state.isRequesting = false;
          return;
        }

        state.cards = payload;
        state.status = 'success';
        state.isRequesting = false;
      })
      .addCase(fetchCards.rejected, (state) => {
        state.status = 'failed';
        state.isRequesting = false;
        // action.payload may contain error info, but it's not available here without changing signature
      })
      .addCase(deleteCard.pending, (state) => {
        state.status = 'pending';
        state.isDeleting = true;
      })
      .addCase(deleteCard.fulfilled, (state) => {
        state.status = 'success';
        state.isDeleting = false;
      })
      .addCase(deleteCard.rejected, (state) => {
        state.status = 'failed';
        state.isDeleting = false;
      })
      .addCase(updateCard.pending, (state) => {
        state.status = 'pending';
        state.isRequesting = true;
      })
      .addCase(updateCard.fulfilled, (state) => {
        state.status = 'success';
        state.isRequesting = false;
      })
      .addCase(updateCard.rejected, (state) => {
        state.status = 'failed';
        state.isRequesting = false;
      })
      .addCase(updateCardSequence.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(updateCardSequence.fulfilled, (state) => {
        state.status = 'success';
      })
      .addCase(updateCardSequence.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(updateSearchFilters.fulfilled, (state, action) => {
        state.searchFilters = { ...state.searchFilters, ...action.payload };
      })
      .addCase(applySearchFilters.fulfilled, (state, action) => {
        state.filteredCards = action.payload;
      });
  }
});

export const { 
  resetCards, 
  updateCardSequenceToLocalState, 
  handleCardMoved,
  handleCardUpdated,
  handleCardDeleted
} = cardsSlice.actions;

export default cardsSlice.reducer;
