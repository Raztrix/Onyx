import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// 1. Define what a User looks like
export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
}

// 2. Define the State
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// 3. Check LocalStorage (so login persists after refresh)
const storedUser = localStorage.getItem('onyx_user');
const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  isAuthenticated: !!storedUser, // true if user exists, false if null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Call this when API returns success
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      // Save to browser storage
      localStorage.setItem('onyx_user', JSON.stringify(action.payload));
    },
    // Call this when clicking "Logout"
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('onyx_user');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
