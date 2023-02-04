import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { User } from '../services/users';

type AuthState = {
  user: User | null;
  token: string | null;
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null } as unknown as AuthState,
  reducers: {
    setAuth: (
      state,
      {
        payload: { user, access_token },
      }: PayloadAction<{ user: User; access_token: string }>,
    ) => {
      state.user = user;
      state.token = access_token;
    },
    resetAuth: (state) => {
      state.user = null;
      state.token = null;
    },
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = {
        ...state.user,
        ...action.payload,
      };
    },
  },
});

export const { setAuth, resetAuth, updateUser } = authSlice.actions;

export default authSlice.reducer;

export const currentUser = (state: RootState) => state.auth.user;
export const isLoggedIn = (state: RootState) => state.auth.user !== null;
