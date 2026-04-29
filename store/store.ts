import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cart/cartSlice';
import orderReducer from './features/order/orderSlice';
import wishlistReducer from './features/wishlist/wishlistSlice';
import compareReducer from './features/compare/compareSlice';
import authReducer from './features/auth/authSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
    compare: compareReducer,
    auth: authReducer,
  },
});

// Simple subscription to save to localStorage every time the state changes
store.subscribe(() => {
  if (typeof window !== "undefined") {
    try {
      const state = store.getState();
      localStorage.setItem("samsung-electra-cart", JSON.stringify(state.cart.items));
      localStorage.setItem("samsung-electra-wishlist", JSON.stringify(state.wishlist.items));
      localStorage.setItem("samsung-electra-compare", JSON.stringify(state.compare.slots));
    } catch (e) {
      console.error("Could not save cart state", e);
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
