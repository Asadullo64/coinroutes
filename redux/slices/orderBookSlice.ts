import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface OrderBookState {
  bids: { price: string; size: string }[];
  asks: { price: string; size: string }[];
  bestBid: { price: number; quantity: number };
  bestAsk: { price: number; quantity: number };
}

const initialState: OrderBookState = {
  bids: [],
  asks: [],
  bestBid: { price: 0, quantity: 0 },
  bestAsk: { price: 0, quantity: 0 },
};

const orderBookSlice = createSlice({
  name: 'orderBook',
  initialState,
  reducers: {
    updateOrderBook(state, action: PayloadAction<OrderBookState>) {
      state.bids = action.payload.bids;
      state.asks = action.payload.asks;
      state.bestBid = {
        price: parseFloat(state.bids[0]?.price) || 0,
        quantity: parseFloat(state.bids[0]?.size) || 0,
      };
      state.bestAsk = {
        price: parseFloat(state.asks[0]?.price) || 0,
        quantity: parseFloat(state.asks[0]?.size) || 0,
      };
    },
  },
});

export const { updateOrderBook } = orderBookSlice.actions;
export default orderBookSlice.reducer;
