import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

const initialState = {
  timeOut: false,
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setAppTimeOut: (state, action: PayloadAction<boolean>) => {
      return {
        timeOut: action.payload,
      };
    },
  },
});

export const { setAppTimeOut } = appSlice.actions;

export default appSlice.reducer;

export const timeOut = (state: RootState) => state.app.timeOut;
