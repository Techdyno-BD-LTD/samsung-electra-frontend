import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});

// Simple subscription to save to localStorage every time the state changes
store.subscribe(() => {
  if (typeof window !== "undefined") {
    try {
      const state = store.getState();
      localStorage.setItem("samsung-electra-cart", JSON.stringify(state.cart.items));
    } catch (e) {
      console.error("Could not save cart state", e);
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
