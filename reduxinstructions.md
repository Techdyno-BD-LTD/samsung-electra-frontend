# Redux Toolkit Implementation for Samsung Electra Cart

This document outlines how the shopping cart state management was migrated from React Context to **Redux Toolkit (RTK)**, including local storage persistence.

## 1. Architecture Overview

The state management is centralized in a Redux store, located in the `/store` directory. It follows the standard Redux Toolkit pattern with slices, typed hooks, and a provider component.

### File Structure
- `store/store.ts`: The main Redux store configuration.
- `store/hooks.ts`: Typed versions of `useSelector` and `useDispatch`.
- `store/StoreProvider.tsx`: A wrapper component to provide the store to the Next.js App Router.
- `store/features/cart/cartSlice.ts`: The logic for cart operations (add, remove, update).
- `lib/currencyUtils.ts`: Helper functions for parsing and formatting currency strings.

## 2. Global State Synchronization (LocalStorage)

Persistence is handled automatically in `store/store.ts` using a store subscription. 

```typescript
store.subscribe(() => {
  if (typeof window !== "undefined") {
    const state = store.getState();
    localStorage.setItem("samsung-electra-cart", JSON.stringify(state.cart.items));
  }
});
```

When the app initializes, the `StoreProvider.tsx` component reads from `localStorage` and dispatches a `setCartItems` action to rehydrate the state.

## 3. How to Use

### Accessing State
To access the cart items or total count, use the typed `useAppSelector` hook:

```typescript
const cartItems = useAppSelector((state) => state.cart.items);
const totalCount = useAppSelector((state) => 
  state.cart.items.reduce((total, item) => total + item.quantity, 0)
);
```

### Dispatching Actions
To modify the cart, use the typed `useAppDispatch` hook along with the exported actions from the cart slice:

```typescript
const dispatch = useAppDispatch();

// Adding an item
dispatch(addToCart({ id, title, price, ... }));

// Removing an item
dispatch(removeFromCart(itemId));

// Updating quantity
dispatch(updateQuantity({ id: itemId, newQuantity: 5 }));
```

## 4. Currency Handling
Since product prices are stored as strings (e.g., `"৳ 1,50,000"`), always use the utilities in `lib/currencyUtils.ts` before performing calculations:

- `parseCurrency(string)`: Converts `৳ 1,50,000` -> `150000`.
- `formatCurrency(number)`: Converts `150000` -> `৳1,50,000`.

## 5. Components Updated
- `app/layout.tsx`: Wrapped with `StoreProvider`.
- `components/common/ProductCard.tsx`: Uses `dispatch(addToCart)`.
- `components/layout/MainBar.tsx`: Displays real-time cart count.
- `components/layout/MobileNavbar.tsx`: Displays real-time cart count.
- `app/cart/page.tsx`: Full dynamic integration for viewing/editing the cart.
