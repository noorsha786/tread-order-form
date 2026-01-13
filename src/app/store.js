import { configureStore } from '@reduxjs/toolkit';
import tradeReducer from '../features/trade/tradeSlice';

export const store = configureStore({
  reducer: {
    trade: tradeReducer,
  },
});
