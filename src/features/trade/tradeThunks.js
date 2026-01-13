import { createAsyncThunk } from '@reduxjs/toolkit';

export const submitTrade = createAsyncThunk(
  'trade/submit',
  async (tradeData) => {
    await new Promise(res => setTimeout(res, 1000));
    return tradeData;
  }
);
