import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderItem {
  id: string;
  title: string;
  brand: string;
  image: string;
  price: string;
  originalPrice: string;
  quantity: number;
  color?: string;
}

export interface LastOrder {
  orderId: string;
  paymentMethod: string;
  deliveryDate: string;
  items: OrderItem[];
  subtotal: number;
  savings: number;
  tax: number;
  delivery: number;
  total: number;
}

interface OrderState {
  lastOrder: LastOrder | null;
}

const initialState: OrderState = {
  lastOrder: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setLastOrder: (state, action: PayloadAction<LastOrder>) => {
      state.lastOrder = action.payload;
    },
    clearLastOrder: (state) => {
      state.lastOrder = null;
    },
  },
});

export const { setLastOrder, clearLastOrder } = orderSlice.actions;

export default orderSlice.reducer;
