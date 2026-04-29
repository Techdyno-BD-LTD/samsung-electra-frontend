import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  title: string;
  brand: string;
  image: string;
  price: string;
  originalPrice: string;
  discountPercent: string;
  saveAmount: string;
  color?: string;
  type?: string;
  weight?: string;
  variant?: string;
  slug?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },
    addToCart: (state, action: PayloadAction<Omit<CartItem, "quantity"> & { quantity?: number }>) => {
      const item = action.payload;
      const existingItem = state.items.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity || 1;
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; newQuantity: number }>) => {
      const { id, newQuantity } = action.payload;
      if (newQuantity < 1) return;
      const item = state.items.find(i => i.id === id);
      if (item) {
        item.quantity = newQuantity;
      }
    },
    updateItemDetails: (state, action: PayloadAction<{ id: string; updates: Partial<CartItem> }>) => {
      const { id, updates } = action.payload;
      const index = state.items.findIndex(i => i.id === id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { setCartItems, addToCart, removeFromCart, updateQuantity, updateItemDetails, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
