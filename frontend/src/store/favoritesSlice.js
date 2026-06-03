import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchFavorites = createAsyncThunk('favorites/fetchFavorites', async (token) => {
  const res = await fetch('http://localhost:4000/api/favorites', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
});

export const addFavorite = createAsyncThunk('favorites/addFavorite', async ({ token, bookId }) => {
  await fetch('http://localhost:4000/api/favorites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ bookId }),
  });
  return bookId;
});

export const removeFavorite = createAsyncThunk('favorites/removeFavorite', async ({ token, bookId }) => {
  const res = await fetch(`http://localhost:4000/api/favorites/${bookId}`, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'Failed to remove favorite');
  }
  return { bookId, message: data.message };
});

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: { items: [], status: 'idle' },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchFavorites.pending, state => { state.status = 'loading'; })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, state => { state.status = 'failed'; })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(book => book.id !== action.payload.bookId);
      });
  },
});

export default favoritesSlice.reducer;
