import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import tradeReducer from '../features/trade/tradeSlice';

export function renderWithRedux(ui, options = {}) {
  const store = configureStore({
    reducer: {
      trade: tradeReducer,
    },
    preloadedState: options.preloadedState,
  });

  return render(<Provider store={store}>{ui}</Provider>);
}
