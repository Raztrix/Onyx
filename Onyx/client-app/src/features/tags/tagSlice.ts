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

export const createTag = createAsyncThunk('tags/createTag', async (tagName: string) => {
  const response = await fetch('http://localhost:5000/api/tags', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: tagName }),
  });
  return await response.json();
});

const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.items.push(action.payload);
      });
  },
});

export default tagSlice.reducer;
