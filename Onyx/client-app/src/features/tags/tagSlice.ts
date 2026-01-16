import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { Tag } from '../../types';

interface TagState {
  items: Tag[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: TagState = {
  items: [],
  status: 'idle',
};

export const fetchTags = createAsyncThunk('tags/fetchTags', async () => {
  const response = await api.get<Tag[]>('/Tags');
  return response.data;
});

const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTags.fulfilled, (state, action) => {
      state.items = action.payload;
      state.status = 'succeeded';
    });
  },
});

export default tagSlice.reducer;
