import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';
import { AddStockingRequest } from '../services/stockings';

const initialState: AddStockingRequest = {
  fireplaceId: '',
  nickname: '',
  message: '',
  color: '',
  pattern: '',
  items: [],
  imageUrl: '',
};

export const stockingsSlice = createSlice({
  name: 'stocking',
  initialState,
  reducers: {
    setStocking: (state, action: PayloadAction<AddStockingRequest>) => {
      return {
        ...action.payload,
      };
    },
    resetStocking: (state) => {
      return initialState;
    },
  },
});

export const { setStocking, resetStocking } = stockingsSlice.actions;

export default stockingsSlice.reducer;

export const currentStocking = (state: RootState) => state.stocking;
