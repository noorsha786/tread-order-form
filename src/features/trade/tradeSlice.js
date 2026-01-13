import { createSlice } from '@reduxjs/toolkit';
import {submitTrade} from '../trade/tradeThunks'

const tradeSlice = createSlice({
  name: 'trade',
  initialState: {
    loading: false,
    success: false,
  },
  reducers: {
    resetTrade(state) {
      state.success = false;
    },
  }, 
  extraReducers: (builder) => {
    builder
        .addCase(submitTrade.pending, state => {
        state.loading = true;
        })
        .addCase(submitTrade.fulfilled, state => {
            state.loading = false;
            state.success = true;
        });
  },
});

export const { resetTrade } = tradeSlice.actions;
export default tradeSlice.reducer;
