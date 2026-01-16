import { configureStore } from '@reduxjs/toolkit';
import taskReducer from './features/tasks/taskSlice';
import tagReducer from './features/tags/tagSlice';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    tags: tagReducer,
    auth: authReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
