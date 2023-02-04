import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

import { Fireplace } from '../services/fireplaces';

const initialState: Fireplace = {
  uid: '',
  username: '',
  profileImageUrl: '',
  sentCount: 0,
  data: [],
  meta: {
    page: 0,
    take: 0,
    totalCount: 0,
    pageCount: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },
};

export const fireplaceSlice = createSlice({
  name: 'fireplace',
  initialState,
  reducers: {
    setFireplace: (state, action: PayloadAction<Fireplace>) => {
      return {
        ...action.payload,
      };
    },
    resetFireplace: (state) => {
      return initialState;
    },
  },
});

export const { setFireplace, resetFireplace } = fireplaceSlice.actions;

export default fireplaceSlice.reducer;

export const currentFireplace = (state: RootState) => state.fireplace;
export const currentFireplaceStockings = (state: RootState) =>
  state.fireplace.data;
