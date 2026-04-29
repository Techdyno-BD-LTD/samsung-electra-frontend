import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  user_type: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
      }
    },
    loadStoredAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        const userStr = localStorage.getItem('auth_user');
        if (token && userStr) {
          try {
            state.user = JSON.parse(userStr);
            state.token = token;
            state.isAuthenticated = true;
          } catch (e) {
            console.error('Failed to parse stored user', e);
          }
        }
      }
    },
  },
});

export const { setCredentials, logout, loadStoredAuth } = authSlice.actions;

export default authSlice.reducer;
