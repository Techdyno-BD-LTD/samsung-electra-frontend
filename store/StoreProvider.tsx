"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { setCartItems } from "./features/cart/cartSlice";

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  // Use a ref to ensure we only dispatch initial load once
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      if (typeof window !== "undefined") {
        try {
          const storedCart = localStorage.getItem("samsung-electra-cart");
          if (storedCart) {
            const parsedItems = JSON.parse(storedCart);
            if (Array.isArray(parsedItems)) {
              store.dispatch(setCartItems(parsedItems));
            }
          }
        } catch (error) {
          console.error("Failed to load cart from local storage", error);
        }
      }
      initialized.current = true;
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
